import { Fragment } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { projects } from "@/data/projects";
import { SOCIAL } from "@/data/social";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { ContactForm } from "@/components/site/ContactForm";
import { HeroObject } from "@/components/site/HeroObject";
import { Skills } from "@/components/site/Skills";
import { Reach } from "@/components/site/Reach";
import { BeyondCode } from "@/components/site/BeyondCode";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import {
  CurtainText,
  CutFrame,
  FadeIn,
  Magnetic,
  Marquee,
  Parallax,
  Scramble,
  Tag,
  Tilt,
} from "@/components/site/primitives";

const EXPERIENCE = [
  {
    role: "Senior Software Engineer",
    company: "Ward Web Solutions",
    dates: "Feb 2026 – Present",
    place: "United Kingdom",
    body: "Leading a team of developers on end-to-end full-stack and AI-powered SaaS applications, including medical platforms serving real users across the UK and Europe. Mentoring engineers through task allocation, code reviews, and sprint planning, translating business requirements into scalable solutions in React, Next.js, TypeScript, Node.js, and Python. Shipping production features built on RAG pipelines, agentic AI, and microservices, cutting bugs by 25%. Built and optimised 30+ REST and GraphQL APIs with PostgreSQL and AWS deployments, improving response times by 18% at 99% uptime.",
  },
  {
    role: "Senior Software Engineer",
    company: "Wanile Technologies",
    dates: "Jul 2024 – Present",
    place: "Lahore",
    body: "Leading full-stack development across 8+ client projects, using React, Next.js, Node.js, Express, and Python to turn business requirements into shipped products 20% faster. Built 30+ REST APIs and data pipelines, cutting response times by 18%. Shipped 10+ production apps with secure authentication and resolved 50+ production issues, reducing recurring incidents by 25%.",
  },
  {
    role: "Senior Software Engineer",
    company: "Nazadv",
    dates: "Nov 2022 – Feb 2026",
    place: "US (California)",
    body: "Worked directly with 10+ clients and a small engineering team to ship 15+ full-stack features spanning UI, APIs, databases, and data pipelines. Developed 5+ RAG and agentic AI solutions, integrating LLMs into production systems, while cutting bugs by 25% across 20+ shipped features.",
  },
];

const OTHER = ["todo_supabase", "certificate-2", "breadit", "Promptopia"];

