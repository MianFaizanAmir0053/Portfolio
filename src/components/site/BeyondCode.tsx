import { Fragment } from "react";
import { CurtainText, Tag } from "./primitives";
import { LockedSteps, MagneticSurface } from "./scroll-fx";
import { InstagramIcon } from "./BrandIcons";
import { SOCIAL } from "@/data/social";

const ACTIVITIES = [
  {
    n: "01",
    title: "Gymrat",
    stat: "4–5x / week",
    body: "Strength training is non-negotiable at this point — the same discipline that gets me under a bar gets a feature shipped.",
  },
  {
    n: "02",
    title: "Table Tennis",
    stat: "National level",
    body: "Represented both my university and school at the nationals. Still the fastest reset button I own.",
  },
  {
    n: "03",
    title: "Solo Wandering",
    stat: "Mushkpuri · Miranjani · no fixed itinerary",
    body: "Summited both peaks solo — Miranjani being the highest in Galiyat — and travel the same way, figuring it out on the ground instead of a packaged plan. Started alone both times, found trail friends along the way.",
  },
];

export function BeyondCode() {
  return (
    <section id="beyond" className="wrap rule-t py-20 md:py-28">
      {/* The heading column locks to the viewport while the list is read; each
          entry resolves from dim to lit as it arrives, and the rail beneath the
          heading tracks how far through you are. */}
      <LockedSteps
        aside={
          <div>
            <Tag className="mb-6 block">[06] BEYOND CODE</Tag>
            <CurtainText
              className="display text-[11vw] md:text-[clamp(2.5rem,4.6vw,4rem)]"
              lines={[
                <Fragment key="1">
                  Off the <span className="accent-word">clock</span>
                </Fragment>,
              ]}
            />

            <MagneticSurface className="mt-10 w-fit" strength={0.12} radius={70}>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener"
                /* The ring goes inside the card. `cut-tr` clips this element's
                   whole rendering to its polygon, outline included, so the
                   default 3px outward offset painted nothing at all — the only
                   focusable surface on the site carrying a cut class directly. */
                className="group relative block cut-tr grain bg-paper-deep p-7 focus-visible:-outline-offset-4"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center bg-cobalt font-display text-sm text-paper"
                >
                  +
                </span>

                <InstagramIcon className="h-9 w-9 text-cobalt transition-transform duration-300 group-hover:scale-110" />

                <p className="display mt-6 text-3xl">Reels &amp; wrong turns</p>
                <p className="mt-4 max-w-xs text-sm leading-7 text-ink-muted">
                  Gym clips, hiking footage, and the occasional relatable bit that made it past my
                  own editing standards.
                </p>

                <span className="label relative mt-8 inline-block text-cobalt">
                  @fa.izy__ ↗
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-cobalt transition-all duration-300 group-hover:w-full" />
                </span>
              </a>
            </MagneticSurface>
          </div>
        }
        steps={ACTIVITIES.map((a) => ({
          key: a.n,
          rail: { label: a.title, sub: a.stat.toUpperCase() },
          content: (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="display text-2xl md:text-4xl">
                  <span className="text-cobalt">[{a.n}]</span> {a.title}
                </h3>
                <p className="label text-cobalt">{a.stat}</p>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-7 text-ink-muted">{a.body}</p>
            </>
          ),
        }))}
      />
    </section>
  );
}
