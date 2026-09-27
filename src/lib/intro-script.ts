import { FACTS } from "../data/facts";
import { EXIT_MS, FACT_LEAD_MS, FACT_MS, HARD_CAP_MS, MIN_MS, SOFT_CAP_MS } from "./intro";
import { DESKTOP } from "./media";

type Kind = "full" | "brief";

type Config = {
  exit: number;
  soft: Record<Kind, number>;
  hard: number;
  min: Record<Kind, number>;
  desktop: string;
  /** `next dev`: React's development build hydrates about four times slower. */
  dev: boolean;
  /** How many facts there are, how long each is up, and when the first arrives after the panel paints. */
  facts: number;
  fact: number;
  lead: number;
};

/**
 * What loading a page took on this browser's earlier visits, smoothed, by
 * path (`g`: the latest from any path). Each entry is ms after the head script
 * ran until the load event, hydration, ready and the panel's first paint.
 */
type Book = { v: 1; p: Record<string, number[]>; g?: number[] };

/**
 * The first-load intro's head script. It decides, before the first paint,
 * whether this load gets an intro at all, runs its progress bar against an
 * estimate of the load, and lifts it once the page reports it is ready (see
 * `introReady`). Serialised whole into the document by `INTRO_SCRIPT`, so it
 * stands alone: nothing from the module around it, everything it needs in `c`.
 *
 *  - It skips lite mode and reduced motion, where the page shows at once.
 *  - It plays the full intro when this browser has not seen it for six hours,
 *    and a brief one otherwise, with a shorter minimum (`MIN_MS`).
 *  - It holds the page still underneath: a wheel, a swipe or a scroll key
 *    while the intro is up would move a page nobody can see, and uncover it
 *    somewhere else. Non-passive listeners block scrolling on the compositor,
 *    so they come off the moment the intro lifts.
 *  - It deals the facts the panel shows (`FACTS`) from a deck shuffled once
 *    per browser and kept in localStorage, carrying on where the last visit
 *    stopped, so a return visit opens on one it has not seen.
 *
 * The bar. It used to be a fixed creep — most of the way in the first seconds,
 * then a crawl — so it said nothing about the load: on a slow machine it sat
 * near the end for most of the wait, on a fast one it was cut off halfway. Now
 * it runs on an estimate of when the page will be ready, in three legs, each
 * ending at a moment the load really passes: the load event (the page's files
 * are in), hydration (`introHydrated`), ready.
 *  - The estimate is what the last visits on this browser took, by page. With
 *    none, it is worked out from a 4ms probe of how fast this processor is,
 *    the connection's round trip and bandwidth, and whether the page will be
 *    laid out with its pinned sections (twice the setup after hydrating).
 *    The formulas are fitted to loads measured at 1x to 6x CPU throttling and
 *    on fast and slow 4G.
 *  - The bar moves steadily toward full at the estimated end, but never past
 *    where the leg in progress should end. The panel's first paint, against
 *    the record's, re-times the plan early — sooner mostly means a warm
 *    cache — and each leg's end re-times the rest by how that leg went. When
 *    one runs late the bar slows to a creep toward its limit instead of
 *    stopping, and the rest is pushed back.
 *  - It is driven through the Web Animations API, so the compositor runs it
 *    while hydration keeps the main thread busy; each re-plan starts from
 *    where the bar is, so it never jumps back. Until the bar exists the
 *    stylesheet's fallback creep runs it.
 *  - Ready ends it: the bar runs out exactly as the panel lifts, at the
 *    minimum if that is still to come — counted from the panel's first
 *    contentful paint, which on a busy machine comes most of a second after
 *    this script. The loads it saw are recorded.
 *  - Beside the bar, its position as a percentage, and the status line's
 *    stage (`data-intro-stage`): loading, putting it together, final touches
 *    by the bar's position — or, once the wait passes 4.5 seconds or a step
 *    of it runs late, a word of reassurance instead.
 *
 * The caps. It checks every 200ms. It stops, and takes the holds off, once
 * `data-ready` is set or if `data-intro` has vanished: a root hydration
 * failure makes React rebuild <html>, which drops its attributes, and the
 * panel hides with them. It lifts the intro early, at `SOFT_CAP_MS`, only when
 * the app never started — its JavaScript was blocked or failed, so the page
 * has finished loading and `window.next.version`, which Next's app bootstrap
 * sets before hydrating, is unset (`.version`, because any element with
 * id="next" is also `window.next`). Otherwise it waits for ready, up to
 * `HARD_CAP_MS`. A fixed cap used to lift it over the server-rendered layout
 * whenever booting took longer. The caps count from the script running, not
 * from navigation start, so a slow server response does not eat into them.
 */
