import { buildReachMapSvg } from "@/lib/reach-map";

/**
 * The dot map is its own asset. Inlining it as a data URI put it in the page
 * HTML *and* again in the RSC payload (it crossed a client boundary as a prop),
 * so it is served once, cached immutably, and shared across navigations.
 * `buildReachMapSvg` has the note on why it is a single path.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(buildReachMapSvg(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
