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
        <section className="wrap grid gap-12 py-16 md:grid-cols-2 md:py-24">
          <div>
            <Tag className="mb-6 block">[CONTACT]</Tag>
            <h1 className="display text-[13vw] leading-[0.9] md:text-[clamp(3rem,6vw,5.5rem)]">
              Let&rsquo;s build <span className="accent-word">something real</span>.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-ink-muted">
              Available for scoped builds and embedded contract work in React, Next.js, Node.js,
              Python and applied AI. Based in {PERSON.locality} (UTC+5), working with teams in the
              US, UK, Middle East and Europe. Replies usually arrive within one working day.
            </p>

            {/* Grouped by who is writing, each group leading with what that
                reader needs: a brief channel for clients, the résumé for
                hiring managers. */}
            <dl className="mt-10 space-y-8">
              <div>
                <dt className="label">[PROJECTS]</dt>
                <dd className="mt-2 space-y-2">
                  <p className="text-sm leading-6 text-ink-muted">
                    Send a short brief with the form, or message directly:
                  </p>
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
                  <span className="flex gap-4 text-sm">
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
                <dd className="text-sm">
                  {PERSON.locality}, {PERSON.countryName} — remote, UTC+5
                </dd>
              </div>
            </dl>
          </div>

          <div className="self-center">
            <ContactForm />
          </div>
        </section>

        <section className="wrap rule-t py-16 md:py-24">
          <Tag className="mb-3 block">[FAQ]</Tag>
          <h2 className="display mb-8 text-2xl md:text-4xl">Before you write</h2>
          <Accordion type="multiple" className="max-w-3xl rule-t">
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.q} value={`contact-faq-${index}`}>
                <AccordionTrigger className="rounded-none py-5 hover:no-underline">
                  <span className="display pr-4 text-left text-xl md:text-2xl">{faq.q}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="max-w-[64ch] text-sm leading-7 text-ink-muted">{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="wrap rule-t py-12">
          <h2 className="display mb-4 text-xl md:text-2xl">What I do</h2>
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
