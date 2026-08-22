"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { scrollSignal } from "@/lib/scroll-signal";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const REDUCE = "(prefers-reduced-motion: reduce)";
const DESKTOP = "(min-width: 768px)";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Live height of the sticky utility bar.
 *
 * Pinned sections have to start *below* it, or their own header row is parked
 * underneath the bar and invisible. Measured off the element rather than read
 * from `--bar-h` so it stays right if the bar ever wraps.
 */
const barHeight = () =>
  document.querySelector<HTMLElement>("[data-utility-bar]")?.offsetHeight ?? 0;

/** Height of a pinned viewport: the screen, less the bar it sits under. */
const PINNED_HEIGHT = "h-[calc(100svh-var(--bar-h))]";

/** Snap easing shared by every pinned section, so they all settle alike. */
const SNAP = {
  duration: { min: 0.15, max: 0.5 },
  delay: 0.05,
  ease: "power2.inOut",
} as const;

/** Nearest entry in `points` to `value` — the shape ScrollTrigger's snapTo wants. */
const nearest = (points: number[], value: number) =>
  points.reduce(
    (best, p) => (Math.abs(p - value) < Math.abs(best - value) ? p : best),
    points[0] ?? 0,
  );

/**
 * Which flavour of an effect to render.
 *
 * `useMediaQuery`'s server snapshot is always `false`, so SSR resolves to
 * `{ motion: true, desktop: false }` — the mobile, never-pinned path. That is
 * the right default to ship in HTML: it is usable with no JavaScript at all,
 * and the real mode lands on the first client render without a hydration
 * mismatch (that is what `useSyncExternalStore` is for).
 */
export function useFxMode() {
  const reduce = useMediaQuery(REDUCE);
  const desktop = useMediaQuery(DESKTOP);
  return { motion: !reduce, desktop, pinned: !reduce && desktop };
}

/* ============================================================
 * ROOT — one mount in the layout
 * ============================================================ */

/**
 * Keeps ScrollTrigger honest and publishes the shared scroll signal.
 *
 * Pinned sections measure their distances up front, so anything that changes
 * layout after first paint — webfonts swapping in, images decoding, the load
 * curtain lifting — has to force a re-measure or every pin lands in the wrong
 * place.
 */
export function ScrollFxRoot() {
  useEffect(() => {
    /*
     * Twice, deliberately. A refresh measures with pin spacing reverted, then
     * restores it — so on the first pass a trigger that sits *below* a pin can
     * report a start thousands of pixels too high, which sorts it ahead of
     * that pin and leaves it measured against a page that no longer exists.
     * By the second pass the starts are right, the ordering is right, and the
     * positions settle.
     */
    const refresh = () => {
      ScrollTrigger.refresh();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    // The load curtain covers the page for ~1.2s; measure once it is gone.
    const curtain = window.setTimeout(refresh, 1500);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});

    const page = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        scrollSignal.page = self.progress;
        scrollSignal.velocity = gsap.utils.clamp(-1, 1, self.getVelocity() / 2500);
      },
    });

    /*
     * `onUpdate` stops firing the moment scrolling stops, which would leave
     * `velocity` frozen at whatever it last was — consumers would read the page
     * as permanently racing. Decaying it on the ticker means it falls back to
     * rest on its own.
     */
    const decay = () => {
      if (scrollSignal.velocity !== 0) {
        scrollSignal.velocity *= 0.9;
        if (Math.abs(scrollSignal.velocity) < 0.001) scrollSignal.velocity = 0;
      }
    };
    gsap.ticker.add(decay);

    return () => {
      window.clearTimeout(curtain);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(decay);
      page.kill();
    };
  }, []);

  return null;
}

/**
 * Publishes a section's own 0..1 pass as `scrollSignal[signal]`, for consumers
 * that animate outside React — the WebGL hero reads `hero` every frame.
 */
export function ScrollSignalSource({
  scope,
  signal,
}: {
  /** Selector for the element being measured. */
  scope: string;
  signal: "hero";
}) {
  useEffect(() => {
    const el = document.querySelector(scope);
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        scrollSignal[signal] = self.progress;
      },
    });
    return () => st.kill();
  }, [scope, signal]);

  return null;
}

/* ============================================================
 * SCROLL RAIL — the progress timeline
 * ============================================================ */

export type RailStep = { label: string; sub?: string };

/** Imperative setter a parent that already tracks progress writes through. */
export type RailHandle = { current: ((progress: number) => void) | null };

/**
 * A timeline that fills as a section is scrolled through.
 *
 * Progress arrives one of two ways: a parent that already runs a ScrollTrigger
 * writes through `handleRef`, or the rail drives itself from `scope`. Either
 * way the update path writes to the DOM directly — a progress bar that
 * re-rendered React on every scroll frame would be the most expensive thing on
 * the page.
 */
