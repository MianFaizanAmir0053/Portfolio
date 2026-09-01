import type { Metadata } from "next";
import Link from "next/link";
import { projects, otherWork } from "@/data/projects";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { CutFrame, Tag } from "@/components/site/primitives";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, graph, itemListSchema, webPageSchema } from "@/lib/schema";

const TITLE = "Work — 6 full-stack and AI engineering case studies";
const DESCRIPTION =
  "Six shipped projects, written up end to end: the problem, the architecture decision behind it, and what the numbers did afterwards. AI, fintech, telehealth and commerce.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work" },
  openGraph: {
    title: `${TITLE} · Faizan Amir`,
    description: DESCRIPTION,
    type: "website",
    url: "/work",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} · Faizan Amir`,
    description: DESCRIPTION,
  },
};

/**
 * The case-study index.
 *
 * Before this page existed the six case studies were reachable only through a
 * scroll-driven card stack on the homepage — four of them pinned, two of them
 * only from a secondary list. That is a lot of JavaScript between a crawler and
 * six pages worth indexing. This is the plain version: every case study, one
 * click from the root, with the sentence that says what it was.
 */
export default function WorkIndex() {
  const crumbs = breadcrumbSchema("/work", [
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
  ]);

  return (
    <div className="min-h-screen bg-paper">
      <JsonLd
        data={graph(
          webPageSchema({
            path: "/work",
            name: TITLE,
            description: DESCRIPTION,
            type: "CollectionPage",
            breadcrumb: crumbs,
          }),
          crumbs,
          itemListSchema(
            "/work",
            projects.map((p) => ({
              name: `${p.name} — ${p.tagline}`,
              path: `/work/${p.slug}`,
              description: p.summary,
            })),
          ),
        )}
      />
      <UtilityBar />

      <nav className="rule-b bg-paper/95" aria-label="Breadcrumb">
        <div className="wrap flex h-11 items-center">
          <ol className="label flex items-center gap-2 text-ink">
            <li>
              <Link href="/" className="hover:text-cobalt">
                HOME
              </Link>
            </li>
            <li aria-hidden className="text-ink-muted">
              /
            </li>
            <li className="text-cobalt" aria-current="page">
              WORK
            </li>
          </ol>
        </div>
      </nav>

      <main id="main">
        <section className="wrap py-16 md:py-24">
          <Tag className="mb-6 block">[CASE STUDIES]</Tag>
          <h1 className="display text-[13vw] leading-[0.9] md:text-[clamp(3.5rem,7vw,7rem)]">
            Six projects, <span className="accent-word">written up</span> properly.
          </h1>
          {/*
           * A self-contained answer block. Someone — or something — arriving
           * with the question "what has this engineer actually built?" should be
           * able to lift this paragraph out and have the answer, with no
           * surrounding page required.
           */}
          <p className="mt-8 max-w-2xl text-base leading-7 text-ink-muted">
            Every project below is live or in active development. Each write-up follows the same shape: the
            problem as the business had it, the architecture decision that answered it, what got
            built, and the numbers afterwards — including the ones that are still targets rather
            than readings. Domains run from agentic AI over legal documents to telehealth commerce,
            multi-role fintech and per-user model training.
          </p>
        </section>

        <section className="wrap rule-t">
          <ul>
            {projects.map((project) => (
              <li key={project.slug} className="group rule-b">
                <Link
                  href={`/work/${project.slug}`}
                  className="grid items-center gap-6 py-10 md:grid-cols-[0.9fr_1.4fr] md:gap-10 lg:grid-cols-[0.9fr_1.4fr_auto]"
                >
                  <CutFrame
                    src={project.image}
                    alt={project.alt}
                    cut="cut-tr"
                    ratio="aspect-[16/10]"
                    parallax={false}
                    grayscale
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 36vw, 100vw"
                  />

                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="label text-cobalt">[{project.index}]</span>
                      <h2 className="display text-2xl md:text-4xl">
                        {project.name} — <span className="accent-word">{project.tagline}</span>
                      </h2>
                      {/* The same badge the index uses. Three of these six are
                          unfinished and say so on their own pages; the list
                          that sends people there should say it too. */}
                      {project.inDevelopment && (
                        <span className="label bg-cobalt px-2 py-1 text-paper">[IN DEVELOPMENT]</span>
                      )}
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-ink-muted">
                      {project.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                      {project.indexMetrics.map((metric) => (
                        <span key={metric} className="label text-ink">
                          <span aria-hidden className="text-cobalt">*</span> {metric}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.stack.slice(0, 5).map((tech) => (
                        <span key={tech} className="label border border-ink px-2 py-1 text-ink">
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 5 && (
                        <span className="label px-2 py-1 text-ink-muted">
                          +{project.stack.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* The CTA is a ~210px nowrap label. Held in its own track
                      from 768px it took a third of the row and left the
                      thumbnail at 156px beside a heading wrapping to three
                      lines, so it only earns a column once there is room for
                      one: below `lg` it drops under the write-up instead. */}
                  <span className="label text-cobalt md:col-span-2 lg:col-span-1 lg:self-end lg:whitespace-nowrap lg:pb-1">
                    READ THE {project.name.toUpperCase()} CASE STUDY →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Everything shipped that does not have a full write-up, so nothing is
            reachable only from the homepage. */}
        <section className="wrap py-16 md:py-24">
          {/* No bracket eyebrow here: it would have read [ALSO SHIPPED] over
              "Also shipped", and a label that repeats the heading word for
              word is a marker that has stopped marking anything. */}
          <h2 className="display mb-6 text-2xl md:text-4xl">Also shipped</h2>
          <ul className="grid gap-8 md:grid-cols-3">
            {otherWork.map((work) => (
              <li key={work.name} className="rule-t pt-5">
                <h3 className="display text-xl md:text-2xl">{work.name}</h3>
                <p className="label mt-1 text-cobalt">{work.tagline}</p>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{work.note}</p>
                {work.external ? (
                  <a
                    href={work.href}
                    target="_blank"
                    rel="noopener"
                    className="label mt-4 inline-block text-cobalt hover:underline"
                  >
                    {work.hrefLabel} ↗
                  </a>
                ) : (
                  <Link href={work.href} className="label mt-4 inline-block text-cobalt hover:underline">
                    {work.hrefLabel} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rule-t bg-paper-deep">
          <div className="wrap flex flex-wrap items-center justify-between gap-6 py-14">
            <p className="display text-2xl md:text-4xl">
              Need something like one of these <span className="accent-word">built</span>?
            </p>
            <Link
              href="/contact"
              className="bg-cobalt px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-cobalt-deep"
            >
              Start a conversation →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
