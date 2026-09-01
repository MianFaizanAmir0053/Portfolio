/**
 * schema.org JSON-LD builders.
 *
 * Everything here is emitted from server components, so the markup is in the
 * initial HTML response — the crawlers that matter for this site (Google, plus
 * the AI answer engines, most of which do not execute JavaScript) see it
 * without rendering. Nothing in this file may import client-only code.
 *
 * The graph is anchored on stable `@id` URLs. `#person` is the entity the whole
 * site is about; every page's `WebPage` node points back at it, which is what
 * lets a search engine consolidate the pages into one person rather than five
 * unrelated documents.
 */
import { SITE_URL, SITE_NAME, PERSON, CONTENT_REVIEWED, absoluteUrl } from "@/lib/site";
import { SOCIAL } from "@/data/social";
import type { Project } from "@/data/projects";

export const ID = {
  person: `${SITE_URL}/#person`,
  website: `${SITE_URL}/#website`,
  homepage: `${SITE_URL}/#webpage`,
} as const;

/** The primary entity. Referenced by `@id` everywhere else rather than repeated. */
export function personSchema() {
  return {
    "@type": "Person",
    "@id": ID.person,
    name: PERSON.name,
    jobTitle: PERSON.jobTitle,
    description:
      "Senior software engineer with four years building full-stack and AI-driven products in React, Next.js, TypeScript, Node.js and Python, focused on RAG architectures, agentic AI and LLM integration.",
    url: SITE_URL,
    image: absoluteUrl(PERSON.image),
    email: `mailto:${PERSON.email}`,
    telephone: PERSON.telephone,
    knowsAbout: [...PERSON.knowsAbout],
    address: {
      "@type": "PostalAddress",
      addressLocality: PERSON.locality,
      addressRegion: PERSON.region,
      addressCountry: PERSON.country,
    },
    worksFor: { "@type": "Organization", name: PERSON.worksFor },
    alumniOf: { "@type": "CollegeOrUniversity", name: PERSON.alumniOf },
    sameAs: [SOCIAL.github, SOCIAL.linkedin, SOCIAL.instagram],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "en",
    publisher: { "@id": ID.person },
    about: { "@id": ID.person },
  };
}

/**
 * A page node. `ProfilePage` is correct for the homepage — it is the profile of
 * the person the site is about — and plain `WebPage` for everything else.
 */
export function webPageSchema({
  path,
  name,
  description,
  type = "WebPage",
  breadcrumb,
}: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "ProfilePage" | "ContactPage" | "AboutPage" | "CollectionPage";
  breadcrumb?: ReturnType<typeof breadcrumbSchema>;
}) {
  return {
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.person },
    inLanguage: "en",
    dateModified: CONTENT_REVIEWED,
    ...(breadcrumb ? { breadcrumb: { "@id": `${absoluteUrl(path)}#breadcrumb` } } : {}),
  };
}

export function breadcrumbSchema(path: string, trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * A case study, described as what it is: a written work about a piece of
 * software. `CreativeWork` describes the write-up, `about` carries the product
 * itself — which is what a search engine needs to connect "Faizan Amir" to
 * "Carder" as entities rather than as words on a page.
 */
export function caseStudySchema(project: Project) {
  const url = absoluteUrl(`/work/${project.slug}`);
  return {
    "@type": "CreativeWork",
    "@id": `${url}#case-study`,
    url,
    name: `${project.name} — ${project.tagline}`,
    headline: `${project.name} — ${project.tagline}`,
    description: project.summary,
    inLanguage: "en",
    dateModified: CONTENT_REVIEWED,
    author: { "@id": ID.person },
    creator: { "@id": ID.person },
    isPartOf: { "@id": ID.website },
    image: absoluteUrl(project.image),
    keywords: project.stack.join(", "),
    about: {
      "@type": "SoftwareApplication",
      name: project.name,
      applicationCategory: "WebApplication",
      description: project.summary,
      operatingSystem: "Web",
      ...(project.liveUrl ? { url: project.liveUrl } : {}),
      author: { "@id": ID.person },
    },
  };
}

/** A service offered, tied back to the person who delivers it. */
export function serviceSchema({
  path,
  name,
  description,
  serviceType,
}: {
  path: string;
  name: string;
  description: string;
  serviceType: string;
}) {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name,
    description,
    serviceType,
    provider: { "@id": ID.person },
    areaServed: PERSON.markets.map((m) => ({ "@type": "Country", name: m })),
    url: absoluteUrl(path),
  };
}

export function faqSchema(path: string, faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function itemListSchema(
  path: string,
  items: { name: string; path: string; description?: string }[],
) {
  return {
    "@type": "ItemList",
    "@id": `${absoluteUrl(path)}#list`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

/** Wraps nodes into one `@graph` document — one script tag per page, not six. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
