/** How long the exit takes — the bar completing, then the panel lifting. */
export const EXIT_MS = 1300;

/** When the head script lets the intro go early, if the app never started: after this long from the script running. */
export const SOFT_CAP_MS = { full: 5500, brief: 3000 } as const;

/** The longest the intro is ever up, from the script running, whatever state the app is in. */
export const HARD_CAP_MS = 15000;

/**
 * Shortest time the intro stays up, from the panel's first paint. The full
 * one is long enough for the name to rise and the first fact to be read: on a
 * good connection the page is ready well before this, so it is what a
 * first-time reader actually waits, and the facts after the first are for the
 * loads slow enough to need them. The brief one is only long enough not to
 * flash.
 */
export const MIN_MS = { full: 2500, brief: 400 } as const;

/** How long each fact is on screen (see `FACTS`), and when the first arrives after the panel paints. */
export const FACT_MS = 3000;
export const FACT_LEAD_MS = 400;

/*
 * The page's half of the first-load intro: telling the head script (see
 * `INTRO_SCRIPT`) how far the page has got, so its bar can track the real
 * load and it can lift the panel once the page is ready. See `Intro`.
 */

/** Whether the intro is on screen, holding the page. */
export function introUp() {
  const d = document.documentElement;
  return d.hasAttribute("data-intro") && !d.hasAttribute("data-ready");
}

/** Reports a stage to the head script. True when it is listening and has taken it. */
function stage(name: "hydrated" | "ready") {
  return !window.dispatchEvent(new CustomEvent("intro:stage", { detail: name, cancelable: true }));
}

/** The page has hydrated — most of the work behind the intro is done. */
export function introHydrated() {
  stage("hydrated");
}

/**
 * The page is ready: booted, fonts in, every pinned section measured. Lets the
 * intro leave, no sooner than its minimum. Safe to call more than once, and a
 * no-op on loads that never had an intro.
 */
export function introReady() {
  const d = document.documentElement;
  const kind = d.getAttribute("data-intro");
  if ((kind !== "full" && kind !== "brief") || d.hasAttribute("data-ready")) return;
  // The head script times the exit. Only if it is not running does the page do it itself — the
  // minimum counted from navigation start, as the page cannot know when the panel first painted.
  if (stage("ready")) return;
  window.setTimeout(
    () => {
      if (d.hasAttribute("data-ready")) return;
      d.setAttribute("data-ready", "");
      window.setTimeout(() => d.setAttribute("data-intro-done", ""), EXIT_MS);
    },
    Math.max(0, MIN_MS[kind] - performance.now()),
  );
}
