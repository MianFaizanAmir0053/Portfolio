import { Fragment } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { featuredProjects, projects, type Project } from "@/data/projects";
import { EXPERIENCE, BIO, EDUCATION } from "@/data/experience";
import { SOCIAL } from "@/data/social";
import { services } from "@/data/services";
import { JsonLd } from "@/components/site/JsonLd";
import { PERSON } from "@/lib/site";
import { faqSchema, graph, itemListSchema, webPageSchema } from "@/lib/schema";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { ContactForm } from "@/components/site/ContactForm";
import { Skills } from "@/components/site/Skills";
import { Reach } from "@/components/site/Reach";
import { BeyondCode } from "@/components/site/BeyondCode";
import { ComingSoon } from "@/components/site/ComingSoon";
import { OtherWork } from "@/components/site/OtherWork";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import {
  CurtainText,
  CutFrame,
  FadeIn,
  Marquee,
  Scramble,
  Tag,
  Tilt,
} from "@/components/site/primitives";
import {
  CardStack,
  PinnedLitText,
  HPanel,
  HorizontalScroll,
  LineDraw,
  KineticHeadline,
  MagneticSurface,
  ParallaxLayer,
} from "@/components/site/scroll-fx";

/** Stack tags a stacked card shows before collapsing the rest into a count. */
const STACK_TAGS_ON_CARD = 6;

/*
 * Margin notes on the bio, not a summary of it. Each one is anchored to the
 * word in BIO it explains — the word lights cobalt as its card lands, so
 * the pairing is visible rather than implied. `pos` is where the card sits in
 * the held frame on wide screens; the anchors decide the order they arrive in,
 * which is why the positions read left → right → left rather than top to bottom.
 */
const ABOUT_FACTS = [
  {
    k: "FOCUS",
    v: "RAG architectures · agentic AI · LLM integration",
    anchor: "RAG",
    // Fixed, not %: the nav rail sits at a fixed distance from the right edge
    // too, so a percentage offset closes on it as the viewport narrows. This
    // keeps a constant ~26px gap from the rail's left edge at every width.
    pos: "right-[5.5rem] top-[27%]",
  },
  {
    k: "BASE",
    v: "Lahore, PK — working across the US, UK, Middle East & Europe",
    anchor: "users",
    pos: "left-[3%] bottom-[16%]",
  },
  {
    k: "CURRENTLY",
    v: "Senior Software Engineer, Ward Web Solutions",
    anchor: "Senior",
    pos: "left-[3%] top-[15%]",
  },
];


/**
 * The five questions someone types before they type a name. Rendered on the
 * page and mirrored into FAQPage structured data — one source, so the answer an
 * engine quotes is the answer a visitor reads.
 */