/** Scannable summary of facts stated at length elsewhere on the page. */
const ABOUT_FACTS = [
  { k: "FOCUS", v: "RAG architectures · agentic AI · LLM integration" },
  { k: "BASE", v: "Lahore, PK — working across the US, Middle East & Europe" },
  { k: "CURRENTLY", v: "Senior Software Engineer, Ward Web Solutions" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-paper">
      <UtilityBar />
      <main>
        <Hero />
        <Marquee
          text="WARD WEB SOLUTIONS + WANILE TECHNOLOGIES + NAZADV + REVITALIZE + WISDOMUP + CARDER.APP + GOLEGAL.WANILE.DEV + MUTERPE + ALFA + "
          speed={42}
          className="rule-t rule-b"
        />
        <About />
        <Skills />
        <Experience />
        <Reach />
        <FeaturedWork />
        <OtherProjects />
        <Education />
        <BeyondCode />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const tags = [
    { label: "4+ YRS", pos: "left-0 top-[12%]" },
    { label: "200+ USERS", pos: "right-0 top-[26%]" },
    { label: "8+ SHIPPED", pos: "left-[4%] bottom-[22%]" },
    { label: "$5K+ REVENUE", pos: "left-[4%] bottom-[6%] md:left-auto md:right-[2%] md:bottom-[10%]" },
  ];

  return (
    <section className="wrap relative grid gap-10 pb-16 pt-10 md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:pb-24 md:pt-16">
      <div className="flex flex-col justify-center">
        <Tag className="mb-6 block">[01] SENIOR SOFTWARE ENGINEER</Tag>
        <p className="label mb-4 text-ink">FAIZAN AMIR</p>
        <CurtainText
          as="h1"
          className="display text-[13vw] md:text-[clamp(3.5rem,7.4vw,7.5rem)]"
          lines={[
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
      </div>

      <div className="relative">
        <Parallax distance={70} rotate={2}>
          <Tilt className="relative cut-tr grain bg-paper-deep p-4">
            <HeroObject />
          </Tilt>
        </Parallax>
        {tags.map((t, i) => (
          <span
            key={t.label}
            className={`label absolute ${t.pos} animate-drift border border-ink/40 bg-paper/80 px-2 py-1 text-ink backdrop-blur-[2px]`}
            style={{ animationDelay: `${i * 0.8}s` }}
          >
            {t.label}
          </span>
        ))}

        <div className="mt-6 flex justify-end md:absolute md:-bottom-8 md:right-0 md:mt-0">
          <Magnetic>
            <a
              href="/resume.pdf"
              className="flex h-24 w-24 items-center justify-center rounded-full bg-cobalt text-center text-[10px] font-medium uppercase leading-tight tracking-[0.08em] text-paper transition-colors hover:bg-cobalt-deep"
            >
              Download
              <br />
              Resume ↗
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

/* ---------------- ABOUT ---------------- */
function About() {
  return (
    <section id="about" className="wrap grid gap-12 py-20 md:grid-cols-2 md:py-28">
      <div>
        <Tag className="mb-6 block">[02] ABOUT</Tag>
        <CurtainText
          className="display text-[11vw] md:text-[clamp(2.5rem,5vw,4.5rem)]"
          lines={[
            <Fragment key="1">
              It&apos;s about <span className="accent-word">shipping</span>
            </Fragment>,
            <Fragment key="2">©26</Fragment>,
          ]}
        />
        <FadeIn delay={0.2}>
          <p className="mt-8 max-w-xl text-base leading-7 text-ink-muted">
            I&apos;m a Senior Software Engineer with four years of experience building full-stack and
            AI-driven applications using React, Next.js, Python, and Node.js. My focus is RAG
            architectures, agentic AI, and LLM integrations — turning business requirements into
            production systems people actually use. I&apos;ve led development across 8+ projects, built
            30+ REST and GraphQL APIs, and shipped AI features used by hundreds of real users. I care
            about clean architecture, fast iteration, and solving the actual problem, not just the
            ticket.
          </p>
        </FadeIn>

        <dl className="mt-10 rule-t">
          {ABOUT_FACTS.map((f) => (
            <div key={f.k} className="rule-b py-4">
              <dt className="label">[{f.k}]</dt>
              <dd className="mt-2 text-sm leading-6">{f.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12">
          <p className="display text-[16vw] leading-[0.8] text-cobalt md:text-[9vw]">(40%)</p>
          <p className="label mt-3">* ADOPTION GROWTH — CARDER</p>
        </div>
      </div>

      {/* min-w-0: grid items default to min-width:auto, which would refuse to
          shrink below the canvas's intrinsic width and defeat its ResizeObserver. */}
      <div className="grid min-w-0 gap-10 self-center">
        <figure className="min-w-0">
          <div className="cut-tr grain relative bg-paper-deep p-3">
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
          </div>
          <figcaption className="label mt-3">* FAIZAN AMIR — LAHORE, PK</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------------- EXPERIENCE ---------------- */
function Experience() {
  return (
    <section id="experience" className="wrap py-20 md:py-28">
      <Tag className="mb-6 block">[04] EXPERIENCE</Tag>
      <CurtainText
        className="display mb-12 text-[11vw] md:text-[clamp(2.5rem,4.6vw,4rem)]"
        lines={[
          <Fragment key="1">
            Where I&apos;ve <span className="accent-word">shipped</span>
          </Fragment>,
        ]}
      />
      <ol>
        {EXPERIENCE.map((e) => (
          <li key={e.company} className="rule-t py-8 last:rule-b">
            <FadeIn>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="display text-xl md:text-3xl">
                  {e.role} — {e.company}
                </h3>
                <p className="label">
                  {e.dates} · {e.place}
                </p>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-ink-muted">{e.body}</p>
            </FadeIn>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------- FEATURED WORK ---------------- */
function FeaturedWork() {
  return (
    <section id="work" className="rule-t py-20 md:py-28">
      <div className="wrap mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Tag className="mb-6 block">[FEATURED WORK]</Tag>
          <CurtainText
            className="display text-[12vw] md:text-[clamp(3rem,6vw,5.5rem)]"
            lines={[
              <Fragment key="1">Selected</Fragment>,
              <Fragment key="2">
                <span className="accent-word">case studies</span>
              </Fragment>,
            ]}
          />
        </div>
        <p className="display text-3xl text-ink-muted">(06)</p>
      </div>

      <div>
        {projects.map((p, i) => (
          <article key={p.slug} className="rule-t last:rule-b">
            <Link href={`/work/${p.slug}`} id={`work-${p.slug}`} className="group block scroll-mt-24">
              <div
                className={`wrap grid items-center gap-8 py-12 md:grid-cols-2 md:py-16 ${
                  i % 2 === 1 ? "md:[direction:rtl]" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                  <Tilt max={6}>
                    <CutFrame
                      src={p.image}
                      alt={p.alt}
                      cut={i % 2 === 0 ? "cut-tr" : "cut-bl"}
                      grayscale
                    />
                  </Tilt>
                </div>

                <div className={`${i % 2 === 1 ? "md:[direction:ltr] md:pr-10" : "md:pl-10"}`}>
                  <Parallax distance={90}>
                    <p className="display text-[18vw] leading-[0.8] text-transparent [-webkit-text-stroke:1px_var(--ink)] transition-colors duration-300 group-hover:text-cobalt group-hover:[-webkit-text-stroke:1px_var(--cobalt)] md:text-[7vw]">
                      [{p.index}]
                    </p>
                  </Parallax>

                  <h3 className="display mt-4 text-3xl md:text-5xl">
                    {p.name} — <span className="accent-word">{p.tagline}</span>
                  </h3>
                  {p.inDevelopment && (
                    <span className="label mt-3 inline-block bg-cobalt px-2 py-1 text-paper">
                      [IN DEVELOPMENT]
                    </span>
                  )}
                  <p className="mt-4 max-w-lg text-sm leading-7 text-ink-muted">{p.summary}</p>

                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                    {p.indexMetrics.map((m) => (
                      <span key={m} className="label text-ink">
                        <span className="text-cobalt">*</span> {m}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.stack.map((t) => (
                      <span key={t} className="label border border-ink px-2 py-1 text-ink">
                        {t}
                      </span>
                    ))}
                  </div>

                  <span className="label relative mt-8 inline-block text-cobalt">
                    VIEW CASE STUDY →
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-cobalt transition-all duration-300 group-hover:w-full" />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- OTHER ---------------- */
function OtherProjects() {
  return (
    <section className="wrap py-16">
      <Tag className="mb-6 block">[INDEX] OTHER WORK</Tag>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
        {OTHER.map((name) => (
          <li key={name} className="rule-t">
            <a
              href={`https://github.com/search?q=${encodeURIComponent(name)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 py-4 pr-4 text-sm hover:text-cobalt"
            >
              <span>{name}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
      <div className="rule-t" />
    </section>
  );
}

function Education() {
  return (
    <section className="wrap py-10">
      <Tag className="mb-3 block">[EDUCATION]</Tag>
      <p className="text-sm">
        Bachelor of Computer Science — Pakistan Institute of Engineering and Applied Sciences,
        Islamabad
      </p>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */
function Contact() {
  return (
    <section id="contact" className="rule-t bg-paper-deep">
      <div className="wrap grid gap-12 py-20 md:grid-cols-2 md:py-28">
        <div>
          <Tag className="mb-6 block">[07] CONTACT</Tag>
          <CurtainText
            className="display text-[12vw] md:text-[clamp(2.5rem,5vw,4.5rem)]"
            lines={[
              <Fragment key="1">Let&apos;s build</Fragment>,
              <Fragment key="2">
                something <span className="accent-word">real</span>.
              </Fragment>,
            ]}
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
                  rel="noreferrer"
                  className="text-cobalt hover:underline"
                >
                  0303 0649009
                </a>
              </dd>
            </div>
            <div>
              <dt className="label">[SOCIAL]</dt>
              <dd className="flex gap-4 text-sm">
                <a href={SOCIAL.linkedin} target="_blank" rel="noreferrer" className="hover:text-cobalt">
                  LinkedIn ↗
                </a>
                <a href={SOCIAL.github} target="_blank" rel="noreferrer" className="hover:text-cobalt">
                  GitHub ↗
                </a>
              </dd>
            </div>
          </dl>
          <p className="mt-10 label">
            <Scramble value="06" /> PROJECTS · <Scramble value="200" />+ USERS
          </p>
        </div>

        <div className="self-center">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
