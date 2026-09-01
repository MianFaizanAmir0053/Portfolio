import type { Metadata } from "next";
import Link from "next/link";
import { SOCIAL } from "@/data/social";
import { services } from "@/data/services";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { ContactForm } from "@/components/site/ContactForm";
import { Tag } from "@/components/site/primitives";
import { JsonLd } from "@/components/site/JsonLd";
import { PERSON } from "@/lib/site";
import { breadcrumbSchema, faqSchema, graph, webPageSchema } from "@/lib/schema";

const TITLE = "Contact — hire a senior full-stack and AI engineer";
const DESCRIPTION =
  "Email, WhatsApp or the form. Faizan Amir takes scoped builds and embedded contract work in React, Next.js, Node.js, Python and applied AI, from Lahore across US, UK and EU hours.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `${TITLE} · Faizan Amir`,
    description: DESCRIPTION,
    type: "website",
    url: "/contact",
  },
  twitter: { card: "summary_large_image", title: `${TITLE} · Faizan Amir`, description: DESCRIPTION },
};

const FAQS = [
  {
    q: "What is the fastest way to get a reply?",
    a: "Email to faizanamir0053@gmail.com or a WhatsApp message. Replies usually land within one working day. The form on this page goes to the same inbox and adds a captcha step, so email is marginally faster if you already have a description ready.",
  },
  {
    q: "What information helps in a first message?",
    a: "What the system has to do, who uses it, what already exists, and what the deadline is driven by. A rough description beats a polished spec — the first deliverable is usually a written model of the states the system needs, and that is easier to write from the real problem.",
  },
  {
    q: "What kinds of engagement are available?",
    a: "Scoped builds with a defined outcome, embedded contract work alongside an existing team, and shorter technical audits — dependency and vulnerability passes, architecture reviews, or a routing and auth map for a codebase that has grown past its structure.",
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
              {PERSON.name} is available for scoped builds and embedded contract work in React,
              Next.js, Node.js, Python and applied AI. Based in {PERSON.locality} (UTC+5), working
              day to day with teams in {PERSON.markets.join(", ")}. Replies usually land within one
              working day.
            </p>

            <dl className="mt-10 space-y-5">
              <div>
                <dt className="label">[EMAIL]</dt>
                <dd>
                  <a href={`mailto:${PERSON.email}`} className="text-cobalt hover:underline">
                    {PERSON.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label">[WHATSAPP]</dt>
                <dd>
                  <a
                    href={PERSON.whatsapp}
                    target="_blank"
                    rel="noopener"
                    className="text-cobalt hover:underline"
                  >
                    {PERSON.telephoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label">[BASED IN]</dt>
                <dd className="text-sm">
                  {PERSON.locality}, {PERSON.countryName} — remote, UTC+5
                </dd>
              </div>
              <div>
                <dt className="label">[SOCIAL]</dt>
                <dd className="flex gap-4 text-sm">
                  <a href={SOCIAL.linkedin} target="_blank" rel="me noopener" className="hover:text-cobalt">
                    LinkedIn ↗
                  </a>
                  <a href={SOCIAL.github} target="_blank" rel="me noopener" className="hover:text-cobalt">
                    GitHub ↗
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="self-center">
            <ContactForm />
          </div>
        </section>

        <section className="wrap rule-t py-16 md:py-24">
          <Tag className="mb-3 block">[BEFORE YOU WRITE]</Tag>
          <h2 className="display mb-8 text-2xl md:text-4xl">Before you write</h2>
          <dl className="max-w-3xl space-y-8">
            {FAQS.map((faq) => (
              <div key={faq.q}>
                <dt className="display text-xl md:text-2xl">{faq.q}</dt>
                <dd className="mt-3 text-sm leading-7 text-ink-muted">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="wrap rule-t py-12">
          <Tag className="mb-3 block">[WHAT I DO]</Tag>
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
