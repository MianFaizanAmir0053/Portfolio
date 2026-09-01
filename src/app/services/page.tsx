import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { Tag } from "@/components/site/primitives";
import { JsonLd } from "@/components/site/JsonLd";
import { PERSON } from "@/lib/site";
import { breadcrumbSchema, graph, itemListSchema, webPageSchema } from "@/lib/schema";

const TITLE = "Services — full-stack, AI and backend engineering";
const DESCRIPTION =
  "Five ways to work with a senior software engineer: AI and RAG systems, Next.js front ends, APIs and backends, SaaS MVPs, and e-commerce payments engineering.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    title: `${TITLE} · Faizan Amir`,
    description: DESCRIPTION,
    type: "website",
    url: "/services",
  },
  twitter: { card: "summary_large_image", title: `${TITLE} · Faizan Amir`, description: DESCRIPTION },
};

/**
 * The hub the service pages hang off. Every spoke links back here and to two
 * siblings, so no service page is an island the crawler reaches once and never
 * leaves.
 */
export default function ServicesIndex() {
  const crumbs = breadcrumbSchema("/services", [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]);

  return (
    <div className="min-h-screen bg-paper">
      <JsonLd
        data={graph(
          webPageSchema({
            path: "/services",
            name: TITLE,
            description: DESCRIPTION,
            type: "CollectionPage",
            breadcrumb: crumbs,
          }),
          crumbs,
          itemListSchema(
            "/services",
            services.map((s) => ({
              name: s.name,
              path: `/services/${s.slug}`,
              description: s.description,
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
              SERVICES
            </li>
          </ol>
        </div>
      </nav>

      <main id="main">
        <section className="wrap py-16 md:py-24">
          <Tag className="mb-6 block">[SERVICES]</Tag>
          <h1 className="display text-[13vw] leading-[0.9] md:text-[clamp(3.5rem,7vw,7rem)]">
            Five ways to <span className="accent-word">put me</span> on it.
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-7 text-ink-muted">
            {PERSON.name} is a senior software engineer with {PERSON.yearsExperience} years building
            production systems for teams in the US, UK, Middle East and Europe. Each service below
            is one of those systems described as work rather than a skill list, and each one links
            to the case study that already made its claims in public.
          </p>
        </section>

        <section className="wrap rule-t">
          <ul>
            {services.map((service, i) => (
              <li key={service.slug} className="rule-b">
                <Link
                  href={`/services/${service.slug}`}
                  className="group grid gap-4 py-10 md:grid-cols-[auto_1.6fr_1fr] md:gap-10"
                >
                  <span className="outline-num text-[12vw] leading-none md:text-[4vw]">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <div>
                    <h2 className="display text-2xl md:text-4xl">{service.name}</h2>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-ink-muted">
                      {service.description}
                    </p>
                    <span className="label mt-4 inline-block text-cobalt group-hover:underline">
                      {service.name.toUpperCase()} DETAIL →
                    </span>
                  </div>
                  <div className="flex flex-wrap content-start gap-2">
                    {service.stack.slice(0, 6).map((tech) => (
                      <span key={tech} className="label border border-ink px-2 py-1 text-ink">
                        {tech}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rule-t bg-paper-deep">
          <div className="wrap flex flex-wrap items-center justify-between gap-6 py-14">
            <p className="display text-2xl md:text-4xl">
              Not sure which one <span className="accent-word">fits</span>?
            </p>
            <Link
              href="/contact"
              className="bg-cobalt px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-cobalt-deep"
            >
              Describe the problem →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
