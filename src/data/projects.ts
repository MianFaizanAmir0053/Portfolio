/**
 * Project content.
 *
 * IMAGES: the six screenshots below are placeholders generated into
 * `public/projects/`. Drop your real files into that folder and change the
 * paths here — that is the only edit needed (e.g. "/projects/carder.jpg").
 */
const img = {
  carder: "/projects/carder.svg",
  golegal: "/projects/golegal.svg",
  muterpe: "/projects/muterpe.svg",
  alfa: "/projects/alfa.svg",
  diagram: "/projects/diagram.svg",
  terminal: "/projects/terminal.svg",
} as const;

export const projectImages = img;

export type Metric = { value: string; caption: string; note?: string };

export type BuildBlock = { title: string; body: string; image: string; alt: string };

export type Project = {
  slug: string;
  index: string;
  name: string;
  accentWord: string;
  tagline: string;
  summary: string;
  role: string;
  timeline: string;
  status: string;
  inDevelopment?: boolean;
  liveUrl?: string;
  liveLabel?: string;
  stack: string[];
  indexMetrics: string[];
  image: string;
  alt: string;
  problem: string;
  problemHeadline: string;
  approach: string;
  decisions: string[];
  diagram?: { src: string; alt: string; caption: string };
  build: BuildBlock[];
  metrics: Metric[];
  reflection: string;
};