const HOME_FAQS = [
  {
    q: "What does Faizan Amir do?",
    a: "Faizan Amir is a senior software engineer who builds full-stack and AI-driven applications in React, Next.js, TypeScript, Node.js and Python. His focus is retrieval-augmented generation, agentic AI and LLM integration, delivered as production systems rather than prototypes.",
  },
  {
    q: "What has he actually shipped?",
    a: "Six case studies, all live or in active development: a live telehealth commerce platform at 250+ subscriptions and £31,000+ in subscription revenue, an AI mini-site builder at 150+ users across three metered subscription tiers, an agentic RAG legal platform at 95% extraction accuracy, an AI image SaaS at 200+ users and $5,000+ revenue, a three-service e-commerce build, and a multi-role fintech platform over Python microservices.",
  },
  {
    q: "Is he available to hire?",
    a: "Yes, for scoped builds with a defined outcome and for embedded contract work alongside an existing team. Email faizanamir0053@gmail.com or use the contact form. Replies usually land within one working day.",
  },
  {
    q: "Where is he based and who does he work with?",
    a: "Lahore, Pakistan, at UTC+5, working day to day with teams in the United States, United Kingdom, Middle East and Europe across three current and previous roles.",
  },
  {
    q: "What is his strongest area?",
    a: "Applied AI engineering on top of solid product fundamentals: retrieval that preserves document structure, agent workflows with real routing and human approval gates, and evaluation harnesses built before the pipeline is tuned. Five or more RAG and agentic systems have reached production.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-paper">
      <JsonLd
        data={graph(
          webPageSchema({
            path: "/",
            name: `${PERSON.name} — ${PERSON.jobTitle}, Full-Stack & AI`,
            description:
              "Portfolio of Faizan Amir, a senior software engineer building full-stack and AI-driven products in React, Next.js, Node.js and Python.",
            type: "ProfilePage",
          }),
          faqSchema("/", HOME_FAQS),
          itemListSchema(
            "/",
            projects.map((p) => ({
              name: `${p.name} — ${p.tagline}`,
              path: `/work/${p.slug}`,
              description: p.summary,
            })),
          ),
        )}
      />
      <UtilityBar />
      <main id="main">
        <Hero />
        <Marquee
          text="WARD WEB SOLUTIONS + WANILE TECHNOLOGIES + NAZADV + VOLUMIZE + WISDOMUP + CARDER.APP + GOLEGAL.WANILE.DEV + MUTERPE + ALFA + "
          speed={42}
          className="rule-t rule-b"
        />
        <About />
        <Skills />
        <Experience />
        <Reach />
        <FeaturedWork />
        <ComingSoon />
        <OtherWork />
        <Education />
        <BeyondCode />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  /*
   * Each stat now says where it comes from. "200+ USERS" and "$5K+ REVENUE"
   * are Muterpe's numbers; floating them unattributed next to a career summary
   * read as career totals, which is a claim the case studies do not make.
   */
  const tags = [
    { label: "4+ YRS SHIPPING", pos: "left-0 top-[12%]" },
    { label: "200+ USERS · MUTERPE", pos: "right-0 top-[26%]" },
    { label: "8+ PROJECTS LED", pos: "left-[4%] bottom-[22%]" },
    {
      label: "$5K+ REVENUE · MUTERPE",
      pos: "left-[4%] bottom-[6%] md:bottom-[4%]",
    },
  ];

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="wrap relative grid gap-10 pb-16 pt-10 md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:pb-24 md:pt-16"
    >
      {/* Three depth planes leave at three speeds: copy slowest, object mid,
          floating proof stats fastest. */}
      <ParallaxLayer speed={0.07} scope="#hero" className="flex flex-col justify-center">
        <Tag className="mb-6 block">[01] INDEX</Tag>
        {/*
         * The name and the role are inside the h1 now, as its first line. They
         * were a sibling <p> before, which left the page's only h1 reading
         * "I build full-stack and AI-driven systems people actually use." —
         * a good sentence that names neither the person nor the job anyone
         * searches for. `immediate` reveals it from CSS at parse time rather
         * than after hydration: this is the largest text on the page.
         */}
        <CurtainText
          as="h1"
          immediate
          className="display text-[13vw] md:text-[clamp(3.5rem,7.4vw,7.5rem)]"
          lines={[
            <span key="0" className="label mb-4 block text-ink">
              Faizan Amir — Senior Software Engineer
            </span>,
            <Fragment key="1">I build full-stack</Fragment>,
            <Fragment key="2">and AI-driven</Fragment>,
            <Fragment key="3">
              systems people <span className="accent-word">actually</span> use.
            </Fragment>,
          ]}
        />
        <FadeIn delay={0.25}>
          <p className="mt-8 max-w-xl text-base leading-7 text-ink-muted">
            4 years shipping React, Next.js, Python, and Node.js applications for teams and clients
            across the US, Middle East, and Europe.
          </p>
        </FadeIn>

        <div className="mt-10 flex items-center gap-3">
          <Tag>[SCROLL]</Tag>
          <ChevronDown className="animate-bob h-4 w-4 text-cobalt" aria-hidden />
        </div>
      </ParallaxLayer>

      {/* min-w-0: grid items default to min-width:auto, which would refuse to
          shrink below the canvas's intrinsic width and defeat its ResizeObserver. */}
      <div className="relative min-w-0">
        <ParallaxLayer speed={0.24} rotate={3} scope="#hero" className="min-w-0">
          <Tilt className="relative cut-tr grain min-w-0 bg-paper-deep p-4">
            <PixelatedCanvas
              src="/IMG_20230712_220219-removebg-preview.png"
              label="Faizan Amir"
              width={420}
              height={520}
              responsive
              cellSize={5}
              dotScale={0.85}
              shape="square"
              backgroundColor="#131316"
              dropoutStrength={0.35}
              interactive
              distortionMode="swirl"
              distortionStrength={3}
              distortionRadius={90}
              followSpeed={0.2}
              jitterStrength={3}
              jitterSpeed={3}
              maxFps={30}
              sampleAverage
              tintColor="#c8ff3d"
              tintStrength={0.12}
            />
          </Tilt>
        </ParallaxLayer>

        {/* `absolute inset-0`: a transformed wrapper becomes the containing
            block for its absolute children, so it has to match the column box
            or the tags lose their anchoring. */}
        <ParallaxLayer
          speed={0.42}
          scope="#hero"
          className="pointer-events-none absolute inset-0"
        >
          {/* A list, not four loose spans: these are the page's opening proof
              and they should read as a set to anything parsing the document.
              `backdrop-blur` dropped — four permanently-animating elements each
              forcing a backdrop re-rasterisation every frame, above the fold,
              is the most expensive decoration on the page. */}
          <ul aria-label="Headline numbers">
            {tags.map((t, i) => (
              <li
                key={t.label}
                className={`label absolute ${t.pos} animate-drift border border-ink/40 bg-paper/90 px-2 py-1 text-ink`}
                style={{ animationDelay: `${i * 0.8}s` }}
              >
                {t.label}
              </li>
            ))}
          </ul>
        </ParallaxLayer>

        <div className="mt-6 flex justify-end md:absolute md:-bottom-8 md:right-0 md:mt-0">
          <MagneticSurface strength={0.35} radius={60} lift={4}>
            <a
              href="/resume.pdf"
              className="flex h-24 w-24 items-center justify-center rounded-full bg-cobalt text-center text-[10px] font-medium uppercase leading-tight tracking-[0.08em] text-paper transition-colors hover:bg-cobalt-deep"
            >
              Download
              <br />
              resume ↓
            </a>
          </MagneticSurface>
        </div>
      </div>
    </section>
  );
}


