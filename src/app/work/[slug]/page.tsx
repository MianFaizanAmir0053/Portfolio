import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  projects,
  getProject,
  projectNeighbours,
  type BuildBlock,
  type Project,
} from "@/data/projects";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { CurtainText, Scramble, Tag } from "@/components/site/primitives";
import { LineDraw } from "@/components/site/scroll-fx";
import { CaseFigure } from "@/components/site/case-study";
import { JsonLd } from "@/components/site/JsonLd";
import { imageMeta } from "@/lib/image-meta";
import { PERSON, CONTENT_REVIEWED } from "@/lib/site";
import { breadcrumbSchema, caseStudySchema, graph, webPageSchema } from "@/lib/schema";
import { BUTTON, SPACE, TYPE } from "@/lib/typography";
import { cn } from "@/lib/utils";

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

const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-09-25" → "25 September 2026". British, and fixed to UTC so the build machine's zone cannot move the day. */
const longDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));

/** A diagram caption as data carries it ("* REQUEST, BILLING…"), as a name for the figure. */
const figureName = (caption: string) => {
  const text = caption.replace(/^\*\s*/, "").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/*
 * The build, as the page lays it out.
 *
 * A block with a picture gets the full width of the page; the text-only blocks
 * between pictures are gathered into one grid of notes instead of each taking
 * a screen to itself. On the old pinned deck, Alfa's six text-only blocks were
 * six near-empty screens in a row. Authored order and numbering are kept.
 */
type BuildGroup =
  | { kind: "figure"; block: BuildBlock & { image: string }; n: number; order: number }
  | { kind: "notes"; items: { block: BuildBlock; n: number }[] };

function groupBuild(build: BuildBlock[]): BuildGroup[] {
  const groups: BuildGroup[] = [];
  let figures = 0;
  build.forEach((block, i) => {
    if (block.image) {
      groups.push({ kind: "figure", block: { ...block, image: block.image }, n: i + 1, order: figures++ });
      return;
    }
    const last = groups[groups.length - 1];
    if (last?.kind === "notes") last.items.push({ block, n: i + 1 });
    else groups.push({ kind: "notes", items: [{ block, n: i + 1 }] });
  });
  return groups;
}

/** Metric tiles per row on a desktop, by how many there are, so no row is left with one. */
const METRIC_COLS: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

/*
 * Type and spacing come from the site's shared roles (`@/lib/typography`),
 * which are the homepage's: a chapter headline here is a section headline
 * there, a constraint's title is an FAQ question's, a paragraph is the same
 * 14px everywhere. The case studies used to run a scale of their own, and
 * the difference was what read as "changed" between the homepage and them.
 */

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
  const n = (key: string) => pad(sections.indexOf(key) + 1);
  const crumbs = breadcrumbSchema(path, [
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    { name: project.name, path },
  ]);

  const stackShort =
    project.stack.length > 3
      ? `${project.stack.slice(0, 3).join(", ")} +${project.stack.length - 3}`
      : project.stack.join(", ");

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
              [{pad(position)} / {pad(projects.length)}]
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
        {/*
         * 2. title. Built like every other page's opening — label, title,
         * the paragraph under it, then the action — at the homepage hero's
         * size, so a case study opens the way the rest of the site does.
         */}
        <section className={cn("wrap", SPACE.pageHead)} aria-label="Introduction">
          <div className={cn(SPACE.tag, "flex flex-wrap items-center gap-3")}>
            <Tag>[CASE STUDY {project.index}]</Tag>
            {/* Honest scope before anything else: two of the six are unfinished. */}
            {project.inDevelopment && (
              <span className="label bg-cobalt px-2 py-1 text-paper">[IN DEVELOPMENT]</span>
            )}
          </div>

          <CurtainText
            as="h1"
            immediate
            className={TYPE.hero}
            lines={[
              <span key="1" className="block">
                {project.name}
              </span>,
              /*
               * The tagline is its own line, at the size the homepage sets a
               * project's title, with room below for the accent face's
               * descenders, which the display caps above it do not have.
               */
              <span key="2" className={cn(TYPE.tagline, "pb-[0.12em]")}>
                {project.tagline}
              </span>,
            ]}
          />

          <p className={cn(TYPE.intro, SPACE.intro, "max-w-2xl")}>{project.summary}</p>
          {project.liveUrl && (
            /*
             * Some of these products are behind a login. Sending a reader to
             * an auth wall under a link that promised a live site is worse than
             * not linking at all, so a gated app says so before it is clicked.
             */
            <div className={cn(SPACE.intro, "flex flex-wrap items-center gap-x-4 gap-y-3")}>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener"
                className={cn(BUTTON.secondary, "inline-flex items-center gap-2")}
              >
                {project.liveGated ? "Open" : "Visit"} {project.liveLabel}
                <span aria-hidden>↗</span>
              </a>
              {project.liveGated && <span className={TYPE.compact}>Login required</span>}
            </div>
          )}
        </section>

        {/* 3. the facts a reader checks first */}
        <section className="wrap" aria-label="Project facts">
          <dl className="grid grid-cols-2 rule-t rule-b lg:grid-cols-4">
            {[
              ["Role", project.role],
              ["Timeline", project.timeline],
              ["Status", project.status],
              ["Stack", stackShort],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={cn(
                  "py-5 md:py-6",
                  i % 2 === 1 && "border-l pl-4 md:pl-6",
                  i >= 2 && "border-t lg:border-t-0",
                  i === 2 && "pr-4 lg:border-l lg:pl-6",
                  i === 0 && "pr-4",
                )}
              >
                <dt className="label mb-2">{k}</dt>
                {/* A value, as the homepage sets its dd's: 14px, white. */}
                <dd className="text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/*
         * 4. cover — at its own shape and the full width of the page. For a
         * project with no screenshot yet the cover is its architecture
         * diagram, captioned here and not repeated below.
         */}
        <section className={cn("wrap", SPACE.block)} aria-label="Cover">
          <CaseFigure
            src={project.image}
            alt={project.alt}
            {...imageMeta(project.image)}
            eager
            bleed
            cut="cut-bl"
            label={
              coverIsDiagram && project.diagram
                ? `${project.name}: ${figureName(project.diagram.caption)}`
                : `${project.name}: cover`
            }
            caption={
              coverIsDiagram ? <p className="label">{project.diagram?.caption}</p> : undefined
            }
          />
        </section>

        {/* 5. at a glance — who was on it, at what scale, owning what */}
        {project.context && (
          <section className="wrap" aria-labelledby="glance-heading">
            <div className={cn("grid gap-y-8 lg:grid-cols-12 lg:gap-x-8", SPACE.section)}>
              {/* A bracketed label heading, as the homepage heads its small
                  blocks ([KEY DECISION], [WHAT I DO]); in the margin, like
                  the chapters' labels, but unnumbered: it is the brief, not a
                  step in the story. */}
              <h2 id="glance-heading" className="label lg:col-span-3">
                [AT A GLANCE]
              </h2>
              <div className="lg:col-span-9">
                {/*
                 * Balanced columns rather than a row grid: the entries run
                 * from four words to forty, and a grid of rows left a tall
                 * entry beside a short one and a hole under the short one.
                 * Keys are grey here as in the facts strip above: lime is
                 * kept for what is counted and what is clicked.
                 */}
                <dl className="gap-x-8 sm:columns-2">
                  {project.context.map((c) => (
                    <div key={c.k} className="mb-8 break-inside-avoid">
                      <dt className="label mb-2">{c.k}</dt>
                      <dd className={TYPE.body}>{c.v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-2 rule-t pt-6">
                  <h3 className="label mb-4">[STACK]</h3>
                  {/* The homepage's and /work's stack tags, exactly. */}
                  <ul className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <li key={tech} className="label border border-ink px-2 py-1 text-ink">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 6. problem — the claim, set large, and the case for it beneath */}
        <Chapter id="problem" n={n("problem")} name="The problem" headline={project.problemHeadline}>
          <Axis className={SPACE.intro}>
            <p className={cn(TYPE.body, "max-w-[64ch] lg:col-span-7 lg:col-start-4")}>
              {project.problem}
            </p>
          </Axis>
        </Chapter>

        {/* 6b. constraints — what could not be done, laid out side by side */}
        {project.constraints && (
          <Chapter
            id="constraints"
            n={n("constraints")}
            name="The constraints"
            headline={project.headlines?.constraints ?? "What the job ruled out"}
          >
            {/* Three across only from `lg`: at a tablet's width the columns
                were 200px, four or five words to a line. */}
            <ol className={cn("grid gap-8 lg:grid-cols-3", SPACE.content)}>
              {project.constraints.map((constraint, i) => (
                // Built as the homepage's experience cards are: the outlined
                // index, then the title at an item's size, then the text.
                <li key={constraint.title} className="relative pt-5">
                  <LineDraw delay={i * 0.12} />
                  <span aria-hidden className={cn(TYPE.index, "block")}>
                    {pad(i + 1)}
                  </span>
                  <h3 className={cn(TYPE.item, "mt-6")}>{constraint.title}</h3>
                  <p className={cn(TYPE.body, "mt-3 max-w-[64ch]")}>{constraint.body}</p>
                </li>
              ))}
            </ol>
          </Chapter>
        )}

        {/* 7. approach — the account, its decisions beside it, then the map */}
        <Chapter id="approach" n={n("approach")} name="The approach" headline="How it was built">
          <Axis className={cn("gap-y-12", SPACE.intro)}>
            <p className={cn(TYPE.body, "lg:col-span-5 lg:col-start-4")}>{project.approach}</p>
            <div className="lg:col-span-4 lg:col-start-9">
              <h3 className="label mb-4">[KEY DECISIONS]</h3>
              <ol>
                {project.decisions.map((d, i) => (
                  // On the text's baseline, not nudged to it: the index is 12px
                  // caps beside 14px sentence case.
                  <li key={d} className={cn(TYPE.compact, "flex items-baseline gap-4 border-t py-4")}>
                    <span className="label shrink-0 text-cobalt">[{pad(i + 1)}]</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Axis>
          {project.diagram && !coverIsDiagram && (
            <CaseFigure
              className={SPACE.block}
              src={project.diagram.src}
              alt={project.diagram.alt}
              {...imageMeta(project.diagram.src)}
              bleed
              label={`${project.name}: ${figureName(project.diagram.caption)}`}
              caption={<p className="label">{project.diagram.caption}</p>}
            />
          )}
        </Chapter>

        {/*
         * 7b. trade-offs — the section that turns a task list into a record of
         * decisions. Each row names what was rejected and what the choice cost,
         * because a decision with no alternative and no price was not a decision.
         * A ledger, read across: every row is open, since the cost and the
         * benefit are the point and a reader should not have to ask for them.
         */}
        {project.tradeoffs && (
          <Chapter
            id="tradeoffs"
            n={n("tradeoffs")}
            name="The trade-offs"
            headline={project.headlines?.tradeoffs ?? "What each choice cost"}
          >
            <div className={SPACE.content}>
              <div aria-hidden className="hidden grid-cols-12 gap-x-8 pb-5 lg:grid">
                <span className="label col-span-3">Decision</span>
                <span className="label col-span-3">Instead of</span>
                <span className="label col-span-3">What it cost</span>
                <span className="label col-span-3 text-cobalt">What it bought</span>
              </div>
              <ol>
                {project.tradeoffs.map((tradeoff, i) => (
                  <li
                    key={tradeoff.decision}
                    className="relative grid gap-y-5 py-8 lg:grid-cols-12 lg:gap-x-8 lg:py-10"
                  >
                    <LineDraw delay={0.05} />
                    {/* The index sits above the heading, not inside it, as it
                        does on every other titled item here. */}
                    <div className="lg:col-span-3">
                      <p className="label text-cobalt">[{pad(i + 1)}]</p>
                      <h3 className={cn(TYPE.item, "mt-3")}>{tradeoff.decision}</h3>
                    </div>
                    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-3 lg:col-span-9">
                      {(
                        [
                          ["Instead of", tradeoff.instead, false],
                          ["What it cost", tradeoff.cost, false],
                          ["What it bought", tradeoff.bought, true],
                        ] as const
                      ).map(([k, v, gain]) => (
                        <div key={k}>
                          {/* The column heads above carry these on a desktop. */}
                          <dt className={cn("label mb-2 lg:sr-only", gain && "text-cobalt")}>{k}</dt>
                          <dd className={TYPE.compact}>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                ))}
              </ol>
            </div>
          </Chapter>
        )}

        {/* 8. build — the pictures at full width, the text-only parts as notes */}
        <Chapter
          id="build"
          n={n("build")}
          name="The build"
          headline={project.headlines?.build ?? `What ${project.name} is made of`}
        >
          {/* One picture to the next at the block distance: the gap between
              the homepage's reach intro and its map. */}
          <div className={cn("space-y-12 md:space-y-16", SPACE.content)}>
            {groupBuild(project.build).map((group) =>
              group.kind === "figure" ? (
                <article key={group.block.title} aria-labelledby={`build-${group.n}`}>
                  <CaseFigure
                    src={group.block.image}
                    alt={group.block.alt ?? ""}
                    {...imageMeta(group.block.image)}
                    bleed
                    cut={group.order % 2 === 0 ? "cut-tr" : "cut-bl"}
                    label={group.block.title}
                  />
                  {/* The index in the margin sits on the title's baseline. */}
                  <Axis className="mt-8 gap-y-3 lg:items-baseline">
                    <p className="label text-cobalt lg:col-span-3 lg:col-start-1 lg:row-start-1">
                      [{pad(group.n)}]
                    </p>
                    <div className="lg:col-span-7 lg:col-start-4 lg:row-start-1">
                      {/* A card's title, as the homepage titles its experience cards. */}
                      <h3 id={`build-${group.n}`} className={TYPE.title}>
                        {group.block.title}
                      </h3>
                      <p className={cn(TYPE.body, "mt-3 max-w-[64ch]")}>{group.block.body}</p>
                    </div>
                  </Axis>
                </article>
              ) : (
                <Axis key={group.items[0].block.title}>
                  {/* Two across from `lg`, like the constraints: at a tablet's
                      width each column held five or six words a line. */}
                  <ul
                    className={cn(
                      "grid gap-8 lg:col-span-9 lg:col-start-4",
                      group.items.length > 1 && "lg:grid-cols-2",
                    )}
                  >
                    {group.items.map(({ block, n: num }, i) => (
                      <li
                        key={block.title}
                        className={cn(
                          "relative pt-5",
                          // An odd one out closes the grid across both columns instead of leaving a hole.
                          group.items.length > 1 &&
                            group.items.length % 2 === 1 &&
                            i === group.items.length - 1 &&
                            "lg:col-span-2",
                        )}
                      >
                        <LineDraw delay={(i % 2) * 0.1} />
                        <p className="label text-cobalt">[{pad(num)}]</p>
                        <h3 className={cn(TYPE.item, "mt-3")}>{block.title}</h3>
                        <p className={cn(TYPE.body, "mt-3 max-w-[64ch]")}>{block.body}</p>
                      </li>
                    ))}
                  </ul>
                </Axis>
              ),
            )}
          </div>
        </Chapter>

        {/*
         * 8b. what broke. mailagent already carries a section like this and it
         * is the most credible thing on the site; a case study that only lists
         * wins asks to be taken on trust. Set as a log, in the order it
         * happened.
         */}
        {project.broke && (
          <Chapter id="broke" n={n("broke")} name="What broke" headline="And what fixed it">
            <Axis className={SPACE.content}>
              <ol className="ml-1 border-l lg:col-span-7 lg:col-start-4">
                {project.broke.map((item, i) => (
                  // 32px between entries: the same distance as between items in a grid.
                  <li key={item.title} className="relative pb-8 pl-8 last:pb-0 md:pl-12">
                    {/* Centred on the index's line: 12px type on a 14.4px line. */}
                    <span aria-hidden className="absolute top-[3px] -left-[5px] h-[9px] w-[9px] bg-cobalt" />
                    <p className="label text-cobalt">!{pad(i + 1)}</p>
                    <h3 className={cn(TYPE.item, "mt-3")}>{item.title}</h3>
                    <p className={cn(TYPE.body, "mt-3 max-w-[64ch]")}>{item.body}</p>
                  </li>
                ))}
              </ol>
            </Axis>
          </Chapter>
        )}

        {/* 9. results */}
        <Chapter
          id="result"
          n={n("result")}
          name="The result"
          headline={project.headlines?.result ?? `What ${project.name} measured`}
          deep
        >
          <ul
            className={cn(
              "grid grid-cols-2 gap-8 lg:gap-x-0",
              SPACE.content,
              METRIC_COLS[project.metrics.length] ?? "lg:grid-cols-4",
            )}
          >
            {project.metrics.map((m, i) => (
              <li key={m.caption} className={cn("lg:px-8", i === 0 ? "lg:pl-0" : "lg:border-l")}>
                <p className={TYPE.metric}>
                  <Scramble value={m.value} />
                </p>
                {/* Caption and note as labels, as the homepage captions its
                    counts ("* years in production") and /work its results. */}
                <p className="label mt-4 text-ink">{m.caption}</p>
                {m.note && <p className="label mt-1">{m.note}</p>}
              </li>
            ))}
          </ul>
          {/*
           * Provenance. The tiles are large and confident and every one of
           * them is a claim; this is the sentence that says which are
           * platform records, which are self-reported, and which are counts
           * of what exists rather than measurements of what happened. It
           * costs a line and it is the difference between a number a reader
           * believes and one they discount.
           */}
          {project.metricsNote && (
            <Axis className={SPACE.block}>
              {/* A sub-heading, so set like [KEY DECISIONS] and [STACK]: the
                  lime rule beside it is the accent, not the words. */}
              <div className="border-l-2 border-cobalt pl-6 lg:col-span-7 lg:col-start-4">
                <h3 className="label mb-3">[HOW THESE WERE MEASURED]</h3>
                <p className={TYPE.body}>{project.metricsNote}</p>
              </div>
            </Axis>
          )}
        </Chapter>

        {/* 10. reflection — the author's own words, set as the page's last statement */}
        <Chapter id="reflection" n={n("reflection")} name="What I’d do differently" headline="Honestly">
          <Axis className={SPACE.intro}>
            {/* The homepage's statement size: the one paragraph a page stops for. */}
            <div className="relative lg:col-span-7 lg:col-start-4">
              <span
                aria-hidden
                className="accent-word pointer-events-none absolute -top-3 left-0 block text-[3.5rem] leading-none select-none lg:-left-12"
              >
                “
              </span>
              <p className={cn(TYPE.statement, "pt-10 lg:pt-0")}>{project.reflection}</p>
            </div>
          </Axis>
        </Chapter>

        {/*
         * Byline. A case study with no author and no date is a page an answer
         * engine has no reason to trust and no way to date — and both are
         * weighted heavily. The name links to the entity the Person schema on
         * this page already declares.
         */}
        <section className="wrap" aria-label="Case study attribution">
          <div className={cn("flex flex-wrap gap-x-10 gap-y-2 rule-t py-8", TYPE.compact)}>
            <p>
              Written by{" "}
              <Link href="/about" className="text-cobalt underline-offset-4 hover:underline">
                {PERSON.name}
              </Link>
            </p>
            <p>
              Role on {project.name}: <span className="text-ink">{project.role}</span>
            </p>
            <p>
              Last reviewed <time dateTime={CONTENT_REVIEWED}>{longDate(CONTENT_REVIEWED)}</time>
            </p>
          </div>
        </section>

        {/* 11. the ask — the reader who got this far is the one most likely
            to act, so both doors are here before the next case study. */}
        <section className="rule-t bg-paper-deep">
          <div className={cn("wrap flex flex-wrap items-end justify-between gap-8", SPACE.section)}>
            {/* It speaks at section level, so it is set as every section headline is. */}
            <p className={TYPE.section}>
              Need something like this <span className="accent-word">built</span>?
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className={BUTTON.primary}>
                Start a project →
              </Link>
              <a href="/resume.pdf" className={BUTTON.secondary}>
                Download resume (PDF) ↓
              </a>
            </div>
          </div>
        </section>

        {/* 12. next project — named large, with its cover, so the next read is a picture away */}
        {next && <NextProject project={next} />}
      </main>

      <Footer />
    </div>
  );
}

/**
 * One chapter of the case study.
 *
 * The page runs on a twelve-column grid with a hanging margin: the bracket
 * label sits in the first three columns and everything a reader reads —
 * headline, body, lists — starts on one edge at the fourth. Pictures, the
 * trade-off ledger and the numbers break out to the full width against that
 * edge. It replaces a split where every headline pinned in a left column and
 * the text ran in the right one, which left half of each screen empty and
 * gave eight sections one silhouette.
 *
 * The rule across the top draws itself as the chapter arrives, and the
 * headline rises on the site's curtain.
 */
function Chapter({
  id,
  n,
  name,
  headline,
  deep = false,
  children,
}: {
  id: string;
  n: string;
  name: string;
  headline: string;
  /** The results band: one step up in ground, so the numbers sit on their own plate. */
  deep?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn(deep && "bg-paper-deep")}>
      <div className="wrap">
        <div className={cn("relative", SPACE.section)}>
          <LineDraw />
          {/* Label to headline is 24px when they stack, the homepage's `mb-6`. */}
          <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-8">
            <p className="label lg:col-span-3">
              <span className="text-cobalt">[{n}]</span> {name}
            </p>
            <CurtainText
              id={`${id}-heading`}
              className={cn(TYPE.section, "lg:col-span-9")}
              lines={[<Fragment key="1">{headline}</Fragment>]}
            />
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * The page grid, for content inside a chapter. Children place themselves:
 * reading text starts at `lg:col-start-4`, the chapter's edge.
 */
function Axis({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("grid lg:grid-cols-12 lg:gap-x-8", className)}>{children}</div>;
}

/**
 * The next case study, as a door rather than a footnote: its name at display
 * size and its cover beside it. On the inverted plate the site ends every
 * page on, so the change of ground says the case study is over.
 */
function NextProject({ project }: { project: Project }) {
  const cover = imageMeta(project.image);
  return (
    <Link
      href={`/work/${project.slug}`}
      className="on-ink group block bg-ink py-16 text-paper md:py-24"
    >
      <div className="wrap grid items-end gap-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <p className="label mb-6">Next case study [{project.index}]</p>
          {/* Set as that case study's own title is, so the door and the room match. */}
          <p className={cn(TYPE.hero, "transition-colors duration-300 group-hover:text-link")}>
            {project.name}
          </p>
          <p className={cn(TYPE.tagline, "pb-[0.12em]")}>{project.tagline}</p>
          <p className="label mt-8 text-paper">Read the case study →</p>
        </div>
        <div className="lg:col-span-5">
          <div
            className="cut-tr relative overflow-hidden bg-paper-deep"
            style={{ aspectRatio: `${cover.width} / ${cover.height}` }}
          >
            <Image
              src={project.image}
              alt=""
              width={cover.width}
              height={cover.height}
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="block h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
