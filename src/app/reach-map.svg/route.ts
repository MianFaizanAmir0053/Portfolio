import { buildReachMap, REACH_MAP_SVG_OPTIONS } from "@/lib/reach-map";

/**
 * The dot map is ~1.1MB of SVG. Inlining it as a data URI put it in the page
 * HTML *and* again in the RSC payload (it crossed a client boundary as a prop),
 * costing ~2.2MB per document. Serving it as its own immutable asset keeps the
 * document small and lets the browser cache it across navigations.
 */
export const dynamic = "force-static";

export function GET() {
  const svg = buildReachMap().getSVG(REACH_MAP_SVG_OPTIONS);
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
