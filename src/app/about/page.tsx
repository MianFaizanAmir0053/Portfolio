import type { Metadata } from "next";
import Link from "next/link";
import { EXPERIENCE, EDUCATION, BIO, BEYOND_CODE } from "@/data/experience";
import { SKILLS } from "@/data/skills";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { SOCIAL } from "@/data/social";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { Tag } from "@/components/site/primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/site/JsonLd";
import { PERSON, CONTENT_REVIEWED, OG_IMAGE } from "@/lib/site";
import { breadcrumbSchema, faqSchema, graph, webPageSchema } from "@/lib/schema";
import { BUTTON, SPACE, TYPE } from "@/lib/typography";
import { cn } from "@/lib/utils";

const TITLE = "About — senior software engineer in Lahore";
const DESCRIPTION =
  "Faizan Amir is a senior full-stack and AI engineer in Lahore, shipping Next.js, Node.js, Python, RAG and agentic systems for global teams.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${TITLE} · Faizan Amir`,
    description: DESCRIPTION,
    type: "profile",
    url: "/about",
    images: [OG_IMAGE],
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
    a: "Faizan Amir is a senior full-stack and AI engineer in Lahore, Pakistan. He builds production applications with React, Next.js, TypeScript, Node.js and Python for teams across the United States, United Kingdom, Middle East and Europe.",
  },
  {
    q: "What does Faizan Amir specialise in?",
    a: "Applied AI and product engineering: production RAG, agent workflows and LLM integrations, plus Next.js applications, APIs, data models and payment systems. Five or more RAG and agentic systems have reached production.",
  },
  {
    q: "Is he available for freelance or contract work?",
    a: "Yes. He takes scoped builds with defined outcomes and embedded contract roles with existing teams. A short description of the problem, users, current system and deadline is enough to start.",
  },
  {
    q: "What time zone does he work in, and does that matter?",
    a: "He works from Lahore at UTC+5, with live overlap for European and US mornings and asynchronous handover outside those hours. His current and previous roles have used this model across four regions.",
  },
  {
    q: "What is outside his focus?",
    a: "He is not a designer or an ML researcher. His AI work focuses on retrieval, agent orchestration, evaluation and product integration, using proven hosted models when training from scratch would add cost without product value.",
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
        <section className={cn("wrap", SPACE.pageHead)}>
          <Tag className={cn(SPACE.tag, "block")}>[ABOUT]</Tag>
          <h1 className={TYPE.hero}>
            {PERSON.name}, <span className="accent-word">in full</span>.
          </h1>
          {/*
           * The definition block. First paragraph, no preamble, self-contained:
           * who, what, where, with what. Everything after this expands on it.
           */}
          <p className={cn(TYPE.intro, SPACE.intro, "max-w-2xl")}>{FAQS[0].a}</p>
          <div className={cn(SPACE.intro, "flex flex-wrap gap-3")}>
            <Link href="/contact" className={BUTTON.primary}>
              Get in touch →
            </Link>
            <a href="/resume.pdf" className={BUTTON.secondary}>
              Download résumé (PDF)
            </a>
          </div>
        </section>

        <section className={cn("wrap rule-t", SPACE.section)}>
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Tag className={cn(SPACE.tag, "block")}>[01] IN HIS OWN WORDS</Tag>
              <h2 className={TYPE.section}>
                It&rsquo;s about <span className="accent-word">shipping</span>
              </h2>
            </div>
            {/* The same words the homepage stops for in its About section, set
                the way it sets them: the statement, not body copy. */}
            <div className="space-y-5">
              {BIO.map((paragraph) => (
                <p key={paragraph} className={TYPE.statement}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Experience, as a plain readable list rather than a horizontal scroll.
            Same three roles the homepage animates, titled the way its cards are. */}
        <section className={cn("wrap rule-t", SPACE.section)}>
          <Tag className={cn(SPACE.tag, "block")}>[02] EXPERIENCE</Tag>
          <h2 className={TYPE.section}>Where I have shipped</h2>
          <ol className={cn("space-y-12", SPACE.content)}>
            {EXPERIENCE.map((role) => (
              <li key={role.company} className="grid gap-4 md:grid-cols-[0.6fr_1.4fr] md:gap-10">
                <div>
                  <p className="label text-cobalt">{role.dates}</p>
                  <p className="label mt-1 text-ink-muted">{role.place}</p>
                </div>
                <div>
                  <h3 className={TYPE.title}>{role.role}</h3>
                  <p className={TYPE.subtitle}>{role.company}</p>
                  <p className={cn(TYPE.body, "mt-3 max-w-[64ch]")}>{role.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rule-t bg-paper-deep">
          <div className={cn("wrap grid gap-10 md:grid-cols-2", SPACE.section)}>
            <div>
              <Tag className={cn(SPACE.tag, "block")}>[03] THE STACK</Tag>
              <h2 className={TYPE.section}>The stack, grouped</h2>
              {/* Keys grey, as in the facts beside it and every key-value list
                  on the homepage. */}
              <dl className={cn("space-y-6", SPACE.content)}>
                {SKILLS.map((group) => (
                  <div key={group.label}>
                    <dt className="label">{group.label}</dt>
                    <dd className={cn(TYPE.body, "mt-2")}>{group.items.join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <Tag className={cn(SPACE.tag, "block")}>[04] FACTS</Tag>
              <h2 className={TYPE.section}>Facts, in one place</h2>
              <dl className={cn("rule-t", SPACE.content)}>
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

        <section className={cn("wrap rule-t grid gap-10 md:grid-cols-[0.7fr_1.3fr]", SPACE.section)}>
          {/* Travels with the answers, as on the home page's FAQ, instead of
              sitting above a column the reader has already scrolled past. */}
          <div className="md:sticky md:top-24 md:self-start">
            <Tag className={cn(SPACE.tag, "block")}>[05] FAQ</Tag>
            <h2 className={TYPE.section}>Questions people ask first</h2>
          </div>
          <Accordion type="multiple" className="rule-t">
            {/* The first answer is already set as this page's lead paragraph
                above. The FAQPage graph still carries the whole array — a
                definition belongs in the structured data either way — but
                printing it twice on one screen made the list look padded. */}
            {FAQS.slice(1).map((faq, index) => (
              <AccordionItem key={faq.q} value={`about-faq-${index}`}>
                <AccordionTrigger className="rounded-none py-5 hover:no-underline">
                  <span className={cn(TYPE.item, "pr-4 text-left")}>{faq.q}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className={cn(TYPE.prose, "max-w-[64ch]")}>{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className={cn("wrap rule-t", SPACE.section)} aria-labelledby="beyond-code-heading">
          <Tag className={cn(SPACE.tag, "block")}>[06] BEYOND CODE</Tag>
          <h2 id="beyond-code-heading" className={TYPE.section}>
            Off the clock
          </h2>
          <ul className={cn("grid gap-8 md:grid-cols-3", SPACE.content)}>
            {BEYOND_CODE.map((activity) => (
              <li key={activity.title} className="rule-t pt-5">
                <h3 className={TYPE.item}>{activity.title}</h3>
                <p className={cn(TYPE.compact, "mt-3")}>{activity.detail}</p>
              </li>
            ))}
          </ul>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="me noopener"
            className="label mt-8 inline-block text-cobalt hover:underline"
          >
            Training and hiking clips on Instagram ↗
          </a>
        </section>

        {/* The homepage's [WHAT I DO] row, set the same way. */}
        <section className="wrap rule-t py-12">
          <h2 className="label mb-4">[ELSEWHERE]</h2>
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
