/**
 * The page is ready once it has booted, its fonts are in and every section has
 * been measured — `ScrollFxRoot` decides when, and calls `markReady`. It is
 * also the moment the first-load intro leaves (see `@/lib/intro`).
 *
 * Setup that nothing on the first screen depends on waits for it: the scroll
 * hairline, the dock's section highlighting, the hero's parallax, headlines
 * below the fold. Each builds a ScrollTrigger, and each ScrollTrigger measures
 * the page as it is created — work that sat between the page arriving and the
 * page being ready, on the one path the reader is waiting on. Afterwards it
 * runs one job per idle moment, so it never lands as a single long task.
 *
 * Something mounted after that — a client-side navigation — runs at once.
 */
let ready = false;
const queue = new Set<() => void>();

const idle = (fn: () => void) => {
  // Safari has no requestIdleCallback.
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(fn, { timeout: 300 });
  else setTimeout(fn, 16);
};

const drain = () => {
  const job = queue.values().next().value;
  if (!job) return;
  queue.delete(job);
  job();
  if (queue.size) idle(drain);
};

/** The page is ready. Safe to call more than once. */
export function markReady() {
  if (ready) return;
  ready = true;
  // A User Timing mark, so the moment shows up in DevTools and field data.
  performance.mark("site:ready");
  if (queue.size) idle(drain);
}

/**
 * Runs `job` once the page is ready — straight away if it already is. Returns
 * a cancel for an unmount that comes first.
 */
export function whenReady(job: () => void) {
  if (ready) {
    job();
    return () => {};
  }
  queue.add(job);
  return () => {
    queue.delete(job);
  };
}
