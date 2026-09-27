/*
 * Width alone is not enough to qualify for a pinned section. A pinned box is
 * `100svh` tall and clipped, and because it is pinned there is no scroll that
 * can reveal what overflows it — so a viewport too short to hold the content
 * loses that content outright. A landscape phone is ≥768px wide and ~400px
 * tall, which is exactly that case. The height floor sends it down the
 * already-built unpinned paths instead: horizontal rails become swipe rows,
 * the pinned statement becomes a normal flow block, the card stack becomes a
 * column. 1280x720 laptops clear it comfortably.
 *
 * Shared by the effects (`useFxMode`) and the intro's head script, which
 * estimates the load from the layout this screen is about to get.
 */
export const DESKTOP = "(min-width: 768px) and (min-height: 640px)";
