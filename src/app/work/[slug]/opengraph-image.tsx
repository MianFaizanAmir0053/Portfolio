import { ImageResponse } from "next/og";
import { projects, getProject } from "@/data/projects";
import { PERSON } from "@/lib/site";

/**
 * A social card per case study, generated at build time.
 *
 * Without this every one of the six shared as the site's generic card, so a
 * link to the telehealth platform and a link to the AI image SaaS looked
 * identical in a message. The card carries the project name, what it is, and
 * the numbers the page is arguing with.
 */
export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const PAPER = "#060607";
const INK = "#ffffff";
const MUTED = "#9f9fa7";
const COBALT = "#c8ff3d";

export default async function CaseStudyImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

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
          <div style={{ display: "flex", color: COBALT, fontSize: 22, letterSpacing: 4 }}>
            [CASE STUDY {project?.index ?? "00"}]
          </div>
          <div style={{ display: "flex", color: MUTED, fontSize: 22, letterSpacing: 4 }}>
            {(project?.status ?? "").toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: INK, fontSize: 92, fontWeight: 700, lineHeight: 1 }}>
            {project?.name ?? "Case study"}
          </div>
          <div style={{ display: "flex", color: COBALT, fontSize: 40, marginTop: 12 }}>
            {project?.tagline ?? ""}
          </div>
          <div
            style={{
              display: "flex",
              color: MUTED,
              fontSize: 26,
              marginTop: 22,
              maxWidth: 980,
              lineHeight: 1.35,
            }}
          >
            {project?.summary ?? ""}
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
          <div style={{ display: "flex" }}>{(project?.indexMetrics ?? []).join("  ·  ")}</div>
          <div style={{ display: "flex", color: INK }}>{PERSON.name}</div>
        </div>
      </div>
    ),
    size,
  );
}
