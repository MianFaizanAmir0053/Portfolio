import { Fragment } from "react";
import WorldMap, { type Arc } from "@/components/ui/world-map";
import { buildReachMap, REACH_MAP_SRC } from "@/lib/reach-map";
import { CurtainText, FadeIn, Tag } from "./primitives";

/*
 * Server Component: `dotted-map` is only used here to read the map's own
 * dimensions and region, which the client needs to place the arcs. The rendered
 * dot SVG itself is served from /reach-map.svg, so neither the library nor the
 * ~1.1MB image crosses into the client bundle.
 */
const image = buildReachMap().image;

/*
 * Only routes the site already claims elsewhere:
 *  - Lahore — "Faizan Amir / Lahore, Pakistan" (footer), Wanile Technologies
 *  - California — Nazadv, "US (California)" (experience)
 *  - Middle East + Europe — Carder, "150+ users across the Middle East and
 *    Europe" (project data)
 * Regional endpoints use a representative city coordinate but are labelled by
 * region, since the region is what is actually claimed.
 */
const LAHORE = { lat: 31.5204, lng: 74.3587, label: "Lahore, PK" };

const ARCS: Arc[] = [
  { start: LAHORE, end: { lat: 34.0522, lng: -118.2437, label: "California, US" } },
  { start: LAHORE, end: { lat: 25.2048, lng: 55.2708, label: "Middle East" } },
  { start: LAHORE, end: { lat: 51.5074, lng: -0.1278, label: "United Kingdom" } },
  { start: LAHORE, end: { lat: 50.1109, lng: 8.6821, label: "Europe" } },
];

const NODES = [
  { label: "Lahore, PK", note: "* BASE" },
  { label: "California, US", note: "* NAZADV" },
  { label: "United Kingdom", note: "* WARD WEB SOLUTIONS" },
  { label: "Middle East", note: "* CARDER USERS" },
  { label: "Europe", note: "* CARDER USERS" },
];

export function Reach() {
  return (
    <section id="reach" className="rule-t bg-paper-deep">
      <div className="wrap py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[1fr_0.9fr] md:items-end">
          <div>
            <Tag className="mb-6 block">[05] REACH</Tag>
            <CurtainText
              className="display text-[11vw] md:text-[clamp(2.5rem,4.6vw,4rem)]"
              lines={[
                <Fragment key="1">Built in Lahore,</Fragment>,
                <Fragment key="2">
                  shipped across <span className="accent-word">four markets</span>
                </Fragment>,
              ]}
            />
          </div>
          <FadeIn delay={0.15}>
            <p className="max-w-xl text-base leading-7 text-ink-muted">
              Four years of client work spanning the US, UK, Middle East, and Europe — built
              from Lahore, used by hundreds of people across those markets.
            </p>
          </FadeIn>
        </div>

        <div className="mt-12 md:mt-16">
          <WorldMap src={REACH_MAP_SRC} image={image} dots={ARCS} />
        </div>

        <dl className="mt-10 grid grid-cols-2 rule-t sm:grid-cols-3 lg:grid-cols-5">
          {NODES.map((n, i) => (
            <div key={n.label} className={i > 0 ? "py-6 sm:border-l sm:border-ink sm:pl-6" : "py-6"}>
              <dt className="display text-lg md:text-xl">{n.label}</dt>
              <dd className="label mt-2">{n.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
