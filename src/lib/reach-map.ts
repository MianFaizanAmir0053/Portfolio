import DottedMap from "dotted-map";

/**
 * Shared dot-map config, used by the static `/reach-map.svg` route and by the
 * Reach section (which only needs the image dimensions to place its arcs).
 *
 * Projection is pinned to equirectangular because WorldMap maps lat/lng to x/y
 * linearly — any other projection would put the arcs off the dots.
 */
export function buildReachMap() {
  return new DottedMap({
    height: 100,
    grid: "diagonal",
    projection: { name: "equirectangular" },
  });
}

const DOT_RADIUS = 0.22;
const DOT_COLOR = "#FFFFFF40";

/**
 * The map as one `<path>` rather than one `<circle>` per dot.
 *
 * `dotted-map`'s own `getSVG` writes ~10,000 circle elements — 716KB of markup
 * the browser has to parse into a DOM and rasterise element by element, which
 * on a low-end phone is a visible stall when the section scrolls in. A dot is
 * just a zero-length stroke with a round cap, so the same picture fits in a
 * single path: each row is one absolute move, then a relative hop per dot.
 * About a tenth of the bytes, and one element to paint instead of ten thousand.
 */
export function buildReachMapSvg() {
  const map = buildReachMap();
  const r = (n: number) => +n.toFixed(2);

  const rows = new Map<number, number[]>();
  for (const { x, y } of map.getPoints()) {
    const row = rows.get(y);
    if (row) row.push(x);
    else rows.set(y, [x]);
  }

  let d = "";
  for (const [y, xs] of [...rows.entries()].sort((a, b) => a[0] - b[0])) {
    xs.sort((a, b) => a - b);
    d += `M${r(xs[0])} ${r(y)}h0`;
    for (let i = 1; i < xs.length; i += 1) d += `m${r(xs[i] - xs[i - 1])} 0h0`;
  }

  const { width, height } = map.image;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${d}" fill="none" stroke="${DOT_COLOR}" stroke-width="${DOT_RADIUS * 2}" stroke-linecap="round"/></svg>`;
}

/** Served as a standalone cached asset — see src/app/reach-map.svg/route.ts */
export const REACH_MAP_SRC = "/reach-map.svg";
