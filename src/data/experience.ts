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
    body: "Leading a team building full-stack and AI-powered SaaS, including medical platforms used across the UK and Europe. Shipping RAG pipelines, agentic AI, and microservices, and mentoring engineers through code reviews and sprint planning. Built 30+ REST and GraphQL APIs on PostgreSQL and AWS at 99% uptime.",
  },
  {
    n: "02",
    role: "Senior Software Engineer",
    company: "Wanile Technologies",
    start: "2024-07",
    // Two entries in this list end in "Present", and left unexplained that
    // reads as a stale date rather than as two engagements running at once.
    // Ward Web Solutions is the primary role — it is what `worksFor` and the
    // homepage's CURRENTLY card name — so the qualifier goes on this one, and
    // it rides in `dates` rather than a new field so it reaches every surface
    // already printing them: the horizontal rail, the About list, llms.txt.
    dates: "Jul 2024 – Present · concurrent",
    place: "Lahore",
    body: "Leading full-stack development across 8+ client projects in React, Next.js, Node.js, and Python, turning business requirements into shipped products 20% faster. Built 30+ REST APIs and data pipelines, cutting response times by 18%. Shipped 10+ production apps and closed 50+ issues, cutting incidents by 25%.",
  },
  {
    n: "03",
    role: "Senior Software Engineer",
    company: "Nazadv",
    start: "2022-11",
    end: "2026-02",
    dates: "Nov 2022 – Feb 2026",
    place: "US (California)",
    body: "Worked directly with 10+ clients and a small engineering team over three years, shipping 15+ full-stack features across UI, APIs, databases, and data pipelines. Developed 5+ RAG and agentic AI solutions, integrating LLMs into production systems. Cut bugs by 25% across 20+ shipped features.",
  },
];

export const EDUCATION = {
  degree: "Bachelor of Computer Science",
  institution: "Pakistan Institute of Engineering and Applied Sciences",
  place: "Islamabad, Pakistan",
} as const;

/**
 * The bio, broken at its own sentence boundaries. The homepage animates these
 * one at a time; the About page sets them as a paragraph. Same words either way.
 */
export const BIO = [
  "I’m a Senior Software Engineer with four years of experience building full-stack and AI-driven applications using React, Next.js, Python, and Node.js.",
  "My focus is RAG architectures, agentic AI, and LLM integrations — turning business requirements into production systems people actually use.",
  "I’ve led development across 8+ projects, built 30+ REST and GraphQL APIs, and shipped AI features used by hundreds of real users.",
  "I care about clean architecture, fast iteration, and solving the actual problem, not just the ticket.",
];
