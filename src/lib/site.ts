/**
 * Single source of truth for everything that needs to know where this site
 * lives and who it is about.
 *
 * Canonical URLs, the sitemap, robots.txt, Open Graph images and every JSON-LD
 * block resolve against `SITE_URL`. Set `NEXT_PUBLIC_SITE_URL` in the
 * environment when the site moves to a custom domain — that is the only edit
 * needed. No trailing slash: every consumer appends its own path.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://faizan-dev.vercel.app"
).replace(/\/$/, "");

/** Absolute URL for a site-relative path. Schema and OG tags require absolute. */
export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const SITE_NAME = "Faizan Amir — Senior Software Engineer";

/**
 * The person this site is about. Feeds the Person/ProfilePage JSON-LD graph,
 * the contact blocks and the machine-readable files under /public.
 */
export const PERSON = {
  name: "Faizan Amir",
  jobTitle: "Senior Software Engineer",
  email: "faizanamir0053@gmail.com",
  /** E.164 — schema.org and tel: links both want the international form. */
  telephone: "+923030649009",
  telephoneDisplay: "0303 0649009",
  whatsapp: "https://wa.me/923030649009",
  locality: "Lahore",
  region: "Punjab",
  country: "PK",
  countryName: "Pakistan",
  /** Markets served, in the order the site claims them. */
  markets: ["United States", "United Kingdom", "Middle East", "Europe"],
  yearsExperience: 4,
  alumniOf: "Pakistan Institute of Engineering and Applied Sciences",
  worksFor: "Ward Web Solutions",
  image: "/IMG_20230712_220219-removebg-preview.png",
  knowsAbout: [
    "Full-stack web development",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Python",
    "Retrieval-augmented generation (RAG)",
    "Agentic AI",
    "LLM integration",
    "REST and GraphQL API design",
    "PostgreSQL",
    "MongoDB",
    "AWS",
  ],
} as const;

/**
 * The last date the site's own copy was reviewed. Answer engines weight
 * freshness heavily and there is no CMS here to derive it from, so it is
 * declared once and updated when the content actually changes.
 */
export const CONTENT_REVIEWED = "2026-09-01";
