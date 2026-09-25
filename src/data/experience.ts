/**
 * Employment history, education and the bio paragraphs.
 *
 * Lifted out of the homepage component so the About page can state the same
 * facts without a second copy drifting away from the first — and so the
 * `Person` JSON-LD can be built from the same source the page renders.
 */
export type Role = {
  n: string;
  role: string;
  company: string;
  /** ISO start date, for structured data. */
  start: string;
  /** ISO end date, or undefined while current. */
  end?: string;
  dates: string;
  place: string;
  body: string;
};

export const EXPERIENCE: Role[] = [
  {
    n: "01",
    role: "Senior Software Engineer",
    company: "Ward Web Solutions",
    start: "2026-02",
    dates: "Feb 2026 – Present",
    place: "United Kingdom",
    body: "Leading a team building full-stack and AI SaaS, including medical platforms used across the UK and Europe. I ship RAG pipelines, agent workflows and microservices, mentor engineers, and have delivered 30+ REST and GraphQL APIs on PostgreSQL and AWS at 99% uptime.",
  },
  {
    n: "02",
    role: "Senior Software Engineer",
    company: "Wanile Technologies",
    start: "2024-07",
    end: "2026-08",
    // Closed, not open-ended. This read "Present · concurrent" while the CV
    // dates it to August 2026 — the overlap with Ward Web Solutions was real
    // but it ran Feb to Aug 2026, and it has ended.
    dates: "Jul 2024 – Aug 2026",
    place: "Lahore",
    body: "Led full-stack delivery across 8+ client projects in React, Next.js, Node.js and Python. Shipped 10+ production apps and 30+ REST APIs and closed 50+ issues, cutting delivery time by 20%, response times by 18% and incidents by 25%.",
  },
  {
    n: "03",
    // "Software Engineer", per the CV. The site carried "Senior" here, which
    // outranked the record it is supposed to match.
    role: "Software Engineer",
    company: "Nazadv",
    start: "2022-11",
    end: "2026-02",
    dates: "Nov 2022 – Feb 2026",
    place: "US (California)",
    body: "Worked with 10+ clients and a small engineering team, shipping 15+ full-stack features across interfaces, APIs and data systems. Delivered 5+ production RAG and agentic AI solutions and reduced bugs by 25% across 20+ shipped features.",
  },
];

export const EDUCATION = {
  degree: "Bachelor of Computer Science",
  institution: "Pakistan Institute of Engineering and Applied Sciences",
  place: "Islamabad, Pakistan",
} as const;

export const BEYOND_CODE = [
  { title: "Strength training", detail: "4–5 sessions a week" },
  { title: "Table tennis", detail: "Represented school and university at national level" },
  { title: "Solo hiking", detail: "Summited Mushkpuri and Miranjani" },
] as const;

/**
 * The bio, broken at its own sentence boundaries. The homepage animates these
 * one at a time; the About page sets them as a paragraph. Same words either way.
 *
 * The homepage anchors margin notes to "Senior", "RAG" and "users", and sets
 * "actually" and "problem" as accent words. Keep those words when editing.
 */
export const BIO = [
  "I’m a Senior Software Engineer building full-stack and AI products with React, Next.js, Python and Node.js.",
  "My focus is production RAG, agent workflows and LLM integration, built into systems people actually use.",
  "I’ve led 8+ projects, built 30+ REST and GraphQL APIs and shipped AI features used by hundreds of real users.",
  "I solve the actual problem, not just the ticket.",
];