export const projects: Project[] = [
  {
    slug: "carder",
    index: "01",
    name: "Carder",
    accentWord: "Carder",
    tagline: "Digital Business Card Platform",
    summary: "A digital business card platform scaled to 150+ users across the Middle East and Europe.",
    role: "Backend & Infrastructure Lead",
    timeline: "2024 – Present",
    status: "Live",
    liveUrl: "https://carder.app",
    liveLabel: "carder.app",
    stack: ["Next.js", "TypeScript", "Node.js", "Express", "SQL", "Stripe", "AWS S3"],
    indexMetrics: ["150+ users", "+40% adoption"],
    image: img.carder,
    alt: "Carder digital business card profile screen",
    problemHeadline: "Paper cards die in a drawer",
    problem:
      "Physical business cards die in a drawer. Carder needed to replace them with a shareable digital profile — but the first version couldn't handle payments, media storage, or the release cadence the team wanted.",
    approach:
      "I owned the backend and the data layer end to end, designing for a product that had to keep shipping while it was already in users' hands.",
    decisions: [
      "Designed the schema and a migration strategy so the product could evolve without downtime.",
      "Integrated Stripe for subscription payments, including webhook-driven state.",
      "Moved all user media to AWS S3 with signed delivery instead of app-server storage.",
      "Built CI/CD so releases stopped being manual events.",
    ],
    diagram: {
      src: img.diagram,
      alt: "Carder service and data flow diagram",
      caption: "* DATA + PAYMENT FLOW",
    },
    build: [
      {
        title: "Profile & media pipeline",
        body: "Uploads go straight to S3 with signed URLs, so image-heavy profiles never block the API. Delivery is cached at the edge and the app server never touches the bytes.",
        image: img.carder,
        alt: "Carder profile editing interface",
      },
      {
        title: "Subscriptions without surprises",
        body: "Stripe checkout plus webhook reconciliation means entitlement state is derived from Stripe, not guessed locally. Failed payments degrade the profile gracefully instead of hard-locking a user out.",
        image: img.terminal,
        alt: "Terminal output from the Carder deployment pipeline",
      },
    ],
    metrics: [
      { value: "150+", caption: "Users, ME & Europe", note: "* across two regions" },
      { value: "+40%", caption: "Adoption growth", note: "* post-relaunch" },
      { value: "0", caption: "Downtime migrations", note: "* expand / contract" },
      { value: "100%", caption: "Payments via Stripe", note: "* webhook-reconciled" },
    ],
    reflection:
      "I'd put the analytics layer in from day one. We shipped adoption features on intuition for the first few months, and the +40% only became legible once instrumentation landed — which means we were probably slower than we needed to be to find it.",
  },
  {
    slug: "golegal",
    index: "02",
    name: "Golegal",
    accentWord: "Golegal",
    tagline: "AI SaaS for Legal Assistance",
    summary:
      "An AI legal platform using RAG pipelines and agentic workflows for context-aware document automation.",
    role: "Full-Stack & AI Engineer",
    timeline: "2024 – Present",
    status: "Live",
    liveUrl: "https://golegal.wanile.dev",
    liveLabel: "golegal.wanile.dev",
    stack: ["Next.js", "React", "PostgreSQL", "OpenAI", "Agentic RAG", "React Flow", "Plate.js"],
    indexMetrics: ["95% accuracy", "-30% manual work", "50+ users"],
    image: img.golegal,
    alt: "Golegal AI legal document dashboard with workflow canvas",
    problemHeadline: "Generic chat can't be trusted with legal text",
    problem:
      "Legal teams lose hours to reading, extracting, and reformatting the same document types. Generic LLM chat wasn't accurate enough to trust with legal text — it hallucinated citations and lost document context.",
    approach:
      "The fix wasn't a better prompt. It was retrieval that preserves legal structure, and agents that know which extraction path a document belongs to.",
    decisions: [
      "Built an agentic RAG pipeline over PostgreSQL with vector retrieval.",
      "Chunked and embedded documents with structure preserved, so clause context survives retrieval.",
      "Used agent workflows to route document types to the right extraction path.",
      "Shipped a React Flow visual workflow builder so non-engineers can compose pipelines.",
      "Used Plate.js for the in-app document editor, with extraction results written inline.",
    ],
    diagram: {
      src: img.diagram,
      alt: "Agentic RAG pipeline: ingest, chunk, embed, vector store, agent, output",
      caption: "* AGENTIC RAG PIPELINE",
    },
    build: [
      {
        title: "Structure-preserving retrieval",
        body: "Chunking follows the document's own hierarchy — sections, clauses, sub-clauses — and every chunk carries its ancestry. A retrieved clause arrives with the context that makes it mean something, which is what killed the hallucinated citations.",
        image: img.golegal,
        alt: "Document retrieval view in Golegal",
      },
      {
        title: "Agent routing by document type",
        body: "A classifier routes each upload to a dedicated extraction agent. Contracts, filings, and correspondence each get their own tool set and validation schema rather than one prompt trying to cover everything.",
        image: img.diagram,
        alt: "Agent routing diagram",
      },
      {
        title: "Visual workflow builder",
        body: "React Flow gives legal teams a canvas to wire ingest, extraction, and review steps themselves. Plate.js handles the editor surface so extracted values land in the document, not in a separate table nobody reads.",
        image: img.terminal,
        alt: "Golegal workflow builder canvas",
      },
    ],
    metrics: [
      { value: "95%", caption: "Extraction accuracy", note: "* on evaluated set" },
      { value: "100+", caption: "Files / month", note: "* processed in production" },
      { value: "-30%", caption: "Manual document work", note: "* reported by users" },
      { value: "50+", caption: "Active users", note: "* legal professionals" },
    ],
    reflection:
      "I'd build the evaluation harness before the pipeline, not alongside it. We tuned chunking by feel for too long, and every change felt like a coin flip until there was a scored regression set to argue with.",
  },
  {
    slug: "muterpe",
    index: "03",
    name: "Muterpe",
    accentWord: "Muterpe",
    tagline: "AI Image Generation SaaS",
    summary: "An AI model-training and image-generation platform, built from the ground up and monetized.",
    role: "Founding Engineer",
    timeline: "2023 – Present",
    status: "Live, monetized",
    stack: ["Next.js", "React", "PostgreSQL", "OpenAI", "Fal.ai", "AWS S3"],
    indexMetrics: ["200+ users", "$5K+ revenue", "99% uptime"],
    image: img.muterpe,
    alt: "Muterpe AI image generation interface with result grid",
    problemHeadline: "Generic models don't hold a likeness",
    problem:
      "Generic image generators don't hold a brand or a person's likeness. Muterpe needed per-user model training, plus a generation pipeline fast enough that users wouldn't abandon mid-flow.",
    approach:
      "Training is slow and generation must feel instant, so the architecture is built around never letting one block the other.",
    decisions: [
      "Built the model-training and generation pipeline on Fal.ai with OpenAI in the loop for prompt shaping.",
      "Used an async job queue so training and generation never block the UI.",
      "Stored and delivered every asset from S3 rather than the application server.",
      "Wired usage-based monetization directly into the generation flow.",
    ],
    diagram: {
      src: img.diagram,
      alt: "Muterpe training and generation job pipeline",
      caption: "* TRAIN / GENERATE PIPELINE",
    },
    build: [
      {
        title: "Per-user model training",
        body: "Users upload a set, the job queue picks it up, and training progress streams back to the UI. Nothing about the app is blocked while a model bakes.",
        image: img.muterpe,
        alt: "Muterpe model training screen",
      },
      {
        title: "Generation that feels immediate",
        body: "Prompts are shaped server-side before they hit the generation provider, and results stream in as they land. Perceived speed improved ~40% without changing the underlying model.",
        image: img.terminal,
        alt: "Generation job logs",
      },
    ],
    metrics: [
      { value: "200+", caption: "Users", note: "* self-serve signup" },
      { value: "$5K+", caption: "Revenue", note: "* usage-based" },
      { value: "99%", caption: "Uptime", note: "* rolling 12 months" },
      { value: "40%", caption: "Faster generation", note: "* vs. first release" },
    ],
    reflection:
      "Usage-based billing went in late, and retrofitting metering onto a pipeline that was already running cost more than building it in from the start would have. I'd meter first and price second next time.",
  },
  {
    slug: "alfa",
    index: "04",
    name: "Alfa",
    accentWord: "Alfa",
    tagline: "Fintech Platform",
    summary:
      "A microservices fintech platform handling transfers, bill splitting, top-ups, and currency conversion.",
    role: "Backend Engineer",
    timeline: "2026 – Present",
    status: "In development",
    inDevelopment: true,
    stack: ["Python", "Next.js", "GraphQL"],
    indexMetrics: ["6+ services", "10+ GraphQL APIs"],
    image: img.alfa,
    alt: "Alfa fintech microservices architecture diagram",
    problemHeadline: "One monolith, four risk profiles",
    problem:
      "A monolithic financial backend couldn't safely scale across separate money-movement services — transfers, top-ups, and conversion each have different failure and compliance profiles.",
    approach:
      "Split by financial domain so failure and compliance boundaries line up with service boundaries, then hide the split from clients.",
    decisions: [
      "Split the backend into Python microservices by financial domain.",
      "Added a GraphQL layer so clients see one schema across every service.",
      "Handled transaction integrity and idempotency at the service boundary.",
    ],
    diagram: {
      src: img.alfa,
      alt: "Alfa microservices boundaries and GraphQL gateway",
      caption: "* SERVICE BOUNDARIES",
    },
    build: [
      {
        title: "Domain-split services",
        body: "Transfers, top-ups, bill splitting, and conversion each own their data and their failure modes. A conversion outage doesn't take transfers down with it.",
        image: img.alfa,
        alt: "Alfa service map",
      },
      {
        title: "One schema for clients",
        body: "The GraphQL layer composes the services into a single graph, so the mobile and web clients never have to know how the backend is partitioned.",
        image: img.terminal,
        alt: "GraphQL schema in an editor",
      },
    ],
    metrics: [
      { value: "6+", caption: "Financial services", note: "* domain-split" },
      { value: "10+", caption: "GraphQL APIs", note: "* composed graph" },
      { value: "WIP", caption: "In active development", note: "* not a finished claim" },
    ],
    reflection:
      "Splitting by domain this early is a bet. If the boundaries turn out wrong, the cost of moving them across four services is real — I'd want a harder look at the transaction paths before adding the fifth service.",
  },
];

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug);

export const projectNeighbours = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: undefined, next: undefined, position: 0 };
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
    position: i + 1,
  };
};
