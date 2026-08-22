/**
 * A mutable scroll signal read inside animation frames.
 *
 * `useFrame` (react-three-fiber) and GSAP tickers run outside React's render
 * cycle, so routing scroll progress through state would cost a re-render per
 * frame. This module-level object is written by ScrollTriggers and read
 * imperatively instead — one shared instance, zero renders.
 *
 * All values are normalised 0..1 unless noted.
 */
export const scrollSignal = {
  /** Progress across the hero's exit (0 at rest, 1 once the hero is gone). */
  hero: 0,
  /** Whole-document progress. */
  page: 0,
  /** Signed scroll velocity, roughly -1..1, smoothed. */
  velocity: 0,
};

export type ScrollSignal = typeof scrollSignal;
