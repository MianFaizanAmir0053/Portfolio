import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject, projectNeighbours } from "@/data/projects";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { CurtainText, CutFrame, FadeIn, Scramble, Tag } from "@/components/site/primitives";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return { title: "Case study not found — Faizan Amir", robots: { index: false } };
  }
  const title = `${project.name} — ${project.tagline} · Faizan Amir`;
  return {
    title,
    description: project.summary,
    openGraph: { title, description: project.summary },
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next, position } = projectNeighbours(project.slug);

  return (
    <div className="min-h-screen bg-paper">
      <UtilityBar />

      {/* 1. back bar */}
      <nav
        className="sticky top-11 z-40 bg-paper/95 backdrop-blur-[2px] rule-b"
        aria-label="Case study navigation"
      >
        <div className="wrap flex h-11 items-center justify-between">
          <Link href={`/#work-${project.slug}`} className="label text-ink hover:text-cobalt">
            ← [INDEX]
          </Link>
          <div className="flex items-center gap-5">
            <span className="label">
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

      <main>
        {/* 2. title block */}
        <section className="wrap py-16 md:py-24">
          <Tag className="mb-6 block">[CASE STUDY {project.index}]</Tag>
          <CurtainText
            as="h1"
            className="display text-[14vw] md:text-[clamp(3.5rem,8vw,8rem)]"
            lines={[
              <Fragment key="1">{project.name}</Fragment>,
              <Fragment key="2">
                <span className="accent-word">{project.tagline}</span>
              </Fragment>,
            ]}
          />
          <FadeIn delay={0.2}>
            <p className="mt-8 max-w-2xl text-base leading-7 text-ink-muted">{project.summary}</p>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
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
          <CutFrame src={project.image} alt={project.alt} cut="cut-bl" ratio="aspect-[16/9]" eager />
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
        <section className="wrap py-16 md:py-24">
          <Tag className="mb-10 block">[03] THE BUILD</Tag>
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
        <section className="rule-t bg-paper-deep">
          <div className="wrap py-20 md:py-28">
            <Tag className="mb-10 block">[04] THE RESULT</Tag>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {project.metrics.map((m) => (
                <div key={m.caption}>
                  <p className="display text-[14vw] leading-[0.85] text-cobalt md:text-[8vw]">
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
