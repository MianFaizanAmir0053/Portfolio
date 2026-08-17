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

export const REACH_MAP_SVG_OPTIONS = {
  radius: 0.22,
  shape: "circle",
  color: "#FFFFFF40",
  backgroundColor: "transparent",
} as const;

/** Served as a standalone cached asset — see src/app/reach-map.svg/route.ts */
export const REACH_MAP_SRC = "/reach-map.svg";