/* ---------------- ABOUT — held on screen, lit as it is read ---------------- */
function About() {
  return (
    <section id="about" className="rule-t" aria-label="About Faizan Amir">
      <PinnedLitText
        paragraphs={BIO}
        // Margin notes, not a section: each lands as the sweep reaches the word
        // it explains, and stays there for the rest of the hold.
        facts={ABOUT_FACTS}
        accent={["shipping", "actually", "problem"]}
        // Statement scale, not body copy — this is the one paragraph the page
        // stops for. Space between the blocks does the work a wall of centred
        // text cannot: it gives the eye somewhere to land between sentences.
        textClassName="mt-7 gap-4 text-[clamp(1.05rem,1.7vw,1.45rem)] leading-[1.5] text-ink [@media(max-height:760px)]:mt-5 [@media(max-height:760px)]:gap-3 [@media(max-height:760px)]:text-[clamp(0.95rem,1.4vw,1.15rem)]"
        lead={
          <>
            <Tag className="block">[02] ABOUT</Tag>
            {/* CurtainText, not KineticHeadline: a scroll-scrubbed headline
                inside a pinned section freezes the moment the pin engages, and
                would sit here half-scattered. This one runs on its own clock
                off an observer, so the pin cannot strand it. */}
            <CurtainText
              className="display mt-5 text-[12vw] leading-[0.9] md:text-[clamp(2.75rem,5.5vw,5rem)]"
              lines={[
                <Fragment key="about">
                  It’s about <span className="accent-word">shipping</span>
                </Fragment>,
              ]}
            />
            {/* A short rule under the headline, so the statement below reads as
                its own block rather than more of the heading. */}
            <span aria-hidden className="mt-6 block h-px w-12 bg-cobalt" />
          </>
        }
      />
    </section>
  );
}

