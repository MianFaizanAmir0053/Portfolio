import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import { PERSON, OG_IMAGE } from "@/lib/site";
import { breadcrumbSchema, graph, itemListSchema, webPageSchema } from "@/lib/schema";
import { BUTTON, SPACE, TYPE } from "@/lib/typography";
import { cn } from "@/lib/utils";

const TITLE = "Services — full-stack, AI and backend engineering";
const DESCRIPTION =
  "Five ways to work with a senior software engineer: AI and RAG systems, Next.js front ends, APIs and backends, SaaS MVPs, e-commerce payments.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    title: `${TITLE} · Faizan Amir`,
    description: DESCRIPTION,
    type: "website",
    url: "/services",
    images: [OG_IMAGE],
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
        <section className={cn("wrap", SPACE.pageHead)}>
          <h1 className={TYPE.hero}>
            <span className="label mb-6 block">Full-stack and AI engineering services</span>{" "}
            Five ways to <span className="accent-word">work together</span>.
          </h1>
          <p className={cn(TYPE.intro, SPACE.intro, "max-w-2xl")}>
            {PERSON.name} is a senior full-stack and AI engineer building production systems for
            teams in the US, UK, Middle East and Europe. Each service below is backed by at least
            one detailed case study.
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
                  {/* The homepage's outlined index, as on its experience cards. */}
                  <span className={TYPE.index}>[{String(i + 1).padStart(2, "0")}]</span>
                  <div>
                    <h2 className={TYPE.title}>{service.name}</h2>
                    <p className={cn(TYPE.body, "mt-3 max-w-xl")}>{service.description}</p>
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
          <div className={cn("wrap flex flex-wrap items-end justify-between gap-8", SPACE.section)}>
            <p className={TYPE.section}>
              Not sure which one <span className="accent-word">fits</span>?
            </p>
            <Link href="/contact" className={BUTTON.primary}>
              Describe the problem →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
