import type { Metadata } from "next";
import Link from "next/link";
import { EXPERIENCE, EDUCATION, BIO } from "@/data/experience";
import { SKILLS } from "@/data/skills";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { SOCIAL } from "@/data/social";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { Tag } from "@/components/site/primitives";
import { JsonLd } from "@/components/site/JsonLd";
import { PERSON, CONTENT_REVIEWED } from "@/lib/site";
import { breadcrumbSchema, faqSchema, graph, webPageSchema } from "@/lib/schema";

const TITLE = "About Faizan Amir — senior software engineer in Lahore";
const DESCRIPTION =
  "Four years, three teams, three continents: how Faizan Amir works, the stack he works in, where he has shipped, and what he is honest about not knowing yet.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${TITLE} · Faizan Amir`,
    description: DESCRIPTION,
    type: "profile",
    url: "/about",
  },
  twitter: { card: "summary_large_image", title: `${TITLE} · Faizan Amir`, description: DESCRIPTION },
};

/**
 * Questions a client or a hiring manager actually asks before the first call,
 * phrased the way they ask them. Mirrored into FAQPage structured data, which
 * is the form answer engines lift most reliably.
 */
const FAQS = [
  {
    q: "Who is Faizan Amir?",
    a: "Faizan Amir is a senior software engineer based in Lahore, Pakistan, with four years of experience building full-stack and AI-driven applications in React, Next.js, TypeScript, Node.js and Python. He currently leads engineering at Ward Web Solutions and has shipped products for teams in the United States, United Kingdom, Middle East and Europe.",
  },
  {
    q: "What does Faizan Amir specialise in?",
    a: "Retrieval-augmented generation, agentic AI and LLM integration on the AI side, and full product engineering on the rest: Next.js front ends with real state, REST and GraphQL APIs, PostgreSQL and MongoDB data models, and payment systems that reconcile. Five or more RAG and agentic systems have gone to production.",
  },
  {
    q: "Is he available for freelance or contract work?",
    a: "Yes. Engagements run from a scoped build with a fixed outcome to ongoing work embedded with an existing team. The fastest way to start is a description of the problem rather than a spec — the first deliverable is usually a written model of the states the system needs.",
  },
  {
    q: "What time zone does he work in, and does that matter?",
    a: "Based in Lahore, Pakistan (UTC+5), working day to day with teams in the US, UK, Middle East and Europe. In practice that means a live overlap with European mornings and US mornings, and asynchronous handover the rest of the time — the three current and previous roles all run this way.",
  },
  {
    q: "What is he not?",
    a: "Not a designer, and not a machine-learning researcher. The AI work is applied engineering — retrieval, agent orchestration, evaluation and integration — rather than model training from scratch. Where a project has needed a research-grade model, the right answer has been to use a hosted one and spend the effort on the pipeline around it.",
  },
];