export function ScrollRail({
  steps,
  scope,
  handleRef,
  orientation = "vertical",
  className,
}: {
  steps: RailStep[];
  /** Selector whose viewport pass fills the rail. Ignored when `handleRef` is set. */
  scope?: string;
  handleRef?: RailHandle;
  orientation?: "vertical" | "horizontal";
  className?: string;
}) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const count = steps.length;

  const apply = useCallback(
    (progress: number) => {
      const p = gsap.utils.clamp(0, 1, progress);
      const fill = fillRef.current;
      if (fill) {
        if (orientation === "vertical") fill.style.height = `${p * 100}%`;
        else fill.style.width = `${p * 100}%`;
      }
      for (let i = 0; i < dotRefs.current.length; i += 1) {
        const dot = dotRefs.current[i];
        if (!dot) continue;
        const threshold = count > 1 ? i / (count - 1) : 0;
        dot.dataset.on = p + 0.0001 >= threshold ? "true" : "false";
      }
    },
    [orientation, count],
  );

  useEffect(() => {
    if (!handleRef) return;
    handleRef.current = apply;
    return () => {
      handleRef.current = null;
    };
  }, [apply, handleRef]);

  useEffect(() => {
    if (handleRef || !scope) return;
    const el = document.querySelector(scope);
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 72%",
      end: "bottom 65%",
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    return () => st.kill();
  }, [apply, handleRef, scope]);

  const dot =
    "block border border-ink/45 bg-paper transition-colors duration-300 data-[on=true]:border-cobalt data-[on=true]:bg-cobalt";

  if (orientation === "horizontal") {
    return (
      <div aria-hidden className={cn("relative h-px bg-ink/25", className)}>
        <span ref={fillRef} className="absolute inset-y-0 left-0 block bg-cobalt" style={{ width: 0 }} />
        {steps.map((s, i) => (
          <span
            key={s.label}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            data-on="false"
            className={cn(dot, "absolute top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2")}
            style={{ left: `${count > 1 ? (i / (count - 1)) * 100 : 0}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <ol className={cn("relative", className)}>
      <span aria-hidden className="absolute inset-y-0 left-[5px] w-px bg-ink/25" />
      <span ref={fillRef} aria-hidden className="absolute left-[5px] top-0 w-px bg-cobalt" style={{ height: 0 }} />
      {steps.map((s, i) => (
        <li key={s.label} className="relative py-3 pl-8">
          <span
            aria-hidden
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            data-on="false"
            className={cn(dot, "absolute left-0 top-[1.05rem] h-[11px] w-[11px]")}
          />
          <p className="display text-lg leading-none">{s.label}</p>
          {s.sub && <p className="label mt-1.5">{s.sub}</p>}
        </li>
      ))}
    </ol>
  );
}

/**
 * `overflow: hidden` stops the *user* scrolling a pinned viewport, not the
 * browser: focusing a child that sits outside the box, or a find-in-page hit,
 * still makes it scroll programmatically. That silently desynchronises the
 * container from the transform GSAP is driving and leaves the section drawn
 * in the wrong place, so snap it straight back.
 */
function usePinnedScrollGuard(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const reset = () => {
      if (el.scrollLeft !== 0) el.scrollLeft = 0;
      if (el.scrollTop !== 0) el.scrollTop = 0;
    };
    el.addEventListener("scroll", reset, { passive: true });
    return () => el.removeEventListener("scroll", reset);
  }, [ref, active]);
}

/* ============================================================
 * HORIZONTAL SCROLL — vertical wheel, horizontal travel
 * ============================================================ */

type HMode = "pinned" | "swipe" | "stack";
const HScrollContext = createContext<HMode>("swipe");

/**
 * Pins a section and turns downward scrolling into horizontal travel.
 *
 * Three modes, read from the user's own settings rather than guessed:
 *  - `pinned` — desktop with motion allowed. The section locks to the viewport
 *    and the track slides left as the wheel turns.
 *  - `swipe` — small screens. Pinning fights mobile URL-bar resizing and
 *    momentum scrolling, so the track becomes a native snap carousel instead.
 *  - `stack` — reduced motion. No pin, no travel: panels stack down the page,
 *    which is what someone asking for less motion actually wants to read.
 *
 * DOM order is reading order in every mode, so tab order is already correct.
 * While pinned, focusing an off-screen panel scrolls the page to it — a
 * keyboard user would otherwise be typing into something they cannot see.
 */
export function HorizontalScroll({
  children,
  steps,
  label,
  className,
  trackClassName,
}: {
  children: ReactNode;
  /** One entry per panel — drives the rail ticks and the counter. */
  steps: RailStep[];
  label: string;
  className?: string;
  trackClassName?: string;
}) {
  const { pinned, motion } = useFxMode();
  const mode: HMode = pinned ? "pinned" : motion ? "swipe" : "stack";

  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<((p: number) => void) | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const total = steps.length;

  usePinnedScrollGuard(viewportRef, mode === "pinned");

  const report = useCallback(
    (progress: number) => {
      railRef.current?.(progress);
      const counter = counterRef.current;
      if (!counter) return;
      const index = Math.min(total, Math.floor(progress * total) + 1);
      const next = `[${pad(index)}/${pad(total)}]`;
      if (counter.textContent !== next) counter.textContent = next;
    },
    [total],
  );

  /* pinned: GSAP drives the track */
  useEffect(() => {
    if (mode !== "pinned") return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      /*
       * Panels are deliberately different widths, so evenly spaced snap
       * increments would land between them. Derive the stops from where the
       * panels actually sit, recomputed on every snap so a resize can't stale
       * them.
       */
      const stops = () => {
        const span = distance();
        if (span <= 0) return [0];
        return Array.from(track.querySelectorAll<HTMLElement>("[data-hpanel]")).map((panel) =>
          gsap.utils.clamp(0, 1, panel.offsetLeft / span),
        );
      };

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: () => `top top+=${barHeight()}`,
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: (value) => nearest(stops(), value), ...SNAP },
          onUpdate: (self) => report(self.progress),
          onRefresh: (self) => report(self.progress),
        },
      });
      stRef.current = tween.scrollTrigger ?? null;
    }, viewport);

    return () => {
      ctx.revert();
      stRef.current = null;
    };
  }, [mode, report]);

  /* pinned: keep keyboard focus on screen */
  useEffect(() => {
    if (mode !== "pinned") return;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const onFocusIn = (event: FocusEvent) => {
      const st = stRef.current;
      const panel = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-hpanel]");
      if (!st || !panel) return;

      // Undo whatever the browser did to reveal the panel before measuring —
      // this container's position belongs to GSAP, and the page scroll below
      // is how the panel is actually brought into view.
      viewport.scrollLeft = 0;
      viewport.scrollTop = 0;

      // Already fully visible — an ordinary mouse click, nothing to correct.
      const box = panel.getBoundingClientRect();
      if (box.left >= 0 && box.right <= window.innerWidth) return;

      const distance = track.scrollWidth - viewport.clientWidth;
      if (distance <= 0) return;
      const ratio = gsap.utils.clamp(0, 1, panel.offsetLeft / distance);
      window.scrollTo({ top: st.start + (st.end - st.start) * ratio });
    };

    track.addEventListener("focusin", onFocusIn);
    return () => track.removeEventListener("focusin", onFocusIn);
  }, [mode]);

  /* swipe: mirror the native scroller into the rail */
  useEffect(() => {
    if (mode !== "swipe") return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      const span = scroller.scrollWidth - scroller.clientWidth;
      report(span > 0 ? scroller.scrollLeft / span : 0);
    };
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [mode, report]);

  return (
    <HScrollContext.Provider value={mode}>
      <div className={cn("relative", className)} data-fx={mode}>
        <div
          ref={viewportRef}
          className={cn("flex flex-col", mode === "pinned" && `${PINNED_HEIGHT} overflow-hidden`)}
        >
          <div className="wrap flex items-center gap-5 py-5 md:py-6">
            <span className="label whitespace-nowrap text-ink">{label}</span>
            {mode !== "stack" && (
              <>
                <ScrollRail
                  steps={steps}
                  handleRef={railRef}
                  orientation="horizontal"
                  className="hidden flex-1 sm:block"
                />
                <span ref={counterRef} className="label ml-auto tabular-nums sm:ml-0">
                  [{pad(1)}/{pad(total)}]
                </span>
              </>
            )}
          </div>

          <div
            ref={scrollerRef}
            className={cn(
              "min-h-0 flex-1",
              mode === "swipe" &&
                "snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            <div
              ref={trackRef}
              className={cn(
                "relative flex px-5 md:px-10",
                mode === "stack" ? "flex-col" : "w-max flex-row items-stretch gap-8 md:h-full md:gap-14",
                trackClassName,
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </HScrollContext.Provider>
  );
}

/** One panel of a `HorizontalScroll`. Sizing follows the active mode. */
export function HPanel({
  children,
  className,
  width = "w-[84vw] sm:w-[62vw] md:w-[44vw] lg:w-[36vw]",
}: {
  children: ReactNode;
  className?: string;
  width?: string;
}) {
  const mode = useContext(HScrollContext);
  return (
    <article
      data-hpanel
      className={cn(
        "relative",
        mode === "stack" ? "w-full rule-t py-10 last:rule-b" : cn("shrink-0 snap-center", width),
        mode === "pinned" && "flex h-full flex-col justify-center",
        mode === "swipe" && "py-8",
        className,
      )}
    >
      {children}
    </article>
  );
}

/* ============================================================
 * TYPE TUNNEL — scroll through a word into the section
 * ============================================================ */

/**
 * The section pins behind a solid panel with a single word knocked out of it.
 * Scrolling grows that word until the hole swallows the screen, and what was
 * behind the panel all along is what you land on.
 *
 * Built as an SVG mask rather than `clip-path: text` because a mask can be
 * scaled past the viewport without the browser re-shaping the glyphs, which is
 * what keeps the acceleration smooth at the end of the run.
 *
 * Not pinned means no overlay at all: the children were always the real
 * content, so mobile and reduced motion simply read them.
 */
export function TypeTunnel({
  word,
  children,
  className,
  scale = 26,
  panel = "var(--ink)",
}: {
  word: string;
  children: ReactNode;
  className?: string;
  /** How far the knockout grows. Past ~6 it already clears a 16:9 screen. */
  scale?: number;
  /**
   * Colour of the panel being tunnelled through. It has to contrast with the
   * page behind it or the whole effect is invisible — a `--paper` panel over a
   * `--paper` page is a knockout showing the same colour it covers.
   */
  panel?: string;
}) {
  const { pinned } = useFxMode();
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const panelRef = useRef<SVGRectElement>(null);
  const maskId = useId().replace(/:/g, "");

  usePinnedScrollGuard(viewportRef, pinned);

  useEffect(() => {
    if (!pinned) return;
    const viewport = viewportRef.current;
    const text = textRef.current;
    const panelEl = panelRef.current;
    const content = contentRef.current;
    if (!viewport || !text || !panelEl || !content) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: viewport,
          start: () => `top top+=${barHeight()}`,
          end: () => `+=${window.innerHeight * 1.15}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: (value) => nearest([0, 1], value), ...SNAP },
        },
      });

      tl.fromTo(text, { scale: 1 }, { scale, ease: "power2.in", duration: 1 }, 0)
        // Modest start scale: any more and the viewport's own overflow crops
        // the content before the knockout has exposed any of it.
        .fromTo(content, { scale: 1.08, autoAlpha: 0.6 }, { scale: 1, autoAlpha: 1, ease: "none", duration: 1 }, 0)
        // Insurance: whatever the aspect ratio, the panel is gone by the end.
        .to(panelEl, { autoAlpha: 0, ease: "none", duration: 0.18 }, 0.82);
    }, viewport);

    return () => ctx.revert();
  }, [pinned, scale]);

  return (
    <div className={cn("relative", className)} data-fx={pinned ? "tunnel" : "flow"}>
      <div
        ref={viewportRef}
        className={cn("relative", pinned && `${PINNED_HEIGHT} overflow-hidden`)}
      >
        <div
          ref={contentRef}
          className={cn("h-full", pinned && "flex items-center justify-center text-center")}
        >
          {children}
        </div>

        {pinned && (
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse">
                <rect width="100%" height="100%" fill="#fff" />
                <text
                  ref={textRef}
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#000"
                  className="display"
                  style={{
                    fontSize: "clamp(4rem,17vw,15rem)",
                    // fill-box keeps the growth centred on the word itself
                    // rather than on the SVG's origin.
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                >
                  {word.toUpperCase()}
                </text>
              </mask>
            </defs>
            {/* `fill` set as a CSS property, not a presentation attribute —
                custom properties resolve reliably in one and not the other. */}
            <rect
              ref={panelRef}
              width="100%"
              height="100%"
              style={{ fill: panel }}
              mask={`url(#${maskId})`}
            />
          </svg>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * LOCKED STEPS — sticky aside, scroll-revealed list
 * ============================================================ */

/**
 * The aside locks to the viewport while the steps beside it are read, each one
 * resolving from dim to lit as it arrives. The rail in the aside tracks how far
 * through the list you are.
 */
export function LockedSteps({
  aside,
  steps,
  className,
  listClassName,
}: {
  aside: ReactNode;
  steps: { key: string; rail: RailStep; content: ReactNode }[];
  className?: string;
  listClassName?: string;
}) {
  const { motion } = useFxMode();
  const listRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<((p: number) => void) | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const rail = ScrollTrigger.create({
      trigger: list,
      start: "top 75%",
      end: "bottom 70%",
      onUpdate: (self) => railRef.current?.(self.progress),
      onRefresh: (self) => railRef.current?.(self.progress),
    });

    if (!motion) return () => rail.kill();

    const ctx = gsap.context(() => {
      list.querySelectorAll<HTMLElement>("[data-locked-step]").forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0.22, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              end: "top 58%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, list);

    return () => {
      rail.kill();
      ctx.revert();
    };
  }, [motion]);

  return (
    <div className={cn("grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16", className)}>
      <div className="md:sticky md:top-24 md:self-start">
        {aside}
        <ScrollRail steps={steps.map((s) => s.rail)} handleRef={railRef} className="mt-10 hidden md:block" />
      </div>
      <ol ref={listRef} className={listClassName}>
        {steps.map((s) => (
          <li key={s.key} data-locked-step className="rule-t py-8 last:rule-b">
            {s.content}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ============================================================
 * KINETIC HEADLINE — words break apart, converge, hold
 * ============================================================ */

/**
 * Scroll-scrubbed typography: the words start thrown off their line and are
 * pulled into place by the scroll itself, with a beat of stillness at the end
 * of the run so the finished line registers before the section moves on.
 *
 * Accent words keep the serif italic treatment used everywhere else on the
 * site, and take the emphasis beat.
 */
export function KineticHeadline({
  lines,
  accent = [],
  className,
  as: As = "h2",
  scatter = 1,
}: {
  lines: string[];
  /** Words (case-insensitive, punctuation-trimmed) rendered as accent italics. */
  accent?: string[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  scatter?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { motion } = useFxMode();

  useEffect(() => {
    if (!motion) return;
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const words = el.querySelectorAll<HTMLElement>("[data-kinetic-word]");
      if (!words.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          end: "top 34%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        words,
        {
          yPercent: 118,
          xPercent: (i: number) => ((i % 3) - 1) * 16 * scatter,
          rotate: (i: number) => (i % 2 ? 6 : -6) * scatter,
          autoAlpha: 0,
        },
        {
          yPercent: 0,
          xPercent: 0,
          rotate: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.14,
        },
      )
        // the hold — scrolling continues, the line does not
        .to({}, { duration: 0.55 })
        .to(el.querySelectorAll("[data-kinetic-accent]"), {
          scale: 1.05,
          duration: 0.35,
          ease: "power2.out",
          transformOrigin: "left center",
        });
    }, el);

    return () => ctx.revert();
  }, [motion, scatter]);

  const accentSet = new Set(accent.map((w) => w.toLowerCase()));
  const clean = (word: string) => word.toLowerCase().replace(/[^a-z0-9']/gi, "");

  return (
    <As ref={ref as never} className={className}>
      {lines.map((line) => {
        const words = line.split(" ");
        return (
          <span key={line} className="block">
            {words.map((word, wi) => {
              const marked = accentSet.has(clean(word));
              /*
               * The separating space has to be a sibling of the word, not the
               * last thing inside it. Trailing whitespace at the end of an
               * inline-block is stripped by white-space processing, which ran
               * every word in the line together.
               */
              return (
                <Fragment key={`${word}-${wi}`}>
                  <span
                    data-kinetic-word
                    {...(marked ? { "data-kinetic-accent": "" } : {})}
                    className={cn("inline-block will-change-transform", marked && "accent-word")}
                  >
                    {word}
                  </span>
                  {wi < words.length - 1 ? " " : null}
                </Fragment>
              );
            })}
          </span>
        );
      })}
    </As>
  );
}

/* ============================================================
 * PINNED LIT TEXT — the statement, read to you
 * ============================================================ */

/**
 * A statement held on screen and lit a word at a time as the page is scrolled.
 *
 * Pinning is the point: the reader is not chasing a paragraph up the screen,
 * they are standing still while it resolves out of the dark. Nothing moves —
 * only the text's own brightness — which is what keeps it calm at this size.
 *
 * `accent` words take the serif italic used everywhere else on the site, so
 * the line has some rhythm rather than being one even block of type.
 *
 * Without a pin (small screens, reduced motion) the copy is simply legible and
 * the section is an ordinary centred block.
 */
export function PinnedLitText({
  paragraphs,
  facts = [],
  lead,
  footer,
  accent = [],
  className,
  textClassName,
}: {
  /** One entry per block. Short blocks read far better than a single wall. */
  paragraphs: string[];
  /**
   * Marginalia. Each one arrives as the sweep reaches the word it annotates and
   * then stays, so by the end of the hold the statement is ringed by its own
   * footnotes rather than followed by a list of them.
   *
   * `anchor` is the word in the copy this fact belongs to — that word lights
   * cobalt at the same moment, which is what makes the pairing readable rather
   * than just decorative. `pos` places the card on wide screens, where there is
   * margin to scatter into; narrower ones lay the same cards out in a row.
   */
  facts?: { k: string; v: string; anchor?: string; pos?: string }[];
  /** Sits above the statement — label and heading. */
  lead?: ReactNode;
  /** Sits below it, inside the same held frame. */
  footer?: ReactNode;
  /** Words (case-insensitive, punctuation-trimmed) set in the accent face. */
  accent?: string[];
  className?: string;
  textClassName?: string;
}) {
  const { pinned } = useFxMode();
  /* Cards only scatter where there is margin either side of the column to
     scatter into. Below that they line up in a row instead of sitting on top
     of the very text they are annotating. */
  const wide = useMediaQuery("(min-width: 1280px)");
  const scatter = pinned && wide && facts.length > 0;
  const viewportRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLDListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  usePinnedScrollGuard(viewportRef, pinned);

  useEffect(() => {
    if (!pinned) return;
    const viewport = viewportRef.current;
    const el = copyRef.current;
    if (!viewport || !el) return;

    const ctx = gsap.context(() => {
      // Document order across every paragraph, so one sweep runs the whole way.
      const words = gsap.utils.toArray<HTMLElement>("[data-lit-word]", el);
      if (!words.length) return;

      /*
       * One timeline on one trigger, rather than a second ScrollTrigger for the
       * facts. Anything driven off its own trigger inside a pinned section stops
       * advancing the moment the pin engages — the section is no longer moving
       * through the viewport, so there is nothing left to measure.
       */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: viewport,
          start: () => `top top+=${barHeight()}`,
          // Long enough to read at, short enough not to feel trapped.
          end: () => `+=${window.innerHeight * 1.35}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.width = `${self.progress * 100}%`;
          },
        },
      });

      // The sweep: WORD_LIT to light one word, SWEEP to travel the statement.
      const WORD_LIT = 0.35;
      const SWEEP = 2.6;
      tl.fromTo(
        words,
        { opacity: 0.12 },
        { opacity: 1, ease: "none", duration: WORD_LIT, stagger: { amount: SWEEP } },
        0,
      );

      const span = tl.duration();
      const cards = factsRef.current
        ? gsap.utils.toArray<HTMLElement>("[data-fact]", factsRef.current)
        : [];
      if (!cards.length) return;

      /*
       * A card is timed off the word it annotates rather than off a slice of
       * the hold: `stagger.amount` spreads the sweep evenly across the words, so
       * the moment word `i` finishes lighting is known arithmetic. Facts with no
       * anchor fall back to an even spread.
       */
      const cobalt =
        getComputedStyle(document.documentElement).getPropertyValue("--cobalt").trim() || "#c8ff3d";
      const litAt = (i: number) =>
        (words.length > 1 ? (SWEEP * i) / (words.length - 1) : 0) + WORD_LIT;

      gsap.set(cards, { opacity: 0 });
      cards.forEach((card, i) => {
        const anchor = card.dataset.anchor?.toLowerCase();
        const wordIndex = anchor
          ? words.findIndex((w) => w.dataset.word === anchor)
          : -1;
        const at = wordIndex >= 0 ? litAt(wordIndex) : span * (0.2 + i * 0.3);

        // Nothing leaves. Each card stays put once it has arrived, so the
        // statement finishes the hold surrounded by everything it earned.
        tl.fromTo(
          card,
          { opacity: 0, y: 18, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" },
          at,
        );

        // The word and its note light together — that pairing is the whole
        // reason the card is where it is.
        if (wordIndex >= 0) {
          tl.to(words[wordIndex], { color: cobalt, duration: 0.3, ease: "none" }, at);
        }
      });
    }, viewport);

    return () => ctx.revert();
  }, [pinned]);

  const accentSet = new Set(accent.map((w) => w.toLowerCase()));
  const clean = (word: string) => word.toLowerCase().replace(/[^a-z0-9']/gi, "");

  return (
    <div className={cn("relative", className)} data-fx={pinned ? "pinned" : "flow"}>
      <div
        ref={viewportRef}
        className={cn(
          "relative flex flex-col items-center justify-center text-center",
          pinned && `${PINNED_HEIGHT} overflow-hidden`,
        )}
      >
        <div
          className={cn(
            "wrap flex flex-col items-center py-16 md:py-0",
            // Narrower column when cards are scattering, so they have margin to
            // land in rather than crowding the text.
            scatter ? "max-w-2xl" : "max-w-3xl",
          )}
        >
          {lead}

          <div ref={copyRef} className={cn("flex flex-col", textClassName)}>
            {paragraphs.map((block) => {
              const words = block.split(" ");
              return (
                <p key={block} className="text-pretty">
                  {words.map((word, i) => (
                    /*
                     * The space is a sibling of the word, never the last thing
                     * inside it: trailing whitespace at the end of an inline
                     * box is stripped, which ran every word together.
                     */
                    <Fragment key={`${word}-${i}`}>
                      <span
                        data-lit-word
                        data-word={clean(word)}
                        className={accentSet.has(clean(word)) ? "accent-word" : undefined}
                      >
                        {word}
                      </span>
                      {i < words.length - 1 ? " " : null}
                    </Fragment>
                  ))}
                </p>
              );
            })}
          </div>

          {/* How much of the hold is left, so the pin never feels open-ended. */}
          {pinned && (
            <span aria-hidden className="relative mt-10 block h-px w-24 bg-ink/20">
              <span ref={barRef} className="absolute inset-y-0 left-0 block bg-cobalt" style={{ width: 0 }} />
            </span>
          )}

          {footer}
        </div>

        {/*
          Marginalia, outside the column so it can use the whole frame. Wide
          screens scatter the cards into the margin at the point each one is
          earned; anything narrower lines them up under the copy, where they
          still arrive one at a time and still stay.
        */}
        {facts.length > 0 && (
          <dl
            ref={factsRef}
            className={cn(
              scatter
                ? "pointer-events-none absolute inset-0"
                : cn(
                    "wrap grid max-w-3xl gap-4 text-left",
                    pinned
                      ? "mt-9 grid-cols-3 [@media(max-height:760px)]:mt-6"
                      : "mt-12 grid-cols-1 border-t border-ink/15 pt-8",
                  ),
            )}
          >
            {facts.map((f) => (
              <div
                key={f.k}
                data-fact
                data-anchor={f.anchor}
                className={cn(
                  // The list is click-through so it never shadows the copy it
                  // sits over; the cards themselves stay selectable.
                  scatter && `pointer-events-auto absolute w-[15rem] ${f.pos ?? "left-[4%] top-[20%]"}`,
                  pinned && "opacity-0",
                )}
              >
                {/* Hairline down the left edge: the same rule motif the rest of
                    the page uses to mark an aside. */}
                <div className="cut-sm border-l-2 border-cobalt bg-paper-deep/90 px-4 py-3 backdrop-blur-[2px]">
                  <dt className="label text-cobalt">[{f.k}]</dt>
                  <dd className="mt-1.5 text-[13px] leading-5 text-ink-muted">{f.v}</dd>
                </div>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * MAGNETIC SURFACE
 * ============================================================ */

type Magnet = {
  el: HTMLElement;
  radius: number;
  strength: number;
  setX: (v: number) => void;
  setY: (v: number) => void;
  rect: DOMRect | null;
  near: boolean;
};

/*
 * One pointer listener and one rAF for every magnet on the page, rather than a
 * pair each. Rects are cached and invalidated on scroll/resize — and
 * invalidation writes a flag instead of reading layout, so nothing here forces
 * a reflow while the page is scrolling.
 */
const magnets = new Set<Magnet>();
let magnetFrame = 0;
let pointerX = 0;
let pointerY = 0;
let magnetListening = false;

function invalidateMagnets() {
  magnets.forEach((m) => {
    m.rect = null;
  });
}

function runMagnets() {
  magnetFrame = 0;
  magnets.forEach((m) => {
    if (!m.rect) m.rect = m.el.getBoundingClientRect();
    const r = m.rect;
    const dx = pointerX - (r.left + r.width / 2);
    const dy = pointerY - (r.top + r.height / 2);
    const near = Math.abs(dx) < r.width / 2 + m.radius && Math.abs(dy) < r.height / 2 + m.radius;

    if (near) {
      m.setX(dx * m.strength);
      m.setY(dy * m.strength);
      m.near = true;
      m.el.dataset.magnetic = "near";
    } else if (m.near) {
      m.setX(0);
      m.setY(0);
      m.near = false;
      m.el.dataset.magnetic = "idle";
    }
  });
}

function onMagnetPointerMove(event: PointerEvent) {
  if (event.pointerType === "touch") return;
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (!magnetFrame) magnetFrame = requestAnimationFrame(runMagnets);
}

function startMagnetListeners() {
  if (magnetListening) return;
  magnetListening = true;
  window.addEventListener("pointermove", onMagnetPointerMove, { passive: true });
  window.addEventListener("scroll", invalidateMagnets, { passive: true });
  window.addEventListener("resize", invalidateMagnets);
}

function stopMagnetListeners() {
  if (!magnetListening || magnets.size > 0) return;
  magnetListening = false;
  window.removeEventListener("pointermove", onMagnetPointerMove);
  window.removeEventListener("scroll", invalidateMagnets);
  window.removeEventListener("resize", invalidateMagnets);
  if (magnetFrame) cancelAnimationFrame(magnetFrame);
  magnetFrame = 0;
}

/**
 * Pulls toward the cursor when it comes close, and lifts on keyboard focus so
 * the effect is not mouse-only. Both are plain transforms on wrappers — the
 * content inside keeps its own hover styles, and nothing here reads layout
 * during scroll.
 */
export function MagneticSurface({
  children,
  className,
  strength = 0.16,
  radius = 80,
  lift = 6,
  pull = true,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  lift?: number;
  /** Off for large blocks, where cursor-following reads as drift rather than pull. */
  pull?: boolean;
}) {
  const pullRef = useRef<HTMLDivElement>(null);
  const liftRef = useRef<HTMLDivElement>(null);
  const reduce = useMediaQuery(REDUCE);

  useEffect(() => {
    const el = pullRef.current;
    if (!el || reduce || !pull) return;

    const magnet: Magnet = {
      el,
      radius,
      strength,
      setX: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" }),
      setY: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" }),
      rect: null,
      near: false,
    };
    magnets.add(magnet);
    startMagnetListeners();

    return () => {
      magnets.delete(magnet);
      gsap.set(el, { x: 0, y: 0 });
      delete el.dataset.magnetic;
      stopMagnetListeners();
    };
  }, [radius, strength, reduce, pull]);

  useEffect(() => {
    const el = liftRef.current;
    if (!el || reduce) return;
    const raise = () => gsap.to(el, { y: -lift, duration: 0.35, ease: "power3.out" });
    const settle = () => gsap.to(el, { y: 0, duration: 0.35, ease: "power3.out" });
    el.addEventListener("focusin", raise);
    el.addEventListener("focusout", settle);
    el.addEventListener("pointerenter", raise);
    el.addEventListener("pointerleave", settle);
    return () => {
      el.removeEventListener("focusin", raise);
      el.removeEventListener("focusout", settle);
      el.removeEventListener("pointerenter", raise);
      el.removeEventListener("pointerleave", settle);
    };
  }, [lift, reduce]);

  return (
    <div ref={pullRef} data-magnetic="idle" className={cn("will-change-transform", className)}>
      <div ref={liftRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
 * PARALLAX LAYER
 * ============================================================ */

/**
 * One depth plane of a scene. Give sibling layers different `speed` values and
 * they separate as the section leaves — the hero runs three: copy, object, and
 * the proof stats.
 */
export function ParallaxLayer({
  children,
  className,
  speed = 0.15,
  rotate = 0,
  scaleTo,
  fadeTo,
  scope,
}: {
  children: ReactNode;
  className?: string;
  /** Fraction of its own height the layer travels across the pass. */
  speed?: number;
  rotate?: number;
  scaleTo?: number;
  fadeTo?: number;
  /** Selector for the scrolling scope. Defaults to the nearest section. */
  scope?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { motion } = useFxMode();

  useEffect(() => {
    if (!motion) return;
    const el = ref.current;
    if (!el) return;
    const trigger = el.closest(scope ?? "section") ?? el;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -speed * 100,
        rotate,
        ...(scaleTo != null ? { scale: scaleTo } : {}),
        ...(fadeTo != null ? { opacity: fadeTo } : {}),
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [motion, speed, rotate, scaleTo, fadeTo, scope]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

/* ============================================================
 * ENTRANCE REVEALS
 * ============================================================ */

/**
 * True once the element has first entered the viewport, and true from then on.
 *
 * An IntersectionObserver rather than a ScrollTrigger on purpose: a trigger
 * caches the scroll positions it was measured at, and pinned sections above it
 * shift those positions after the fact. An observer holds no scroll maths at
 * all, so a one-shot entrance reveal cannot be thrown off by a pin.
 */
function useRevealed(ref: RefObject<HTMLElement | null>, rootMargin = "0px 0px -8% 0px") {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setRevealed(true);
      },
      { threshold: 0.05, rootMargin },
    );
    io.observe(el);

    /*
     * The observer alone is not enough. Jumping straight to a `#work-<slug>`
     * deep link moves earlier rows from below the viewport to above it without
     * ever crossing a threshold, so no callback fires and they stay covered
     * for good. This catches anything already at or past the fold; it costs one
     * passive listener that removes itself the moment the element resolves.
     */
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight) setRevealed(true);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [ref, rootMargin, revealed]);

  return revealed;
}

/* ============================================================
 * CARD STACK — each panel slides over the last
 * ============================================================ */

/**
 * A deck of full-height panels. Each one holds the screen while the next
 * climbs over the top of it, so the reader moves through the set without the
 * page appearing to scroll at all.
 *
 * The holding is plain `position: sticky`, not a pin. Every panel sticks to
 * the same offset inside a tall parent, so the one below simply scrolls up and
 * covers it — no measured scroll distances, nothing to go stale against pin
 * spacing elsewhere on the page, and it survives a resize on its own.
 *
 * The only scripted part is depth: a panel dims and shrinks by however much of
 * it the next one has covered, read from live geometry each frame. Without
 * motion that is skipped and the panels stop sticking, leaving an ordinary
 * column of cards.
 */
export function CardStack({
  items,
  className,
  cardClassName,
}: {
  items: { key: string; content: ReactNode }[];
  className?: string;
  cardClassName?: string;
}) {
  const { pinned } = useFxMode();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinned) return;
    const root = rootRef.current;
    if (!root) return;

    const slots = Array.from(root.querySelectorAll<HTMLElement>("[data-card-slot]"));
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));
    if (cards.length < 2) return;

    /*
     * `quickSetter(el, "css")`, not `quickTo`: quickTo builds a single-property
     * tween and cannot take the `scale` shorthand — it writes `scale: none` and
     * the value never reaches the transform. No easing needed here either, as
     * the scroll position itself is what makes the change continuous.
     */
    const setters = cards.map((card) => gsap.quickSetter(card, "css") as (v: object) => void);

    const measure = () => {
      for (let i = 0; i < cards.length - 1; i += 1) {
        const box = slots[i].getBoundingClientRect();
        const nextTop = slots[i + 1].getBoundingClientRect().top;
        // How much of this panel the next one has climbed over, 0..1.
        const covered = gsap.utils.clamp(0, 1, (box.bottom - nextTop) / box.height);
        setters[i]({ scale: 1 - covered * 0.06, opacity: 1 - covered * 0.5 });
      }
    };

    let dirty = true;
    const markDirty = () => {
      dirty = true;
    };
    const tick = () => {
      if (!dirty) return;
      dirty = false;
      measure();
    };

    gsap.ticker.add(tick);
    window.addEventListener("scroll", markDirty, { passive: true });
    window.addEventListener("resize", markDirty);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("scroll", markDirty);
      window.removeEventListener("resize", markDirty);
      cards.forEach((card) => gsap.set(card, { scale: 1, opacity: 1 }));
    };
  }, [pinned]);

  return (
    <div ref={rootRef} className={cn("relative", className)} data-fx={pinned ? "stacked" : "flow"}>
      {items.map((item, i) => (
        <div
          key={item.key}
          data-card-slot
          className={cn(
            // Stacking is desktop-only: a card that fills a phone screen cannot
            // hold a project's full write-up, and `overflow-hidden` would clip it.
            pinned && "sticky top-[var(--bar-h)] h-[calc(100svh-var(--bar-h))]",
          )}
          // Later panels have to paint over earlier ones, not under them.
          style={{ zIndex: i + 1 }}
        >
          <div
            data-card
            className={cn(
              "relative flex h-full flex-col justify-center overflow-hidden bg-paper will-change-transform",
              cardClassName,
            )}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
}

/** A hairline that draws itself across as its row arrives. */
export function LineDraw({
  className,
  duration = 1,
  delay = 0,
}: {
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const revealed = useRevealed(ref, "0px");
  const reduce = useMediaQuery(REDUCE);

  /*
   * Two elements, not one. Scaling the observed element to zero gives it zero
   * area, so its intersection ratio can never clear the observer's threshold
   * and it would sit un-drawn forever. The outer span keeps its full width and
   * is what gets watched; only the inner one scales.
   */
  return (
    <span
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 top-0 block h-px", className)}
    >
      <span
        className="block h-px w-full origin-left"
        style={{
          background: "var(--hairline)",
          // Under reduced motion the rule is simply there, with no dependency
          // on an observer — a row that lost its divider would read as broken.
          transform: reduce || revealed ? "scaleX(1)" : "scaleX(0)",
          transition: reduce ? "none" : `transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }}
      />
    </span>
  );
}
