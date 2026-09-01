import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject, projectNeighbours } from "@/data/projects";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { CurtainText, CutFrame, FadeIn, Scramble, Tag } from "@/components/site/primitives";
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
        className="sticky top-11 z-40 bg-paper/95 backdrop-blur-[2px] rule-b"
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
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener"
                className="label mt-6 inline-block text-cobalt hover:underline"
              >
                VISIT LIVE SITE ↗ {project.liveLabel}
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

        {/* 4. hero image */}
        <section className="wrap py-12 md:py-16">
          <CutFrame src={project.image} alt={project.alt} cut="cut-bl" ratio="aspect-[16/9]" eager sizes="(min-width: 1024px) 1100px, 100vw" />
        </section>

        {/* 5. problem */}
        <Block label="[01] THE PROBLEM" headline={project.problemHeadline}>
          <p className="text-base leading-7 text-ink-muted">{project.problem}</p>
        </Block>

        {/* 6. approach */}
        <Block label="[02] THE APPROACH" headline="How it was built">
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
          {project.diagram && (
            <figure className="mt-12">
              <CutFrame src={project.diagram.src} alt={project.diagram.alt} cut="cut-tr" />
              <figcaption className="label mt-3">{project.diagram.caption}</figcaption>
            </figure>
          )}
        </Block>

        {/* 7. build */}
        <section className="wrap py-16 md:py-24" aria-labelledby="build-heading">
          <Tag className="mb-4 block">[03] THE BUILD</Tag>
          {/* The h3s below used to hang off the previous section's h2, which
              left a hole in the outline exactly where the substance is. */}
          <h2 id="build-heading" className="display mb-10 text-2xl md:text-4xl">
            What {project.name} is made of
          </h2>
          <div className="space-y-16">
            {project.build.map((b, i) => (
              <div key={b.title} className="grid items-center gap-8 md:grid-cols-2">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <CutFrame src={b.image} alt={b.alt} cut={i % 2 === 0 ? "cut-tr" : "cut-bl"} />
                </div>
                <FadeIn className={i % 2 === 1 ? "md:order-1" : ""}>
                  <h3 className="display text-2xl md:text-3xl">{b.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-ink-muted">{b.body}</p>
                </FadeIn>
              </div>
            ))}
          </div>
        </section>

        {/* 8. results */}
        <section className="rule-t bg-paper-deep" aria-labelledby="result-heading">
          <div className="wrap py-20 md:py-28">
            <Tag className="mb-4 block">[04] THE RESULT</Tag>
            <h2 id="result-heading" className="display mb-10 text-2xl md:text-4xl">
              What {project.name} measured
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
          </div>
        </section>

        {/* 9. reflection */}
        <Block label="[05] WHAT I'D DO DIFFERENTLY" headline="Honestly">
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
      <div>
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
