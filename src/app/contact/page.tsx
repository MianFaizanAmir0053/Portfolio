import type { Metadata } from "next";
import Link from "next/link";
import { SOCIAL } from "@/data/social";
import { services } from "@/data/services";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { ContactForm } from "@/components/site/ContactForm";
import { Tag } from "@/components/site/primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/site/JsonLd";
import { PERSON, OG_IMAGE } from "@/lib/site";
import { breadcrumbSchema, faqSchema, graph, webPageSchema } from "@/lib/schema";
import { SPACE, TYPE } from "@/lib/typography";
import { cn } from "@/lib/utils";

const TITLE = "Contact — hire a senior full-stack and AI engineer";
const DESCRIPTION =
  "Email, WhatsApp or the form. Scoped builds and embedded contract work in React, Next.js, Node.js, Python and applied AI — across US, UK and EU hours.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `${TITLE} · Faizan Amir`,
    description: DESCRIPTION,
    type: "website",
    url: "/contact",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: `${TITLE} · Faizan Amir`, description: DESCRIPTION },
};

const FAQS = [
  {
    q: "What is the fastest way to get a reply?",
    a: "Email or WhatsApp is fastest, and replies usually arrive within one working day. The form reaches the same inbox if you prefer to send a structured brief.",
  },
  {
    q: "What information helps in a first message?",
    a: "Share what the system must do, who uses it, what already exists and what drives the deadline. A rough problem description is more useful than a polished specification.",
  },
  {
    q: "What kinds of engagement are available?",
    a: "Scoped builds, embedded contract work and focused technical audits. Audits can cover architecture, dependencies, vulnerabilities, routing or authentication in an existing codebase.",
  },
];

export default function Contact() {
  const crumbs = breadcrumbSchema("/contact", [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <div className="min-h-screen bg-paper">
      <JsonLd
        data={graph(
          webPageSchema({
            path: "/contact",
            name: TITLE,
            description: DESCRIPTION,
            type: "ContactPage",
            breadcrumb: crumbs,
          }),
          crumbs,
          faqSchema("/contact", FAQS),
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
              CONTACT
            </li>
          </ol>
        </div>
      </nav>

      <main id="main">
        <section className={cn("wrap grid gap-12 md:grid-cols-2", SPACE.pageHead)}>
          <div>
            <Tag className={cn(SPACE.tag, "block")}>[CONTACT]</Tag>
            <h1 className={TYPE.hero}>
              Let&rsquo;s build <span className="accent-word">something real</span>.
            </h1>
            <p className={cn(TYPE.intro, SPACE.intro, "max-w-xl")}>
              Available for scoped builds and embedded contract work in React, Next.js, Node.js,
              Python and applied AI. Based in {PERSON.locality} (UTC+5), working with teams in the
              US, UK, Middle East and Europe. Replies usually arrive within one working day.
            </p>

            {/* Grouped by who is writing, each group leading with what that
                reader needs: a brief channel for clients, the résumé for
                hiring managers. */}
            {/* Every way to reach him at one size, as on the homepage's contact
                block: links and plain values alike. */}
            <dl className={cn(SPACE.content, "space-y-8")}>
              <div>
                <dt className="label">[PROJECTS]</dt>
                <dd className="mt-2 space-y-2">
                  <p className={TYPE.compact}>Send a short brief with the form, or message directly:</p>
                  <a href={`mailto:${PERSON.email}`} className="block text-cobalt hover:underline">
                    {PERSON.email}
                  </a>
                  <a
                    href={PERSON.whatsapp}
                    target="_blank"
                    rel="noopener"
                    className="block text-cobalt hover:underline"
                  >
                    WhatsApp {PERSON.telephoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label">[HIRING]</dt>
                <dd className="mt-2 space-y-2">
                  <a href="/resume.pdf" className="block text-cobalt hover:underline">
                    Download resume (PDF) ↓
                  </a>
                  <span className="flex gap-4 text-base">
                    <a href={SOCIAL.linkedin} target="_blank" rel="me noopener" className="hover:text-cobalt">
                      LinkedIn ↗
                    </a>
                    <a href={SOCIAL.github} target="_blank" rel="me noopener" className="hover:text-cobalt">
                      GitHub ↗
                    </a>
                  </span>
                </dd>
              </div>
              <div>
                <dt className="label">[BASED IN]</dt>
                <dd className="mt-2 text-base">
                  {PERSON.locality}, {PERSON.countryName} — remote, UTC+5
                </dd>
              </div>
            </dl>
          </div>

          <div className="self-center">
            <ContactForm />
          </div>
        </section>

        <section className={cn("wrap rule-t", SPACE.section)}>
          <Tag className={cn(SPACE.tag, "block")}>[FAQ]</Tag>
          <h2 className={TYPE.section}>Before you write</h2>
          <Accordion type="multiple" className={cn("max-w-3xl rule-t", SPACE.content)}>
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.q} value={`contact-faq-${index}`}>
                <AccordionTrigger className="rounded-none py-5 hover:no-underline">
                  <span className={cn(TYPE.item, "pr-4 text-left")}>{faq.q}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className={cn(TYPE.body, "max-w-[64ch]")}>{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* The homepage's [WHAT I DO] row, set the same way. */}
        <section className="wrap rule-t py-12">
          <h2 className="label mb-4">[WHAT I DO]</h2>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {services.map((service) => (
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