export default function About() {
  const crumbs = breadcrumbSchema("/about", [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <div className="min-h-screen bg-paper">
      <JsonLd
        data={graph(
          webPageSchema({
            path: "/about",
            name: TITLE,
            description: DESCRIPTION,
            type: "AboutPage",
            breadcrumb: crumbs,
          }),
          crumbs,
          faqSchema("/about", FAQS),
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
              ABOUT
            </li>
          </ol>
        </div>
      </nav>

      <main id="main">
        <section className="wrap py-16 md:py-24">
          <Tag className="mb-6 block">[ABOUT]</Tag>
          <h1 className="display text-[13vw] leading-[0.9] md:text-[clamp(3.5rem,7vw,7rem)]">
            {PERSON.name}, <span className="accent-word">in full</span>.
          </h1>
          {/*
           * The definition block. First paragraph, no preamble, self-contained:
           * who, what, where, with what. Everything after this expands on it.
           */}
          <p className="mt-8 max-w-2xl text-base leading-7 text-ink-muted">{FAQS[0].a}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="bg-cobalt px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-cobalt-deep"
            >
              Get in touch →
            </Link>
            <a
              href="/resume.pdf"
              className="border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Download résumé (PDF)
            </a>
          </div>
        </section>

        <section className="wrap rule-t py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Tag className="mb-4 block">[01] IN HIS OWN WORDS</Tag>
              <h2 className="display text-2xl md:text-4xl">
                It&rsquo;s about <span className="accent-word">shipping</span>
              </h2>
            </div>
            <div className="space-y-5">
              {BIO.map((paragraph) => (
                <p key={paragraph} className="text-base leading-7 text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Experience, as a plain readable list rather than a horizontal scroll.
            Same three roles the homepage animates. */}
        <section className="wrap rule-t py-16 md:py-24">
          <Tag className="mb-3 block">[02] EXPERIENCE</Tag>
          <h2 className="display mb-8 text-2xl md:text-4xl">Where I have shipped</h2>
          <ol className="space-y-12">
            {EXPERIENCE.map((role) => (
              <li key={role.company} className="grid gap-4 md:grid-cols-[0.6fr_1.4fr] md:gap-10">
                <div>
                  <p className="label text-cobalt">{role.dates}</p>
                  <p className="label mt-1 text-ink-muted">{role.place}</p>
                </div>
                <div>
                  <h3 className="display text-xl md:text-3xl">{role.role}</h3>
                  <p className="accent-word text-lg md:text-2xl">{role.company}</p>
                  <p className="mt-3 max-w-[64ch] text-sm leading-7 text-ink-muted">{role.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rule-t bg-paper-deep">
          <div className="wrap grid gap-10 py-16 md:grid-cols-2 md:py-24">
            <div>
              <Tag className="mb-3 block">[03] THE STACK</Tag>
              <h2 className="display mb-6 text-2xl md:text-3xl">The stack, grouped</h2>
              <dl className="space-y-6">
                {SKILLS.map((group) => (
                  <div key={group.label}>
                    <dt className="label text-cobalt">{group.label}</dt>
                    <dd className="mt-2 text-sm leading-7 text-ink-muted">
                      {group.items.join(" · ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <Tag className="mb-3 block">[04] FACTS</Tag>
              <h2 className="display mb-6 text-2xl md:text-3xl">Facts, in one place</h2>
              <dl className="rule-t">
                {[
                  { k: "BASED IN", v: `${PERSON.locality}, ${PERSON.countryName} (UTC+5)` },
                  { k: "MARKETS", v: PERSON.markets.join(" · ") },
                  { k: "EXPERIENCE", v: `${PERSON.yearsExperience}+ years in production` },
                  { k: "CASE STUDIES", v: `${projects.length} written up in full` },
                  { k: "APIS SHIPPED", v: "30+ REST and GraphQL" },
                  { k: "CURRENTLY", v: `${PERSON.jobTitle}, ${PERSON.worksFor}` },
                  { k: "EDUCATION", v: `${EDUCATION.degree}, ${EDUCATION.institution}` },
                ].map((fact) => (
                  <div key={fact.k} className="flex flex-wrap gap-x-6 gap-y-1 rule-b py-3">
                    <dt className="label min-w-32">{fact.k}</dt>
                    <dd className="flex-1 text-sm">{fact.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="label mt-6 text-ink-muted">
                * PROFILE LAST REVIEWED{" "}
                <time dateTime={CONTENT_REVIEWED}>{CONTENT_REVIEWED}</time>
              </p>
            </div>
          </div>
        </section>

        <section className="wrap rule-t py-16 md:py-24">
          <Tag className="mb-3 block">[05] FAQ</Tag>
          <h2 className="display mb-8 text-2xl md:text-4xl">Questions people ask first</h2>
          <dl className="max-w-3xl space-y-8">
            {/* The first answer is already set as this page's lead paragraph
                above. The FAQPage graph still carries the whole array — a
                definition belongs in the structured data either way — but
                printing it twice on one screen made the list look padded. */}
            {FAQS.slice(1).map((faq) => (
              <div key={faq.q}>
                <dt className="display text-xl md:text-2xl">{faq.q}</dt>
                <dd className="mt-3 max-w-[64ch] text-sm leading-7 text-ink-muted">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="wrap rule-t py-12">
          <h2 className="display mb-4 text-xl md:text-2xl">Elsewhere</h2>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <li>
              <a href={SOCIAL.github} target="_blank" rel="me noopener" className="text-cobalt hover:underline">
                GitHub ↗
              </a>
            </li>
            <li>
              <a href={SOCIAL.linkedin} target="_blank" rel="me noopener" className="text-cobalt hover:underline">
                LinkedIn ↗
              </a>
            </li>
            <li>
              <Link href="/work" className="text-cobalt hover:underline">
                Case studies →
              </Link>
            </li>
            {services.slice(0, 2).map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className="text-cobalt hover:underline">
                  {service.name} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
