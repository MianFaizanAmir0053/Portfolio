import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, getService } from "@/data/services";
import { getProject } from "@/data/projects";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Footer } from "@/components/site/Footer";
import { Tag } from "@/components/site/primitives";
import { JsonLd } from "@/components/site/JsonLd";
import { PERSON } from "@/lib/site";
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service not found", robots: { index: false, follow: true } };

  const path = `/services/${service.slug}`;
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: path },
    keywords: [...service.stack, service.serviceType, service.name],
    openGraph: {
      title: `${service.title} · Faizan Amir`,
      description: service.description,
      type: "website",
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} · Faizan Amir`,
      description: service.description,
    },
  };
}

/**
 * One service, one page.
 *
 * The template is shared; the content is not. Every section on this page is
 * written per service and every proof block points at a case study that
 * already carries the number being claimed — which is the line between a set
 * of service pages and a set of doorway pages.
 */
export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const path = `/services/${service.slug}`;
  const crumbs = breadcrumbSchema(path, [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path },
  ]);
  const related = service.related.map(getService).filter(Boolean);

  return (
    <div className="min-h-screen bg-paper">
      <JsonLd
        data={graph(
          webPageSchema({
            path,
            name: service.title,
            description: service.description,
            breadcrumb: crumbs,
          }),
          crumbs,
          serviceSchema({
            path,
            name: service.name,
            description: service.description,
            serviceType: service.serviceType,
          }),
          faqSchema(path, service.faqs),
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
            <li>
              <Link href="/services" className="hover:text-cobalt">
                SERVICES
              </Link>
            </li>
            <li aria-hidden className="text-ink-muted">
              /
            </li>
            <li className="text-cobalt" aria-current="page">
              {service.name.toUpperCase()}
            </li>
          </ol>
        </div>
      </nav>

      <main id="main">
        {/* Headline + the extractable answer block. */}
        <section className="wrap py-16 md:py-24">
          <Tag className="mb-6 block">[{service.serviceType.toUpperCase()}]</Tag>
          <h1 className="display text-[12vw] leading-[0.9] md:text-[clamp(3rem,6.4vw,6.5rem)]">
            {service.headline[0]}
            <br />
            {service.headline[1].split(service.accent)[0]}
            <span className="accent-word">{service.accent}</span>
            {service.headline[1].split(service.accent)[1]}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-7 text-ink-muted">{service.answer}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="bg-cobalt px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-cobalt-deep"
            >
              Start a project →
            </Link>
            <Link
              href="/work"
              className="border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              See the case studies
            </Link>
          </div>
        </section>

        {/* What the engagement includes. */}
        <section className="wrap rule-t py-16 md:py-24">
          <Tag className="mb-3 block">[01] WHAT THIS INCLUDES</Tag>
          <h2 className="display mb-8 text-2xl md:text-4xl">What this includes</h2>
          <ul className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {service.includes.map((item) => (
              <li key={item.title}>
                <h3 className="display text-xl md:text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Process, ordered — a list an answer engine can lift as steps. */}
        <section className="wrap rule-t py-16 md:py-24">
          <Tag className="mb-3 block">[02] HOW THE WORK RUNS</Tag>
          <h2 className="display mb-8 text-2xl md:text-4xl">How the work runs</h2>
          <ol className="space-y-8">
            {service.process.map((step, i) => (
              <li key={step.step} className="grid gap-3 md:grid-cols-[auto_1fr] md:gap-8">
                <span className="label pt-1 text-cobalt">*[{String(i + 1).padStart(2, "0")}]</span>
                <div>
                  <h3 className="display text-xl md:text-2xl">{step.step}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Proof, each item linking to the case study that carries it. */}
        <section className="rule-t bg-paper-deep">
          <div className="wrap py-16 md:py-24">
            <Tag className="mb-3 block">[03] WHERE THIS HAS SHIPPED</Tag>
            <h2 className="display mb-8 text-2xl md:text-4xl">Where this has shipped</h2>
            <ul className="grid gap-8 md:grid-cols-3">
              {service.evidence.map((proof) => {
                const project = getProject(proof.slug);
                return (
                  <li key={proof.slug} className="rule-t pt-5">
                    <h3 className="display text-xl md:text-2xl">{proof.project}</h3>
                    {project && <p className="label mt-1 text-cobalt">{project.tagline}</p>}
                    <p className="mt-3 text-sm leading-7 text-ink-muted">{proof.claim}</p>
                    <Link
                      href={`/work/${proof.slug}`}
                      className="label mt-4 inline-block text-cobalt hover:underline"
                    >
                      READ THE {proof.project.toUpperCase()} CASE STUDY →
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="wrap rule-t py-12">
          <Tag className="mb-3 block">[STACK]</Tag>
          <h2 className="display mb-4 text-xl md:text-2xl">Stack</h2>
          <ul className="flex flex-wrap gap-2">
            {service.stack.map((tech) => (
              <li key={tech} className="label border border-ink px-2 py-1 text-ink">
                {tech}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ — the questions clients actually ask, phrased the way they ask
            them, and mirrored into FAQPage structured data above. */}
        <section className="wrap rule-t py-16 md:py-24">
          <Tag className="mb-3 block">[04] QUESTIONS</Tag>
          <h2 className="display mb-8 text-2xl md:text-4xl">Questions about {service.name.toLowerCase()}</h2>
          <dl className="max-w-3xl space-y-8">
            {service.faqs.map((faq) => (
              <div key={faq.q}>
                <dt className="display text-xl md:text-2xl">{faq.q}</dt>
                <dd className="mt-3 text-sm leading-7 text-ink-muted">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="wrap rule-t py-12">
          <Tag className="mb-3 block">[RELATED]</Tag>
          <h2 className="display mb-4 text-xl md:text-2xl">Related</h2>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {related.map((other) => (
              <li key={other!.slug}>
                <Link href={`/services/${other!.slug}`} className="text-cobalt hover:underline">
                  {other!.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/about" className="text-cobalt hover:underline">
                About {PERSON.name}
              </Link>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