/* ---------------- EXPERIENCE — pinned, travels sideways ---------------- */
function Experience() {
  const steps = [
    { label: "Intro" },
    ...EXPERIENCE.map((e) => ({ label: e.company })),
    { label: "Today" },
  ];

  return (
    <section id="experience" className="rule-t" aria-label="Experience">
      <HorizontalScroll label="[04] EXPERIENCE" steps={steps}>
        <HPanel width="w-[84vw] sm:w-[58vw] md:w-[38vw] lg:w-[30vw]">
          <div className="flex flex-col justify-center md:min-h-[58vh]">
            <CurtainText
              className="display text-[12vw] md:text-[clamp(2.5rem,3.6vw,3.5rem)]"
              lines={[
                <Fragment key="1">Where</Fragment>,
                <Fragment key="2">
                  I’ve <span className="accent-word">shipped</span>
                </Fragment>,
              ]}
            />
            <p className="mt-8 max-w-sm text-sm leading-7 text-ink-muted">
              Four years across three teams, three continents, and one consistent job: turn the
              requirement into something that survives production.
            </p>
            <p className="label mt-10 flex items-center gap-3 text-cobalt">
              KEEP SCROLLING <span aria-hidden>→</span>
            </p>
          </div>
        </HPanel>

        {EXPERIENCE.map((e) => (
          <HPanel key={e.company}>
            <div className="cut-tr grain relative flex flex-col justify-between border border-ink/20 bg-paper-deep p-7 md:min-h-[58vh] md:p-9">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center bg-cobalt font-display text-sm text-paper"
              >
                +
              </span>
              {/* The longest entry only just clears a 600px-tall viewport, so
                  short screens get a tighter setting rather than a scrollbar
                  inside a pinned panel. */}
              <div>
                <p className="outline-num text-[16vw] md:text-[5vw] [@media(max-height:680px)]:md:text-[3.4vw]">
                  [{e.n}]
                </p>
                {/* Role and company in one heading. Three panels each headed
                    "Senior Software Engineer" with the employer demoted to a
                    paragraph gave the page three identical h3s and no way to
                    tell them apart from the outline alone. */}
                <h3 className="display mt-6 text-2xl md:text-4xl [@media(max-height:680px)]:md:mt-3 [@media(max-height:680px)]:md:text-3xl">
                  {e.role}
                  <span className="accent-word block text-2xl md:text-3xl">{e.company}</span>
                </h3>
                <p className="label mt-4 [@media(max-height:680px)]:mt-2">
                  {e.dates} · {e.place}
                </p>
              </div>
              {/* Broken at its own sentence boundaries rather than set as one
                  block. Each entry is three claims and a run of numbers, and
                  as a six-line paragraph in a 460px column that reads as a
                  wall — three of them in a row on a rail you scroll past.
                  Same words, one claim to a line, so it can be scanned at the
                  speed the panel goes by. */}
              <ul className="mt-6 [@media(max-height:680px)]:mt-4">
                {e.body.split(/(?<=\.)\s+/).map((claim) => (
                  <li
                    key={claim}
                    className="mt-3 text-sm leading-6 text-ink-muted first:mt-0 [@media(max-height:680px)]:mt-2 [@media(max-height:680px)]:text-[13px] [@media(max-height:680px)]:leading-[1.45]"
                  >
                    {claim}
                  </li>
                ))}
              </ul>
            </div>
          </HPanel>
        ))}

        <HPanel width="w-[84vw] sm:w-[58vw] md:w-[34vw] lg:w-[26vw]">
          <div className="flex flex-col justify-center md:min-h-[58vh]">
            <Tag className="block">[TODAY]</Tag>
            <p className="display mt-6 text-[22vw] leading-[0.8] text-cobalt md:text-[7vw]">(4+)</p>
            <p className="label mt-4">* YEARS IN PRODUCTION</p>
            <dl className="mt-10 rule-t">
              {[
                { k: "TEAMS", v: "3" },
                { k: "MARKETS", v: "US · UK · ME · EU" },
                { k: "APIS SHIPPED", v: "30+" },
              ].map((d) => (
                <div key={d.k} className="flex items-baseline justify-between gap-4 rule-b py-3">
                  <dt className="label">{d.k}</dt>
                  <dd className="text-sm">{d.v}</dd>
                </div>
              ))}
            </dl>
            <MagneticSurface className="mt-8 w-fit" strength={0.3} radius={70} lift={0}>
              <Link href="/#work" className="label group relative inline-block text-cobalt">
                SEE WHAT CAME OUT OF IT →
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-cobalt transition-all duration-300 group-hover:w-full" />
              </Link>
            </MagneticSurface>
          </div>
        </HPanel>
      </HorizontalScroll>
    </section>
  );
}

