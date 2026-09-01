import { ImageResponse } from "next/og";
import { PERSON } from "@/lib/site";

/**
 * The social card for the homepage — and, because `metadata.openGraph.images`
 * is left unset elsewhere, the fallback for anything that does not declare its
 * own. Before this existed, every share of the site rendered as a bare link.
 *
 * Drawn rather than photographed: an ImageResponse is generated at build time
 * into a static file, so there is no runtime cost and no image to keep in sync
 * with the design.
 */
export const alt = `${PERSON.name} — ${PERSON.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#060607";
const INK = "#ffffff";
const MUTED = "#9f9fa7";
const COBALT = "#c8ff3d";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              color: COBALT,
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            [{PERSON.jobTitle}]
          </div>
          <div style={{ display: "flex", color: MUTED, fontSize: 22, letterSpacing: 4 }}>
            [STATUS: OPEN TO WORK]
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: MUTED, fontSize: 26, letterSpacing: 6 }}>
            {PERSON.name.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              color: INK,
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.05,
              marginTop: 18,
              maxWidth: 980,
            }}
          >
            I build full-stack and AI-driven systems people
            <span style={{ color: COBALT, marginLeft: 16 }}>actually</span>
            <span style={{ marginLeft: 16 }}>use.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${MUTED}`,
            paddingTop: 24,
            color: MUTED,
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex" }}>React · Next.js · Node.js · Python · RAG · Agentic AI</div>
          <div style={{ display: "flex", color: COBALT }}>4+ yrs · 8+ shipped</div>
        </div>
      </div>
    ),
    size,
  );
}
