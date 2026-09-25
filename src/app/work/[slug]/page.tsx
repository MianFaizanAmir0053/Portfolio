import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject, projectNeighbours } from "@/data/projects";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { CurtainText, CutFrame, FadeIn, Scramble, Tag } from "@/components/site/primitives";
import { CardStack, LineDraw } from "@/components/site/scroll-fx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/site/JsonLd";
import { PERSON, CONTENT_REVIEWED } from "@/lib/site";
import { breadcrumbSchema, caseStudySchema, graph, webPageSchema } from "@/lib/schema";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/**
 * Six slugs, all known at build time. Anything else is a 404 rather than an
 * on-demand render — a portfolio has no unknown case studies, and letting
 * arbitrary paths render is how soft-404s get indexed.
 */
export const dynamicParams = false;

/**
 * A meta description sized for the SERP.
 *
 * `project.summary` alone runs 80–130 characters, which leaves a third of the
 * snippet Google will render unused on every case study. This tops it up with
 * the role and the headline numbers — the two things a reader scanning results
 * actually wants — and trims at a word boundary rather than mid-word.
 */
function metaDescription(summary: string, role: string, metrics: string[]) {
  const full = `${summary} ${role}. ${metrics.join(" · ")}.`;
  if (full.length <= 158) return full;
  return `${full.slice(0, 155).replace(/[\s,·]+\S*$/, "")}…`;
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return { title: "Case study not found", robots: { index: false, follow: true } };
  }
  /*
   * The root layout appends "· Faizan Amir" through the title template, so the
   * name is deliberately absent here — carrying it twice cost ~15 characters of
   * a 60-character SERP line for nothing.
   */
  const title = `${project.name} — ${project.tagline}`;
  const path = `/work/${project.slug}`;
  const description = metaDescription(project.summary, project.role, project.indexMetrics);
  return {
    title,
    description,
    alternates: { canonical: path },
    keywords: [...project.stack, project.tagline, `${project.name} case study`],
    openGraph: {
      title: `${title} · Faizan Amir`,
      description,
      type: "article",
      url: path,
      authors: [PERSON.name],
    },
    /*
     * Declared, not inherited. Without these the case studies served the
     * homepage's Twitter title and description on every share — the card said
     * "Senior Software Engineer" whatever project you had linked.
     */
    twitter: {
      card: "summary_large_image",
      title: `${title} · Faizan Amir`,
      description,
    },
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next, position } = projectNeighbours(project.slug);
  const path = `/work/${project.slug}`;
  const coverIsDiagram = project.diagram?.src === project.image;

  /*
   * The running order, declared once.
   *
   * Three of the sections below are optional — a case study with no stated
   * constraints, no trade-off table or no incident to report simply omits them
   * — so the numerals cannot be written into the markup or they leave gaps in
   * the sequence on every project that skips one. Deriving them from this list
   * keeps the label an actual counter, and keeps the page's order legible in
   * one place rather than spread across three hundred lines of JSX.
   */
  const sections = [
    "problem",
    project.constraints && "constraints",
    "approach",
    project.tradeoffs && "tradeoffs",
    "build",
    project.broke && "broke",
    "result",
    "reflection",
  ].filter(Boolean) as string[];
  const n = (key: string) => String(sections.indexOf(key) + 1).padStart(2, "0");
  const crumbs = breadcrumbSchema(path, [
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    { name: project.name, path },
  ]);

  return (
    <div className="min-h-screen bg-paper">
      <JsonLd
        data={graph(
          webPageSchema({
            path,
            name: `${project.name} — ${project.tagline}`,
            description: project.summary,
            breadcrumb: crumbs,
          }),
          crumbs,
          caseStudySchema(project),
        )}
      />
      <UtilityBar />

      {/* 1. back bar */}
      <nav
        className="sticky top-11 z-40 bg-paper/95 rule-b"
        aria-label="Breadcrumb"
      >
        {/*
         * Height is a minimum rather than a fixed `h-11`: the crumb trail and
         * the pager together need more than a 320px viewport can give on one
         * line, and the flex items shrink to min-content and wrap. Locked at
         * `h-11` the wrapped rows overshot the `rule-b` onto the title block
         * below, so the bar grows a row instead of spilling out of itself.
         */}
        <div className="wrap flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
          {/*
           * A real breadcrumb, not a bare back arrow. It gives the crawler the
           * same trail the BreadcrumbList declares, and it gives a reader
           * arriving from search — who has never seen the index — somewhere to
           * go that is not the browser's back button.
           */}
          <ol className="label flex items-center gap-2 text-ink">
            <li>
              <Link href="/" className="hover:text-cobalt">
                HOME
              </Link>
            </li>
            <li aria-hidden className="text-ink-muted">
              /
            </li>
            <li>
              <Link href="/work" className="hover:text-cobalt">
                WORK
              </Link>
            </li>
            <li aria-hidden className="text-ink-muted">
              /
            </li>
            <li className="text-cobalt" aria-current="page">
              {project.name.toUpperCase()}
            </li>
          </ol>
          <div className="flex items-center gap-5">
            {/* The position counter is the one item here a phone can lose:
                PREV and NEXT carry the same "where am I in the set" answer. */}
            <span className="label hidden sm:inline">
              [{String(position).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}]
            </span>
            {prev && (
              <Link href={`/work/${prev.slug}`} className="label text-cobalt hover:underline">
                ← PREV
              </Link>
            )}
            {next && (
              <Link href={`/work/${next.slug}`} className="label text-cobalt hover:underline">
                NEXT →
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main id="main">
        {/* 2. title block */}
        <section className="wrap py-16 md:py-24">
          <Tag className="mb-6 block">[CASE STUDY {project.index}]</Tag>
          <CurtainText
            as="h1"
            immediate
            className="display text-[14vw] md:text-[clamp(3.5rem,8vw,8rem)]"
            lines={[
              <Fragment key="1">{project.name}</Fragment>,
              /*
               * The tagline gets its own step and its own leading. `.display`
               * sets 0.9, which is right for Bebas — caps, no descenders — but
               * the accent face is Instrument Serif italic, which has both.
               * Taglines are full phrases and wrap at every desktop width, so
               * at 0.9 the descenders of the first line sat inside the capitals
               * of the second. Sized in `em` so it still tracks the clamp.
               */
              <span key="2" className="block text-[0.5em] leading-[1.15]">
                <span className="accent-word">{project.tagline}</span>
              </span>,
            ]}
          />
          <FadeIn delay={0.2}>
            <p className="mt-8 max-w-2xl text-base leading-7 text-ink-muted">{project.summary}</p>
            {project.liveUrl && (
              /*
               * Some of these products are behind a login. Sending a reader to
               * an auth wall under a link that promised a live site is worse
               * than not linking at all, so a gated app says so before it is
               * clicked.
               */
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener"
                className="label mt-6 inline-block text-cobalt hover:underline"
              >
                {project.liveGated ? "VIEW THE APP" : "VISIT LIVE SITE"} ↗ {project.liveLabel}
                {project.liveGated && <span className="text-ink-muted"> · LOGIN REQUIRED</span>}
              </a>
            )}
          </FadeIn>
        </section>

        {/* 3. meta strip */}
        <section className="wrap">
          <dl className="grid grid-cols-2 rule-t rule-b md:grid-cols-4">
            {[
              ["ROLE", project.role],
              ["TIMELINE", project.timeline],
              ["STACK", project.stack.slice(0, 3).join(" · ")],
              ["STATUS", project.status],
            ].map(([k, v], i) => (
              <div key={k} className={`py-6 ${i > 0 ? "md:border-l md:border-ink md:pl-6" : ""}`}>
                <dt className="label mb-2">{k}</dt>
                <dd className="text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 4. hero image — for a project with no screenshot yet the cover is
            its architecture diagram, captioned here and not repeated below */}
        <section className="wrap py-12 md:py-16">
          <figure>
            <CutFrame src={project.image} alt={project.alt} cut="cut-bl" ratio="aspect-[16/9]" eager sizes="(min-width: 1024px) 1100px, 100vw" />
            {coverIsDiagram && <figcaption className="label mt-3">{project.diagram?.caption}</figcaption>}
          </figure>
        </section>

        {/* 4b. context — who was on it, at what scale, owning what */}
        {project.context && (
          <section className="wrap pb-4" aria-label="Engagement context">
            {/*
             * Two independent columns rather than one row-flow grid: with an
             * odd count the row grid leaves an empty cell bottom-right. The
             * right column centres vertically against the taller left one.
             */}
            <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {[0, 1].map((col) => (
                <dl
                  key={col}
                  className="flex flex-col gap-y-5 sm:justify-center"
                >
                  {project.context!
                    .filter((_, i) => i % 2 === col)
                    .map((c) => (
                      <div key={c.k}>
                        <dt className="label mb-1 text-cobalt">{c.k}</dt>
                        <dd className="text-sm leading-6 text-ink-muted">{c.v}</dd>
                      </div>
                    ))}
                </dl>
              ))}
            </div>
          </section>
        )}

        {/* 5. problem */}
        <Block label={`[${n("problem")}] THE PROBLEM`} headline={project.problemHeadline}>
          <p className="text-base leading-7 text-ink-muted">{project.problem}</p>
        </Block>

        {/* 5b. constraints — what could not be done */}
        {project.constraints && (
          <Block
            label={`[${n("constraints")}] THE CONSTRAINTS`}
            headline={project.headlines?.constraints ?? "What the job ruled out"}
          >
            <Accordion type="multiple" className="rule-t">
              {project.constraints.map((constraint, index) => (
                <AccordionItem key={constraint.title} value={`constraint-${index}`}>
                  <AccordionTrigger className="rounded-none py-5 hover:no-underline">
                    <span className="display pr-4 text-left text-lg md:text-xl">
                      {constraint.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="text-sm leading-7 text-ink-muted">{constraint.body}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Block>
        )}

        {/* 6. approach */}
        <Block label={`[${n("approach")}] THE APPROACH`} headline="How it was built">
          <p className="text-base leading-7 text-ink-muted">{project.approach}</p>
          <ol className="mt-8 space-y-4">
            {project.decisions.map((d, i) => (
              <li key={d} className="flex gap-4 text-sm leading-7">
                <span className="label shrink-0 pt-1 text-cobalt">
                  *[{String(i + 1).padStart(2, "0")}]
                </span>
                <span className="text-ink-muted">{d}</span>
              </li>
            ))}
          </ol>
          {project.diagram && !coverIsDiagram && (
            <figure className="mt-12">
              <CutFrame src={project.diagram.src} alt={project.diagram.alt} cut="cut-tr" />
              <figcaption className="label mt-3">{project.diagram.caption}</figcaption>
            </figure>
          )}
        </Block>

        {/*
         * 6b. trade-offs — the section that turns a task list into a record of
         * decisions. Each row names what was rejected and what the choice cost,
         * because a decision with no alternative and no price was not a decision.
         */}
        {project.tradeoffs && (
          <Block
            label={`[${n("tradeoffs")}] THE TRADE-OFFS`}
            headline={project.headlines?.tradeoffs ?? "What each choice cost"}
          >
            <Accordion type="multiple" className="rule-t">
              {project.tradeoffs.map((tradeoff, index) => (
                <AccordionItem key={tradeoff.decision} value={`tradeoff-${index}`}>
                  <AccordionTrigger className="rounded-none py-5 hover:no-underline">
                    <span className="display pr-4 text-left text-lg md:text-xl">
                      {tradeoff.decision}
                    </span>
                  </AccordionTrigger>
                  {/* The rejected option sits in the panel, not the heading:
                      inside the trigger it doubled every collapsed row. */}
                  <AccordionContent className="pb-6">
                    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <dt className="label mb-1 text-cobalt">[INSTEAD OF]</dt>
                        <dd className="text-sm leading-7 text-ink-muted">{tradeoff.instead}</dd>
                      </div>
                      <div>
                        <dt className="label mb-1">[COST]</dt>
                        <dd className="text-sm leading-7 text-ink-muted">{tradeoff.cost}</dd>
                      </div>
                      <div>
                        <dt className="label mb-1 text-cobalt">[BENEFIT]</dt>
                        <dd className="text-sm leading-7 text-ink-muted">{tradeoff.bought}</dd>
                      </div>
                    </dl>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Block>
        )}

        {/* 7. build */}
        <section className="py-16 md:py-24" aria-labelledby="build-heading">
          <div className="wrap">
            <Tag className="mb-4 block">[{n("build")}] THE BUILD</Tag>
            {/* The h3s below used to hang off the previous section's h2, which
                left a hole in the outline exactly where the substance is. */}
            <h2 id="build-heading" className="display mb-10 text-2xl md:text-4xl">
              {project.headlines?.build ?? `What ${project.name} is made of`}
            </h2>
          </div>
          {/*
           * The same deck as the homepage's featured work: each block holds the
           * screen while the next climbs over it. Desktop with motion only —
           * elsewhere CardStack leaves a plain column of rows.
           */}
          <CardStack
            bars={2}
            fit
            items={project.build.map((b, i) => ({
              key: b.title,
              content: (
                <div>
                  <LineDraw delay={0.05} />
                  {/*
                   * A block with nothing to show reads across the full measure
                   * rather than leaving half the row empty.
                   */}
                  {b.image ? (
                    <div className="wrap grid items-center gap-8 py-12 md:grid-cols-2 md:gap-14">
                      <div className={i % 2 === 1 ? "md:order-2" : ""}>
                        <CutFrame
                          src={b.image}
                          alt={b.alt ?? ""}
                          cut={i % 2 === 0 ? "cut-tr" : "cut-bl"}
                          parallax={false}
                        />
                      </div>
                      <FadeIn className={i % 2 === 1 ? "md:order-1" : ""}>
                        <h3 className="display text-2xl md:text-3xl">{b.title}</h3>
                        <p className="mt-4 text-sm leading-7 text-ink-muted">{b.body}</p>
                      </FadeIn>
                    </div>
                  ) : (
                    <FadeIn className="wrap py-12">
                      <h3 className="display text-2xl md:text-3xl">{b.title}</h3>
                      <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-muted">{b.body}</p>
                    </FadeIn>
                  )}
                </div>
              ),
            }))}
          />
        </section>

        {/*
         * 7b. what broke. mailagent already carries a section like this and it
         * is the most credible thing on the site; a case study that only lists
         * wins asks to be taken on trust.
         */}
        {project.broke && (
          <Block label={`[${n("broke")}] WHAT BROKE`} headline="And what fixed it">
            <Accordion type="multiple" className="rule-t">
              {project.broke.map((item, i) => (
                <AccordionItem key={item.title} value={`failure-${i}`}>
                  <AccordionTrigger className="rounded-none py-5 hover:no-underline">
                    <span className="flex gap-4 pr-4 text-left">
                      <span aria-hidden className="label shrink-0 pt-1 text-cobalt">
                        !{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="display text-lg md:text-xl">{item.title}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pl-10">
                    <p className="text-sm leading-7 text-ink-muted">{item.body}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Block>
        )}

        {/* 8. results */}
        <section className="rule-t bg-paper-deep" aria-labelledby="result-heading">
          <div className="wrap py-20 md:py-28">
            <Tag className="mb-4 block">[{n("result")}] THE RESULT</Tag>
            <h2 id="result-heading" className="display mb-10 text-2xl md:text-4xl">
              {project.headlines?.result ?? `What ${project.name} measured`}
            </h2>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {project.metrics.map((m) => (
                <div key={m.caption}>
                  {/* Capped, because the column it sits in is not fluid: `.wrap`
                      stops at 96rem, so past ~1900px an 8vw numeral kept
                      growing inside a column that had stopped. "92.9%" then
                      ran into the metric beside it. */}
                  <p className="display text-[14vw] leading-[0.85] text-cobalt md:text-[clamp(3rem,8vw,7rem)]">
                    <Scramble value={m.value} />
                  </p>
                  <p className="label mt-4">{m.caption}</p>
                  {m.note && <p className="label mt-1 text-ink-muted">{m.note}</p>}
                </div>
              ))}
            </div>
            {/*
             * Provenance. The tiles are large and confident and every one of
             * them is a claim; this is the sentence that says which are
             * platform records, which are self-reported, and which are counts
             * of what exists rather than measurements of what happened. It
             * costs a line and it is the difference between a number a reader
             * believes and one they discount.
             */}
            {project.metricsNote && (
              <p className="mt-14 max-w-3xl rule-t pt-6 text-sm leading-7 text-ink-muted">
                <span className="label mr-2 text-cobalt">[HOW THESE WERE MEASURED]</span>
                {project.metricsNote}
              </p>
            )}
          </div>
        </section>

        {/* 9. reflection */}
        <Block label={`[${n("reflection")}] WHAT I'D DO DIFFERENTLY`} headline="Honestly">
          <p className="text-base leading-7 text-ink-muted">{project.reflection}</p>
        </Block>

        {/*
         * Byline. A case study with no author and no date is a page an answer
         * engine has no reason to trust and no way to date — and both are
         * weighted heavily. The name links to the entity the Person schema on
         * this page already declares.
         */}
        <section className="wrap rule-t py-8" aria-label="Case study attribution">
          <p className="label text-ink-muted">
            WRITTEN BY{" "}
            <Link href="/about" className="text-cobalt hover:underline">
              {PERSON.name}
            </Link>
            , {project.role} ON {project.name.toUpperCase()} · LAST REVIEWED{" "}
            <time dateTime={CONTENT_REVIEWED}>{CONTENT_REVIEWED}</time>
          </p>
        </section>

        {/* 9b. the ask — the reader who got this far is the one most likely
            to act, so both doors are here before the next case study. */}
        <section className="rule-t bg-paper-deep">
          <div className="wrap flex flex-wrap items-center justify-between gap-6 py-14">
            <p className="display text-2xl md:text-4xl">
              Need something like this <span className="accent-word">built</span>?
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="bg-cobalt px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-cobalt-deep"
              >
                Start a project →
              </Link>
              <a
                href="/resume.pdf"
                className="border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Download resume (PDF) ↓
              </a>
            </div>
          </div>
        </section>

        {/* 10. next project */}
        {next && (
          <Link href={`/work/${next.slug}`} className="on-ink group block bg-ink py-20 md:py-28">
            <div className="wrap">
              <p className="label mb-6">NEXT CASE STUDY</p>
              <p className="display text-[16vw] leading-[0.85] text-paper transition-colors duration-300 group-hover:text-link md:text-[11vw]">
                {next.name}
              </p>
              <p className="label mt-6">{next.tagline} →</p>
            </div>
          </Link>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Block({
  label,
  headline,
  children,
}: {
  label: string;
  headline: string;
  children: ReactNode;
}) {
  return (
    <section className="wrap grid gap-8 rule-t py-16 md:grid-cols-[0.8fr_1.2fr] md:py-24">
      {/*
       * The headline pins below the utility and breadcrumb bars (2 × h-11)
       * while the longer right column scrolls past it. `self-start` stops
       * the grid stretching this cell, which would leave it nowhere to stick.
       */}
      <div className="md:sticky md:top-28 md:self-start">
        <Tag className="mb-4 block">{label}</Tag>
        <CurtainText
          className="display text-2xl md:text-4xl"
          lines={[<Fragment key="1">{headline}</Fragment>]}
        />
      </div>
      <FadeIn>{children}</FadeIn>
    </section>
  );
}