function introBoot(c: Config) {
  let off = () => {};
  try {
    const d = document.documentElement;
    if (d.hasAttribute("data-lite") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const now = () => performance.now();
    const t0 = now();
    const read = (key: string) => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null; // storage blocked: every visit is a first visit
      }
    };
    const write = (key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
      } catch {
        // storage blocked or full: nothing is remembered
      }
    };

    const wall = Date.now();
    const kind: Kind = wall - (Number(read("fa-intro")) || 0) > 216e5 ? "full" : "brief";
    write("fa-intro", String(wall));
    d.setAttribute("data-intro", kind);

    const opts = { passive: false };
    const keys: Record<string, 1> = { " ": 1, PageDown: 1, PageUp: 1, ArrowDown: 1, ArrowUp: 1, Home: 1, End: 1 };
    const hold = (e: Event) => {
      if (e.type !== "keydown" || keys[(e as KeyboardEvent).key]) e.preventDefault();
    };
    const held = ["wheel", "touchmove", "keydown"];
    held.forEach((type) => addEventListener(type, hold, opts));
    off = () => held.forEach((type) => removeEventListener(type, hold));

    // Replaced by the bar's and the facts' own once they run.
    let stop = () => {};
    let leaving = () => {};
    const lift = () => {
      off();
      stop();
      if (d.hasAttribute("data-ready")) return;
      leaving();
      d.setAttribute("data-ready", "");
      setTimeout(() => d.setAttribute("data-intro-done", ""), c.exit);
    };

    const soft = c.soft[kind];
    const booting = () => {
      const n = (window as Window & { next?: { version?: string } }).next;
      return !!(n && n.version) || document.readyState !== "complete";
    };
    const check = () => {
      if (d.hasAttribute("data-ready") || !d.hasAttribute("data-intro")) {
        off();
        stop();
        return;
      }
      const e = now() - t0;
      if (e < soft || (e < c.hard && booting())) setTimeout(check, 200);
      else lift();
    };
    setTimeout(check, 200);

    try {
      // First visit: an estimate from this device and connection. `cpuLoad` is its guess at the processor's share of the load leg.
      let cpuLoad = 0;
      const guess = () => {
        let n = 0;
        let x = 0;
        const s = now();
        let e = s;
        while ((e = now()) - s < 4) {
          for (let i = 0; i < 2000; i++) x = (x * 31 + i) | 0;
          n++;
        }
        // ~2 rounds per ms on the laptop the formulas were fitted on; `x` keeps the loop from being optimised away.
        // Capped: a probe this short can be caught by a stall, and what follows is steep in it.
        const slow = Math.min(6, Math.max(0.4, 2 / (n / (e - s) + (x & 1) * 1e-9)));
        const conn = (navigator as Navigator & { connection?: { rtt?: number; downlink?: number } }).connection;
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        const rtt =
          (conn && conn.rtt) || (nav ? Math.min(1000, Math.max(20, nav.responseStart - nav.requestStart)) : 100);
        // Evaluating the scripts, plus three round trips and ~300KB of scripts and fonts.
        cpuLoad = 700 * Math.pow(slow, 1.15);
        const load = cpuLoad + 3 * rtt + 2400 / ((conn && conn.downlink) || 10);
        // Then hydrating, and setting up the scroll effects — pinned sections are most of that.
        const pinned = matchMedia(c.desktop).matches;
        const hydrated = load + 230 * Math.pow(slow, 1.9) * (pinned ? 1 : 0.9) * (c.dev ? 4 : 1);
        return [load, hydrated, hydrated + 250 * Math.pow(slow, 1.3) * (pinned ? 1 : 0.5) * (c.dev ? 1.5 : 1)];
      };

      const path = location.pathname;
      let book: Book = { v: 1, p: {} };
      try {
        const saved = JSON.parse(read("fa-load") || "null");
        if (saved && saved.v === 1 && saved.p) book = saved;
      } catch {
        // unreadable: the record starts again
      }
      const known = book.p[path] || book.g;
      const valid =
        !!known &&
        known.length >= 3 &&
        known.slice(0, 3).every((v, i) => v > 0 && v < 6e4 && (!i || v >= known[i - 1]));
      // When the load event, hydration and ready are expected, ms after t0. Re-timed as the load goes.
      const plan = valid ? known.slice(0, 3) : guess();
      const orig = plan.slice();
      // When the panel first painted last time, to read this load against.
      const paintedBefore = valid && known[3] > 0 ? known[3] : 0;
      // When each of them came.
      const at: number[] = [];
      // The minimum counts from the panel's first paint, which a busy parser can hold back by most of a
      // second. Until that is known, from the bar being parsed; until then, from here.
      let exitAt = c.min[kind];
      let paintedAt = -1;

      // A repeat visit expected to be quick holds the facts back, so they only appear if the load runs long.
      const end = Math.max(plan[2], exitAt);
      const lead = kind === "brief" && end < 1300 ? Math.round(end + 250) : c.lead;
      d.style.setProperty("--fact-lead", lead + "ms");

      /*
       * The facts, dealt from a deck shuffled once per browser: each visit carries on where the
       * last one stopped, so a return visit opens on a fact it has not seen. Each one's turn goes
       * on <html> as `--f<n>`, which its element reads.
       */
      const n = c.facts;
      let deck: { order: number[]; next: number } = { order: [], next: 0 };
      try {
        const saved = JSON.parse(read("fa-facts") || "null");
        const ok = (v: unknown) => typeof v === "number" && v >= 0 && v < n && v % 1 === 0;
        const whole =
          saved && Array.isArray(saved.order) && saved.order.length === n && new Set(saved.order).size === n;
        if (whole && saved.order.every(ok) && ok(saved.next)) deck = saved;
      } catch {
        // unreadable: a new deck
      }
      if (!deck.order.length) {
        for (let j = 0; j < n; j++) deck.order.push(j);
        for (let j = n - 1; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1));
          const v = deck.order[j];
          deck.order[j] = deck.order[k];
          deck.order[k] = v;
        }
      }
      deck.order.forEach((fact, pos) => d.style.setProperty("--f" + fact, String((pos - deck.next + n) % n)));
      const deal = () => {
        // The ones up for a second or more count as seen: the next visit starts after them.
        const seen = Math.floor((now() - t0 - Math.max(0, paintedAt) - lead - 1000) / c.fact) + 1;
        if (seen < 1) return;
        deck.next = (deck.next + Math.min(n, seen)) % n;
        write("fa-facts", JSON.stringify(deck));
      };

      let bar: HTMLElement | null = null;
      let timer = 0;
      let stopped = false;
      stop = () => {
        stopped = true;
        clearTimeout(timer);
      };
      /*
       * The bar's current run: keyframes as [scaleX, offset], and when it started on this clock. Kept
       * here, not read back from the element: styles are only brought up to date between frames, a
       * thread busy hydrating skips most of those, and a run started from a stale reading slides the
       * bar backwards.
       */
      let run: { from: number; ms: number; f: number[][]; a: Animation } | null = null;
      const value = () => {
        if (!run) return 0;
        const q = Math.min(1, Math.max(0, (now() - run.from) / run.ms));
        const f = run.f;
        let i = 1;
        while (i < f.length - 1 && q > f[i][1]) i++;
        return f[i - 1][0] + ((f[i][0] - f[i - 1][0]) * (q - f[i - 1][1])) / Math.max(1e-6, f[i][1] - f[i - 1][1]);
      };
      const go = (f: number[][], ms: number) => {
        if (!bar || !bar.animate) return;
        const from = now();
        const a = bar.animate(
          f.map(([v, offset]) => ({ transform: "scaleX(" + v + ")", offset })),
          { duration: ms, fill: "both" },
        );
        // Running from now, not from whenever the thread next paints a frame, which can be most of a
        // second off: until then the last run carries on, and this one picks up where that has got to.
        a.startTime = from;
        if (run) run.a.cancel();
        run = { from, ms, f, a };
      };

      /*
       * The percentage: the bar's position as a number, written onto `--pct` (the stylesheet shows
       * it) ten times a second, and only when it changes. It is text, the one thing in the panel the
       * compositor cannot run, so it pauses while the thread is busy and catches up with the bar
       * after. It never says 100 until the page is ready.
       */
      let pct: HTMLElement | null = null;
      let shown = -1;
      const show = (v: number) => {
        if (!pct || v === shown) return;
        shown = v;
        pct.style.setProperty("--pct", '"' + v + '%"');
      };
      // What the status line says: the bar's stage, or reassurance once the wait runs long or a step of it runs late.
      let stage = "";
      let late = false;
      const tick = () => {
        if (stopped) return;
        const t = now() - t0;
        const p = value();
        show(Math.min(99, Math.floor(p * 100)));
        const next = p >= 0.85 ? "polish" : (late && t > 2500) || t > 4500 ? "slow" : p >= 0.4 ? "build" : "load";
        if (next !== stage) d.setAttribute("data-intro-stage", (stage = next));
        setTimeout(tick, 100);
      };
      leaving = () => {
        deal();
        // The number runs out with the bar's own sweep to full.
        const from = Math.max(0, shown);
        const start = now();
        const roll = () => {
          const q = Math.min(1, (now() - start) / 300);
          show(Math.round(from + (100 - from) * (1 - Math.pow(1 - q, 3))));
          if (q < 1) requestAnimationFrame(roll);
        };
        roll();
      };

      const step = () => {
        clearTimeout(timer);
        if (stopped || !bar) return;
        const t = now() - t0;
        const p = value();
        if (at[2] !== undefined) {
          // Ready: run out as the panel lifts. If that is now, the stylesheet's sweep finishes the bar.
          if (exitAt > t + 30) go([[p, 0], [1, 1]], exitAt - t);
          return;
        }
        const i = at[0] === undefined ? 0 : at[1] === undefined ? 1 : 2;
        if (plan[i] < t + 50) {
          /*
           * Late: expect this leg to run half as long again as it has so far (300ms at least). The
           * processor's legs, hydrating and what follows it, are slow together, so once hydrating
           * runs late the rest is stretched as much; the load leg's lateness can be the network's,
           * so the rest is only pushed back.
           */
          const from = i ? at[i - 1] : 0;
          const was = plan[i] - from;
          const legs = [plan[0], plan[1] - plan[0], plan[2] - plan[1]];
          plan[i] = t + Math.max(300, (t - from) / 2);
          const k = i ? Math.min(3, (plan[i] - from) / Math.max(1, was)) : 1;
          for (let j = i + 1; j < 3; j++) plan[j] = plan[j - 1] + legs[j] * k;
          late = true;
        }
        const due = plan[i] - t;
        const left = Math.min(c.hard, Math.max(plan[2], exitAt)) - t;
        // Where a steady bar would be as this leg ends: its limit until the leg does end.
        const cap = p + (1 - p) * Math.min(1, due / Math.max(due, left));
        const tail = Math.max(1500, 2 * due);
        go(
          [
            [p, 0],
            [p + (cap - p) * 0.92, due / (due + tail)],
            [p + (cap - p) * 0.995, 1],
          ],
          due + tail,
        );
        timer = window.setTimeout(step, due + 60);
      };

      /*
       * How much of the first `by` ms (after t0) some file of the page's was on its way: the
       * network's share of the load leg. Not when the last one landed — files fetched one after
       * another, each asked for by the last once it ran (`next dev` loads that way), land late
       * however fast the network is.
       */
      const busyBy = (by: number) => {
        let busy = 0;
        let edge = 0;
        (performance.getEntriesByType("resource") as PerformanceResourceTiming[])
          .filter((r) => r.responseEnd - t0 <= by)
          .map((r) => [Math.max(0, r.startTime - t0), r.responseEnd - t0])
          .sort((a, b) => a[0] - b[0])
          .forEach(([start, end]) => {
            if (end <= edge) return;
            busy += end - Math.max(start, edge);
            edge = end;
          });
        return busy;
      };

      let hidden = document.visibilityState === "hidden";
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") hidden = true;
      });
      // A load that was ever out of view — throttled, unwatched — says nothing about the next one.
      const save = () => {
        if (hidden || !(at[2] > 0 && at[2] < 6e4)) return;
        /*
         * A first visit that waited on the network — nothing cached yet — is recorded as the cached
         * load the next visit will most likely be: its load leg cut to what the processor spent on
         * it (at least a third: files are evaluated while the next ones download), and no first
         * paint to read against, as that came late for the same reason. Later visits are recorded
         * as they were: where files are never cached (`next dev`), every load waits on them.
         */
        const busy = busyBy(at[0]);
        const cut = !valid && busy > at[0] / 2 ? at[0] - Math.max(at[0] / 3, at[0] - busy) : 0;
        // Blended with this page's own record only: another page's, or a damaged one, is replaced.
        const old = valid && known === book.p[path] ? known : null;
        const got = [at[0], Math.max(at[0], at[1]), at[2], cut ? 0 : Math.max(0, paintedAt)].map((v, j) => {
          if (j < 3) v -= cut;
          return Math.round(old && old[j] > 0 && v > 0 ? old[j] * 0.4 + v * 0.6 : v);
        });
        delete book.p[path];
        book.p[path] = got;
        book.g = got;
        const paths = Object.keys(book.p);
        if (paths.length > 12) delete book.p[paths[0]];
        write("fa-load", JSON.stringify(book));
      };

      // Lifts at the minimum, or now if that has passed. Checked again when the time comes: the first paint can move it.
      const leave = () => {
        const wait = exitAt - (now() - t0);
        if (wait > 0) setTimeout(leave, wait);
        else lift();
      };

      const reached = (i: number) => {
        if (at[i] !== undefined) return;
        const t = now() - t0;
        at[i] = t;
        late = false;
        if (i === 2) {
          if (at[0] === undefined) at[0] = t;
          if (at[1] === undefined) at[1] = t;
          save();
          leave();
        } else if (i === 0) {
          // The files are in. What is left is the processor's work, so the network time so far says little about it.
          let f = Math.pow(Math.min(4, Math.max(0.25, t / orig[0])), 0.4);
          if (cpuLoad) {
            // First visit: the leg's time with no file on its way was the processor's, a far better
            // reading of its speed than the 4ms probe. At least a third of the leg: arriving files
            // are evaluated while the next ones download.
            f = Math.pow(Math.min(5, Math.max(0.2, Math.max(t / 3, t - busyBy(t)) / cpuLoad)), 0.9);
          }
          if (at[1] === undefined) plan[1] = t + (orig[1] - orig[0]) * f;
          plan[2] = (at[1] === undefined ? plan[1] : t) + (orig[2] - orig[1]) * f;
        } else if (at[0] !== undefined) {
          // Hydrated. What is left is more of the same work, so it scales with how long this took.
          const f = Math.pow(Math.min(4, Math.max(0.25, (t - at[0]) / Math.max(1, orig[1] - orig[0]))), 0.8);
          plan[2] = t + (orig[2] - orig[1]) * f;
        }
        step();
      };
      addEventListener("load", () => reached(0));
      addEventListener("intro:stage", (e) => {
        const name = (e as CustomEvent).detail;
        if (name === "hydrated") reached(1);
        else if (name === "ready") {
          reached(2);
          // Taken: the page leaves the exit to this script.
          e.preventDefault();
        }
      });

      // The bar is in the first markup after <head>: caught as it is parsed, so it moves from the first paint.
      const parsed = new MutationObserver(() => {
        bar = d.querySelector<HTMLElement>(".intro-bar > span");
        if (!bar) return;
        parsed.disconnect();
        // Just before the bar in the markup, so already parsed.
        pct = d.querySelector<HTMLElement>(".intro-pct");
        if (paintedAt < 0) exitAt = now() - t0 + c.min[kind];
        step();
        tick();
      });
      parsed.observe(d, { childList: true, subtree: true });
      try {
        // Its first contentful paint: a frame before that can have painted the page's background alone.
        const paints = new PerformanceObserver((list) => {
          const first = list.getEntriesByName("first-contentful-paint")[0];
          if (!first || paintedAt >= 0) return;
          paints.disconnect();
          paintedAt = first.startTime - t0;
          exitAt = paintedAt + c.min[kind];
          /*
           * The first reading of how this load is going against the record. Loosely: a paint far
           * sooner than last time mostly means the files came from the cache this time, which
           * shortens the load more than what follows it. Once the load event is in, that says more.
           */
          if (paintedBefore && at[0] === undefined) {
            const f = Math.pow(Math.min(3, Math.max(0.15, paintedAt / paintedBefore)), 0.35);
            const t = now() - t0;
            for (let j = 0; j < 3; j++) {
              orig[j] *= f;
              if (at[j] === undefined) plan[j] = Math.max(t + 50, orig[j]);
            }
          }
          step();
        });
        paints.observe({ type: "paint", buffered: true });
      } catch {
        // no paint timing: the minimum counts from the bar being parsed
      }
    } catch {
      // The bar keeps the stylesheet's creep, and the page times the exit itself (`introReady`).
    }
  } catch {
    // No intro rather than one that might never leave.
    off();
    document.documentElement.removeAttribute("data-intro");
  }
}

/** Inline and synchronous in <head>, after the lite-mode script it reads. See `introBoot`. */
export const INTRO_SCRIPT = `(${introBoot.toString()})(${JSON.stringify({
  exit: EXIT_MS,
  soft: SOFT_CAP_MS,
  hard: HARD_CAP_MS,
  min: MIN_MS,
  desktop: DESKTOP,
  dev: process.env.NODE_ENV === "development",
  facts: FACTS.length,
  fact: FACT_MS,
  lead: FACT_LEAD_MS,
} satisfies Config)});`;
