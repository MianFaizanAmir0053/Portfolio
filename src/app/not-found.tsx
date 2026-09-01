import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/projects";
import { Tag } from "@/components/site/primitives";

/**
 * A 404 that inherits the homepage's title tells a crawler this page is the
 * homepage. `index: false, follow: true` keeps it out of the index while still
 * letting the links below be crawled.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist. The case studies, services and contact details are here.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5 py-20">
      <main id="main" className="w-full max-w-xl">
        <Tag className="mb-6 block text-cobalt">[404]</Tag>
        <p className="display text-[22vw] leading-[0.8] text-ink md:text-[9rem]">404</p>
        <h1 className="display mt-6 text-2xl md:text-3xl">Page not found</h1>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Everything the site
          does have is one link away.
        </p>

        {/* Not a dead end. A 404 that offers one link back to the homepage
            wastes both the visitor and the crawl. */}
        <nav aria-label="Site" className="mt-8 rule-t pt-6">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <li>
              <Link href="/" className="text-cobalt hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/work" className="text-cobalt hover:underline">
                Case studies
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-cobalt hover:underline">
                Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-cobalt hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-cobalt hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Case studies" className="mt-6">
          <p className="label mb-3">[WORK]</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={`/work/${project.slug}`} className="hover:text-cobalt">
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