/* ---------------- FEATURED WORK — a deck that stacks ---------------- */
function FeaturedWork() {
  return (
    <section id="work" className="rule-t" aria-label="Featured case studies">
      <div className="wrap flex flex-wrap items-end justify-between gap-6 py-20 md:py-28">
        <div>
          <Tag className="mb-6 block">[FEATURED WORK]</Tag>
          <KineticHeadline
            className="display text-[12vw] md:text-[clamp(3rem,6vw,5.5rem)]"
            lines={["Selected", "case studies"]}
            accent={["case", "studies"]}
          />
        </div>
        <div className="flex items-baseline gap-5">
          <p className="display text-3xl text-ink-muted">
            ({String(featuredProjects.length).padStart(2, "0")})
          </p>
          {/* The counter says four; there are six. This is the only place on the
              homepage that says so and the only body link to the index. */}
          <Link href="/work" className="label text-cobalt hover:underline">
            ALL {projects.length} CASE STUDIES →
          </Link>
        </div>
      </div>

      {/*
       * Each project holds the screen while the next climbs over it. No
       * wrapping <Link>: a card fills the viewport, and making the whole
       * screen one link would navigate on any stray click. The card is the
       * hover `group` instead, so the image and the call-to-action light up
       * together while only they are clickable.
       */}
      <CardStack
        items={featuredProjects.map((p, i) => ({
          key: p.slug,
          content: (
            <article id={`work-${p.slug}`} className="group scroll-mt-24">
              <LineDraw delay={0.05} />
              <div
                className={`wrap grid items-center gap-8 py-12 md:grid-cols-2 md:gap-14 motion-safe:md:py-0 ${
                  i % 2 === 1 ? "md:[direction:rtl]" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                  <Link href={`/work/${p.slug}`} tabIndex={-1} aria-hidden className="block">
                    <Tilt max={6}>
                      <CutFrame
                        src={p.image}
                        alt={p.alt}
                        cut={i % 2 === 0 ? "cut-tr" : "cut-bl"}
                        grayscale
                        parallax={false}
                      />
                    </Tilt>
                  </Link>
                </div>

                <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                  <ProjectAside project={p} href={`/work/${p.slug}`} />
                </div>
              </div>
            </article>
          ),
        }))}
      />
    </section>
  );
}

/**
 * The write-up beside a case-study image.
 *
 * `href` is what separates the two callers. The plain rows are wrapped in a
 * <Link> already, so their call-to-action has to stay a <span> — an anchor
 * inside an anchor is invalid. The pinned rows have no wrapper, so they pass
 * `href` and get a real link.
 */
function ProjectAside({ project: p, href }: { project: Project; href?: string }) {
  const cta = (
    <>
      VIEW CASE STUDY →
      <span className="absolute -bottom-1 left-0 h-px w-0 bg-cobalt transition-all duration-300 group-hover:w-full" />
    </>
  );

  return (
    <div className={href ? "group" : undefined}>
      {href && (
        <p className="display text-[18vw] leading-[0.8] text-transparent [-webkit-text-stroke:1px_var(--ink)] transition-colors duration-300 group-hover:text-cobalt group-hover:[-webkit-text-stroke:1px_var(--cobalt)] md:text-[7vw]">
          [{p.index}]
        </p>
      )}

      {/* Reuses the site's signature line reveal rather than inventing a third
          entrance for the same kind of text. */}
      <CurtainText
        as="h3"
        className="display mt-4 text-3xl md:text-5xl"
        delay={0.15}
        lines={[
          <Fragment key={p.slug}>
            {p.name} — <span className="accent-word">{p.tagline}</span>
          </Fragment>,
        ]}
      />
      {p.inDevelopment && (
        <span className="label mt-3 inline-block bg-cobalt px-2 py-1 text-paper">
          [IN DEVELOPMENT]
        </span>
      )}
      <p className="mt-4 max-w-lg text-sm leading-7 text-ink-muted">{p.summary}</p>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        {p.indexMetrics.map((m) => (
          <span key={m} className="label text-ink">
            <span aria-hidden className="text-cobalt">*</span> {m}
          </span>
        ))}
      </div>

      {/*
       * The one call worth naming before someone commits to the full case
       * study. It is the only thing the old proof reel carried that this row
       * did not already say — everything else it showed (name, tagline, stack,
       * headline metric, a link) was a second copy of what is directly above.
       *
       * Short viewports get a tighter setting rather than a clipped card.
       */}
      <div className="mt-6 rule-t pt-4 [@media(max-height:760px)]:mt-4 [@media(max-height:760px)]:pt-3">
        <p className="label">[KEY DECISION]</p>
        <p className="mt-2 max-w-lg text-sm leading-7 text-ink-muted [@media(max-height:760px)]:leading-6">
          {p.decisions[0]}
        </p>
      </div>

      {/* Capped: the longest stacks run to nine, and a stacked card has to fit
          the screen it sits on. The full list is on the case study itself. */}
      <div className="mt-5 flex flex-wrap gap-2 [@media(max-height:760px)]:mt-3">
        {p.stack.slice(0, STACK_TAGS_ON_CARD).map((t) => (
          <span key={t} className="label border border-ink px-2 py-1 text-ink">
            {t}
          </span>
        ))}
        {p.stack.length > STACK_TAGS_ON_CARD && (
          <span className="label px-2 py-1 text-ink-muted">
            +{p.stack.length - STACK_TAGS_ON_CARD}
          </span>
        )}
      </div>

      <MagneticSurface
        className="mt-8 w-fit [@media(max-height:760px)]:mt-5"
        strength={0.3}
        radius={70}
        lift={0}
      >
        {href ? (
          <Link href={href} className="label relative inline-block text-cobalt">
            {cta}
          </Link>
        ) : (
          <span className="label relative inline-block text-cobalt">{cta}</span>
        )}
      </MagneticSurface>
    </div>
  );
}



function Education() {
  return (
    <section id="education" className="rule-t" aria-labelledby="education-heading">
      {/* The rule sits on the section and the wrap holds only the content, so
          the divider runs edge to edge like every other one on the page. */}
      <div className="wrap py-10 md:py-14">
        <Tag className="mb-3 block">[EDUCATION]</Tag>
        {/* The block had no heading and no id, so a degree sat unattached to any
            titled section of the document. */}
        <h2 id="education-heading" className="display mb-3 text-xl md:text-2xl">
          Education
        </h2>
        <p className="text-sm">
          {EDUCATION.degree} — {EDUCATION.institution}, {EDUCATION.place.split(",")[0]}
        </p>
      </div>
    </section>
  );
}

/* ---------------- FAQ — the questions that get typed ---------------- */
/**
 * Plain <dl>, no scroll effect. This block exists to be read out of context —
 * by a visitor scanning, and by an answer engine lifting a single question and
 * its answer. Anything that hides it behind an interaction defeats the point.
 */
function Faq() {
  return (
    <section id="faq" className="rule-t" aria-label="Frequently asked questions">
      <div className="wrap grid gap-10 py-20 md:grid-cols-[0.7fr_1.3fr] md:py-28">
        {/* Travels with the answers rather than sitting at the top of a column
            the reader has already scrolled past — the same treatment Skills
            and the horizontal rail already use for a section header. */}
        <div className="md:sticky md:top-24 md:self-start">
          <Tag className="mb-6 block">[FAQ]</Tag>
          <h2 className="display text-[11vw] leading-[0.9] md:text-[clamp(2.25rem,4vw,3.5rem)]">
            The <span className="accent-word">short</span> answers
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-ink-muted">
            Longer versions live on{" "}
            <Link href="/about" className="text-cobalt hover:underline">
              about
            </Link>{" "}
            and the{" "}
            <Link href="/services" className="text-cobalt hover:underline">
              service pages
            </Link>
            .
          </p>
        </div>
        <dl className="space-y-8">
          {HOME_FAQS.map((faq) => (
            <div key={faq.q} className="rule-t pt-5">
              <dt className="display text-xl md:text-2xl">{faq.q}</dt>
              <dd className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>

      <nav aria-label="Services" className="mt-14 rule-t pt-6">
        <p className="label mb-4">[WHAT I DO]</p>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {services.map((service) => (
            <li key={service.slug}>
              <Link href={`/services/${service.slug}`} className="text-cobalt hover:underline">
                {service.name} →
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */
function Contact() {
  return (
    <section id="contact" className="rule-t bg-paper-deep" aria-label="Contact">
      <div className="wrap grid gap-12 py-20 md:grid-cols-2 md:py-28">
        <div>
          <Tag className="mb-6 block">[07] CONTACT</Tag>
          <KineticHeadline
            className="display text-[12vw] md:text-[clamp(2.5rem,5vw,4.5rem)]"
            lines={["Let’s build", "something real."]}
            accent={["real."]}
            scatter={1.4}
          />
          <dl className="mt-10 space-y-5">
            <div>
              <dt className="label">[EMAIL]</dt>
              <dd>
                <a href="mailto:faizanamir0053@gmail.com" className="text-cobalt hover:underline">
                  faizanamir0053@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="label">[WHATSAPP]</dt>
              <dd>
                <a
                  href="https://wa.me/923030649009"
                  target="_blank"
                  rel="noopener"
                  className="text-cobalt hover:underline"
                >
                  0303 0649009
                </a>
              </dd>
            </div>
            <div>
              <dt className="label">[SOCIAL]</dt>
              <dd className="flex gap-4 text-sm">
                <a href={SOCIAL.linkedin} target="_blank" rel="noopener" className="hover:text-cobalt">
                  LinkedIn ↗
                </a>
                <a href={SOCIAL.github} target="_blank" rel="noopener" className="hover:text-cobalt">
                  GitHub ↗
                </a>
              </dd>
            </div>
          </dl>
          <p className="mt-10 label">
            <Scramble value="06" /> CASE STUDIES · <Scramble value="200" />+ USERS · MUTERPE
          </p>
        </div>

        <div className="self-center">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
