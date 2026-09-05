/**
 * The stack, grouped.
 *
 * Shared between the homepage's interactive stack section and the About page,
 * which lists the same tools as plain text — one source so the two can never
 * disagree about what is actually used.
 */
export const SKILLS = [
  { n: "01", label: "Languages", items: ["JavaScript", "TypeScript", "Python"] },
  {
    n: "02",
    label: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "Redux Toolkit",
      "TanStack Query",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
      "MUI",
      "Shadcn",
      "Headless UI",
    ],
  },
  {
    n: "03",
    label: "Backend & APIs",
    // Nest.js and Laravel both carry shipped work — Golegal's API and Carder's
    // backend respectively — and were missing from the list the site shows.
    items: ["Node.js", "Nest.js", "Express.js", "Laravel", "REST APIs", "GraphQL", "NextAuth"],
  },
  { n: "04", label: "AI / ML", items: ["LangChain", "Agentic RAG", "LLM Integration", "OpenAI"] },
  { n: "05", label: "Infrastructure", items: ["PostgreSQL", "AWS S3", "CI/CD"] },
];

/** Derived, so it can never drift from the list above. */
export const TOTAL_TOOLS = SKILLS.reduce((sum, s) => sum + s.items.length, 0);

/** What actually gets opened most days — each name is present in SKILLS. */
export const DAILY_DRIVERS = [
  { k: "LANGUAGE", v: "TypeScript" },
  { k: "FRAMEWORK", v: "Next.js" },
  { k: "RUNTIME", v: "Node.js" },
  { k: "DATA", v: "PostgreSQL" },
  { k: "AI", v: "OpenAI · Agentic RAG" },
];
