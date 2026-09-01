/**
 * Service pages.
 *
 * These exist because the homepage can only rank for one thing at a time, and
 * "senior software engineer" is not what a client types when they have a
 * problem. They type the problem. Each page below answers one of those, and
 * every claim on it points at a case study in `projects.ts` that already made
 * the claim in public — no page here invents evidence, and no page is a
 * template with the nouns swapped.
 */
export type Service = {
  slug: string;
  /** Short label used in navigation and lists. */
  name: string;
  /** SEO title, without the site name — the metadata template appends it. */
  title: string;
  /** Meta description, kept near 155 characters. */
  description: string;
  /** schema.org `serviceType`. */
  serviceType: string;
  headline: [string, string];
  /** Accent word inside the headline's second line. */
  accent: string;
  /**
   * The self-contained answer block. Written to survive being extracted on its
   * own by an answer engine: it names the service, the person, the stack and
   * the evidence without needing the rest of the page.
   */
  answer: string;
  /** What the engagement actually delivers. */
  includes: { title: string; body: string }[];
  /** How the work is approached, in order. */
  process: { step: string; body: string }[];
  /** Proof, each tied to a case study slug that carries it. */
  evidence: { slug: string; project: string; claim: string }[];
  stack: string[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const services: Service[] = [
  {
    slug: "ai-engineering",
    name: "AI engineering",
    title: "AI engineering — RAG pipelines, agents and LLM integration",
    description:
      "RAG pipelines, agentic workflows and LLM features built for production: retrieval that keeps document structure, evaluation before tuning, and humans in the loop.",
    serviceType: "AI and LLM application development",
    headline: ["AI that survives", "contact with production"],
    accent: "production",
    answer:
      "AI engineering here means retrieval-augmented generation, agent workflows and LLM features built to run in production rather than demo well. Faizan Amir has shipped five or more RAG and agentic systems, including an agentic RAG pipeline for legal documents measured at 95% extraction accuracy on its evaluated set.",
    includes: [
      {
        title: "Retrieval that preserves structure",
        body: "Chunking follows the document’s own hierarchy — sections, clauses, sub-clauses — and every chunk carries its ancestry, so a retrieved passage arrives with the context that makes it mean something. This is what stopped the hallucinated citations on Golegal.",
      },
      {
        title: "Agent workflows with real routing",
        body: "A classifier routes each input to a dedicated agent with its own tool set and validation schema, instead of one prompt trying to cover every document type. Contracts, filings and correspondence do not share an extraction path.",
      },
      {
        title: "Evaluation before tuning",
        body: "A scored regression set exists before the pipeline is tuned, so a chunking change is an argument with numbers rather than a coin flip. On mailagent the harness came first: 92.9% exact-match extraction across 14 hand-labelled fixtures, 100% retrieval hit@5 across 29 queries.",
      },
      {
        title: "Human-in-the-loop gates",
        body: "Anything that writes to a calendar, a document or a customer record stops for approval. The scheduling agent interrupts and waits for a human tap before it touches the calendar, and that interrupt is part of the graph, not a setting.",
      },
      {
        title: "Honest cost accounting",
        body: "An unpriced model call is recorded as NULL, never as zero. Cost dashboards that quietly round missing data to nothing are how AI budgets get discovered late.",
      },
    ],
    process: [
      {
        step: "Scope the failure mode",
        body: "Start from what the generic model gets wrong on your data — not from the feature list. On legal text it was lost clause context and invented citations, which is a retrieval problem, not a prompt problem.",
      },
      {
        step: "Build the scoring harness",
        body: "Hand-label a fixture set and score against it before the pipeline is worth tuning. Without it, every change feels like an improvement.",
      },
      {
        step: "Ship the pipeline",
        body: "Ingest, chunk, embed, retrieve, route, act. Postgres with pgvector or the vector store already in your stack; LangGraph or a hand-rolled state machine depending on how much of the graph needs to be inspectable.",
      },
      {
        step: "Put a human in the path",
        body: "Approval interrupts on anything irreversible, with the agent’s own trace shown to whoever approves it.",
      },
      {
        step: "Instrument, then iterate",
        body: "Token cost, latency per node, retrieval hit rate and extraction accuracy tracked from the first deploy rather than retrofitted.",
      },
    ],
    evidence: [
      {
        slug: "golegal",
        project: "Golegal",
        claim:
          "Agentic RAG over PostgreSQL for legal document automation: 95% extraction accuracy on the evaluated set, 100+ files processed monthly, 30% less manual document work reported by users.",
      },
      {
        slug: "muterpe",
        project: "Muterpe",
        claim:
          "Per-user model training and generation on Fal.ai with an async job queue, monetized usage-based, at 99% uptime over a rolling twelve months.",
      },
    ],
    stack: [
      "Python",
      "LangChain",
      "LangGraph",
      "OpenAI",
      "Gemini",
      "PostgreSQL + pgvector",
      "FastAPI",
      "Next.js",
    ],
    faqs: [
      {
        q: "What is RAG and when do I actually need it?",
        a: "Retrieval-augmented generation puts your own documents in front of the model at query time instead of relying on what it memorised. You need it when answers must cite your data and be checkable — contracts, policies, internal knowledge. If the task is generic writing or classification, a well-prompted model without retrieval is cheaper and simpler.",
      },
      {
        q: "How do you stop an LLM hallucinating over my documents?",
        a: "Structure-preserving retrieval and evaluation. Chunks carry their position in the document so a clause arrives with its parent context, agents are routed per document type with validation schemas, and a scored fixture set catches regressions before they ship. On Golegal that combination took extraction accuracy to 95% on the evaluated set.",
      },
      {
        q: "Can you add AI to an existing product rather than starting fresh?",
        a: "Yes, and that is the more common engagement. The work is usually a pipeline and a few endpoints alongside your current backend, not a rewrite. Golegal, Muterpe and the Ward Web Solutions medical platforms were all AI layers built into products that already had users.",
      },
      {
        q: "How long does a first production RAG pipeline take?",
        a: "Plan on weeks, not months, for a scoped first version: evaluation set, ingest and chunking, retrieval, one routed extraction path, and instrumentation. The long pole is almost always the quality of the labelled fixtures, not the model integration.",
      },
    ],
    related: ["saas-mvp-development", "api-and-backend-development"],
  },
  {
    slug: "nextjs-development",
    name: "Next.js development",
    title: "Next.js and React development for products with real state",
    description:
      "Next.js and React front ends for products with roles, sessions and money in them. App Router, TypeScript, Redux Toolkit and RTK Query, built so a new screen is composition.",
    serviceType: "Frontend web development",
    headline: ["Front ends that hold", "their own state"],
    accent: "state",
    answer:
      "Next.js and React development for applications with genuine state: multiple roles, partial onboarding, sessions that have not been chosen yet, money moving. Faizan Amir builds these in the App Router with TypeScript, Redux Toolkit and RTK Query, most recently a fintech front end serving personal, business and admin journeys from one routing surface.",
    includes: [
      {
        title: "One guard, not fifteen",
        body: "Role, session and onboarding rules resolve in a single guard against a bootstrapped user object. Middleware stays a cheap token-presence check at the edge. Pages stop guessing at auth state, which is where multi-role routing usually breaks.",
      },
      {
        title: "One API layer, many domains",
        body: "A single RTK Query base API with endpoints injected per feature, so seven domains share one reducer, one middleware and one cache. Adding an endpoint means touching one file and getting caching, tag invalidation and generated hooks with it.",
      },
      {
        title: "Config-driven pages",
        body: "Product and marketing pages defined as composition rather than layout, so a merchandising change is an edit rather than a rewrite. Typed contracts and defensive rendering mean a missing CMS field degrades instead of breaking the page.",
      },
      {
        title: "Server components where they pay",
        body: "Content rendered on the server so it is in the HTML for crawlers and answer engines, client components kept to the parts that genuinely need interaction. This site is built that way.",
      },
      {
        title: "Motion that does not cost vitals",
        body: "GSAP and Framer Motion used deliberately, reduced-motion respected, and layout stability treated as a requirement rather than a nice-to-have.",
      },
    ],
    process: [
      {
        step: "Map the states first",
        body: "Every role, every partial state, every place the app can be resumed from. The routing falls out of that map instead of being patched onto it.",
      },
      {
        step: "Set the data layer",
        body: "One base API, typed endpoints, Zod schemas shared between the flows that submit and the flows that display.",
      },
      {
        step: "Build the shells",
        body: "Layout shells and form primitives first, so screens two through twenty start from composition.",
      },
      {
        step: "Wire the guards",
        body: "Auth, onboarding completeness and role resolution in one place, with the redirects it implies.",
      },
      {
        step: "Harden and measure",
        body: "Accessibility pass, Core Web Vitals, and a build that fails on type errors rather than shipping them.",
      },
    ],
    evidence: [
      {
        slug: "alfa",
        project: "Alfa",
        claim:
          "Multi-role fintech front end: three user roles, seven API domains behind one injected base API, four route groups, with the auth decision split between an edge token gate and a single client-side guard.",
      },
      {
        slug: "carder",
        project: "Carder",
        claim:
          "Digital business card platform scaled to 150+ users across the Middle East and Europe, with 40% adoption growth after relaunch.",
      },
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Redux Toolkit",
      "RTK Query",
      "Zod",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
    ],
    faqs: [
      {
        q: "Do you work in the App Router or the Pages Router?",
        a: "App Router by default, including server components, route handlers and the metadata API. Pages Router work is fine for an existing codebase, but new builds start on App Router because server rendering is where the SEO and the data-fetching story both live.",
      },
      {
        q: "Can you take over a Next.js codebase someone else started?",
        a: "Yes. The usual first pass is a state and routing map, a dependency and vulnerability audit, and a list of the places auth is being decided more than once. On Volumize that audit took a package graph from 34 findings to 1.",
      },
      {
        q: "How do you handle SEO in a heavily animated React site?",
        a: "Content renders on the server, animation attaches after. Text is in the initial HTML whether or not JavaScript runs, headings follow a real hierarchy, and structured data is emitted server-side. Animation then reveals content that is already there rather than creating it.",
      },
    ],
    related: ["saas-mvp-development", "ecommerce-development"],
  },
  {
    slug: "api-and-backend-development",
    name: "API & backend development",
    title: "API and backend development in Node.js, Express and PostgreSQL",
    description:
      "REST and GraphQL APIs, data models and integrations built to be operated: explicit lifecycles, reconciled payments, signed media delivery and migrations without downtime.",
    serviceType: "Backend and API development",
    headline: ["Backends built to be", "operated, not just shipped"],
    accent: "operated",
    answer:
      "Backend and API work in Node.js, Express, PostgreSQL and MongoDB, with an emphasis on systems somebody has to run after launch. Faizan Amir has built 30 or more REST and GraphQL APIs across client products, including a telehealth platform with 94 API route files and a payments layer reconciled against Stripe rather than guessed at locally.",
    includes: [
      {
        title: "Explicit lifecycles",
        body: "Orders, prescriptions, subscriptions and refunds modelled as statuses and transitions rather than boolean flags. On Volumize that connected questionnaire, doctor review, prescription generation and fulfilment into one traceable pipeline.",
      },
      {
        title: "Payments that reconcile",
        body: "Entitlement derived from the payment provider, not stored locally and hoped for. Webhook reconciliation, idempotency keys, unique transaction indexing and monotonic status so a late event cannot move an order backwards.",
      },
      {
        title: "Media off the app server",
        body: "Uploads go straight to S3 with signed URLs and are delivered from the edge, so image-heavy features never block the API.",
      },
      {
        title: "Migrations without downtime",
        body: "Expand and contract schema changes so the product can keep shipping while it is already in users’ hands.",
      },
      {
        title: "A dependency graph you can defend",
        body: "Phased remediation — non-breaking fixes first, breaking upgrades second, routing and transport prioritised. On Volumize that cleared every high and moderate finding across 1,127 packages.",
      },
    ],
    process: [
      {
        step: "Model the domain",
        body: "One definition per entity, shared between every surface that touches it. Two apps over shared packages beats two apps with two ideas of what an order is.",
      },
      {
        step: "Draw the state machine",
        body: "Statuses, allowed transitions, and what is irreversible. Refunds are a modelled branch, not an afterthought.",
      },
      {
        step: "Build the endpoints",
        body: "REST or GraphQL, validated at the boundary, with the auth check at the same layer as the data access.",
      },
      {
        step: "Guard the money",
        body: "Signature verification, ownership and amount checks, idempotency, replay protection, and tests that specifically cover settlement.",
      },
      {
        step: "Hand over something operable",
        body: "CI/CD so releases stop being manual events, plus the logs and metrics needed to answer questions in production.",
      },
    ],
    evidence: [
      {
        slug: "volumize",
        project: "Volumize",
        claim:
          "94 API route files across a customer app and an operational back office, 15 shared data models, and a security pass that cut vulnerabilities by 97%.",
      },
      {
        slug: "wisdomup",
        project: "WisdomUp",
        claim:
          "Eight layers of payment guard from signature verification to a monotonic order state machine, with 14 tests covering settlement confirmation specifically.",
      },
      {
        slug: "carder",
        project: "Carder",
        claim:
          "Schema and migration strategy that allowed zero-downtime evolution, Stripe subscriptions reconciled by webhook, and all user media moved to signed S3 delivery.",
      },
    ],
    stack: [
      "Node.js",
      "Express",
      "TypeScript",
      "PostgreSQL",
      "MongoDB",
      "Mongoose",
      "GraphQL",
      "Stripe",
      "AWS S3",
      "Socket.IO",
    ],
    faqs: [
      {
        q: "REST or GraphQL?",
        a: "REST for most product APIs, GraphQL where clients genuinely need to shape their own queries across a wide graph. The choice matters less than validation at the boundary, one definition per entity, and auth checked where the data is accessed.",
      },
      {
        q: "How do you handle Stripe webhooks arriving twice or out of order?",
        a: "Verify the signature, check ownership and amount, deduplicate on a unique transaction index, and refuse any event that would regress a status the order has already passed. Settlement runs down two paths — immediate confirmation and the webhook fallback — so a dropped browser never loses an order.",
      },
      {
        q: "Can you work with an existing database you did not design?",
        a: "Yes. Expand-and-contract migrations mean the schema can move without a maintenance window, and the first deliverable is usually a written model of what the current tables actually mean.",
      },
    ],
    related: ["ai-engineering", "ecommerce-development"],
  },
  {
    slug: "saas-mvp-development",
    name: "SaaS MVP development",
    title: "SaaS MVP development — from first commit to paying users",
    description:
      "Full-stack SaaS builds taken from empty repository to paying users: auth, data model, billing, media, deployment and the instrumentation to know whether any of it worked.",
    serviceType: "SaaS product development",
    headline: ["From empty repo", "to paying users"],
    accent: "paying",
    answer:
      "SaaS MVP development means owning the whole path from an empty repository to a product with paying users: auth, data model, billing, file storage, deployment and instrumentation. Faizan Amir has done this as founding engineer on an AI image platform that reached 200+ users and $5,000+ in usage-based revenue at 99% uptime.",
    includes: [
      {
        title: "The whole lifecycle, not a screen",
        body: "Signup, onboarding, the core loop, billing, and the operational surface someone needs to run it. A back office is part of the MVP, not a later project.",
      },
      {
        title: "Billing wired in early",
        body: "Metering first, pricing second. Retrofitting usage-based billing onto a running pipeline costs more than building it in, which is the lesson Muterpe paid for.",
      },
      {
        title: "Async by default",
        body: "Long work goes on a job queue so the interface never waits on it. Model training, generation, imports and exports all stream progress back rather than blocking.",
      },
      {
        title: "One domain layer across apps",
        body: "Customer app and admin app over shared auth, database and UI packages, so the two surfaces cannot drift apart as the product grows.",
      },
      {
        title: "Deployment that is not a ceremony",
        body: "CI/CD from the first week, environment parity, and a release that is a merge rather than an event.",
      },
    ],
    process: [
      {
        step: "Cut the scope to the loop",
        body: "Find the one loop that has to work for the product to be worth paying for, and build that end to end before anything else gets attention.",
      },
      {
        step: "Model and meter",
        body: "Data model and usage metering together, so pricing has something real to attach to later.",
      },
      {
        step: "Build the core loop",
        body: "The path a user takes from signup to the thing they came for, with the queue and storage it needs.",
      },
      {
        step: "Add the operational surface",
        body: "Admin views, status visibility, and the manual overrides that stop early support becoming database surgery.",
      },
      {
        step: "Instrument before iterating",
        body: "Funnel telemetry from launch. Adoption features shipped on intuition are how a 40% improvement stays invisible for months.",
      },
    ],
    evidence: [
      {
        slug: "muterpe",
        project: "Muterpe",
        claim:
          "Founding engineer on an AI model-training and image-generation SaaS: 200+ self-serve users, $5,000+ usage-based revenue, 99% uptime, and generation that feels ~40% faster than at first release without changing the model.",
      },
      {
        slug: "volumize",
        project: "Volumize",
        claim:
          "Turborepo monorepo with a customer app and an operational back office over three shared packages, covering intake, doctor approval, prescriptions, payments, despatch and subscriptions.",
      },
      {
        slug: "carder",
        project: "Carder",
        claim:
          "Backend and infrastructure lead on a product already in users’ hands, adding Stripe subscriptions, S3 media delivery and CI/CD without downtime.",
      },
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "Stripe",
      "AWS S3",
      "Turborepo",
      "CI/CD",
    ],
    faqs: [
      {
        q: "What does a realistic MVP scope look like?",
        a: "One loop, end to end, with billing and an admin view. Everything that is not on the path from signup to the thing the user came for is a candidate for the second release. The failure mode is not building too little, it is building five half-loops.",
      },
      {
        q: "Do you work with founders who are not technical?",
        a: "Yes. The working pattern is a written model of the product’s states and a weekly shipped increment you can use rather than a status report. Muterpe was built that way from the first commit.",
      },
      {
        q: "Who owns the code?",
        a: "You do. Repository, infrastructure accounts and deployment pipeline are set up in your name from the start, not migrated at the end.",
      },
    ],
    related: ["nextjs-development", "ai-engineering"],
  },
  {
    slug: "ecommerce-development",
    name: "E-commerce engineering",
    title: "E-commerce and payments engineering that survives its edge cases",
    description:
      "Storefronts, checkout and settlement built for the cases that lose money: duplicate webhooks, out-of-order events, refunds, subscriptions and catalogue scope per market.",
    serviceType: "E-commerce development",
    headline: ["Checkout that survives", "its own edge cases"],
    accent: "edge cases",
    answer:
      "E-commerce engineering here focuses on the parts that lose money quietly: settlement, refunds, subscriptions and catalogue scope. Faizan Amir has built commerce platforms with an eight-layer payment guard, dual settlement paths so a dropped browser never loses an order, and Royal Mail despatch writing tracking straight back onto the order.",
    includes: [
      {
        title: "Dual-path settlement",
        body: "The client confirms with the payment provider and the backend records it immediately; the webhook then arrives and reconciles. A closed tab or a dead connection does not cost you the order.",
      },
      {
        title: "Eight layers of payment guard",
        body: "Signature verification, ownership and amount checks, idempotency keys, unique transaction indexing, replay protection and a status machine that refuses to go backwards.",
      },
      {
        title: "Merchandising without a deploy",
        body: "Hero, banners, feature bars, FAQs and testimonials as CMS collections rather than components, with typed contracts so a missing field degrades instead of breaking the page.",
      },
      {
        title: "Market-scoped catalogue",
        body: "Catalogue scope derived from host and market and enforced again at checkout, so local and global products cannot leak across storefronts.",
      },
      {
        title: "Fulfilment wired to the carrier",
        body: "Despatch through the carrier’s API — labels generated, tracking written back onto the order — so approved goes to shipped without anybody creating labels by hand.",
      },
    ],
    process: [
      {
        step: "Model the order",
        body: "Statuses, transitions, and the branches for refund, cancellation and subscription renewal. Everything downstream is easier once the order has one definition.",
      },
      {
        step: "Assume events lie",
        body: "Build settlement expecting duplicates, late arrivals and mismatched amounts, then test that specifically. On WisdomUp that is 14 dedicated settlement tests.",
      },
      {
        step: "Separate the services",
        body: "Storefront, transactional API and CMS admin deployable on their own with bounded ownership, so a content change cannot take down checkout.",
      },
      {
        step: "Connect fulfilment",
        body: "Carrier integration, label generation and tracking sync, plus the operational views to see where an order actually is.",
      },
      {
        step: "Watch the funnel",
        body: "Checkout success rate, reconciliation accuracy and promo conversion instrumented, because reliability you cannot observe is a hypothesis.",
      },
    ],
    evidence: [
      {
        slug: "wisdomup",
        project: "WisdomUp",
        claim:
          "Three deployable services, dual settlement paths, eight payment guard layers and 39 backend route handlers across ten route files.",
      },
      {
        slug: "volumize",
        project: "Volumize",
        claim:
          "Telehealth commerce with medical intake, doctor approval, prescription generation, Stripe payments, Royal Mail despatch and subscription renewal in one lifecycle.",
      },
    ],
    stack: [
      "Next.js",
      "Express 5",
      "MongoDB",
      "Payload CMS",
      "Stripe",
      "Redux Toolkit",
      "RTK Query",
      "Zod",
      "Royal Mail API",
    ],
    faqs: [
      {
        q: "Shopify or a custom build?",
        a: "Shopify wins when the catalogue is standard and the checkout is standard. Custom wins when the order is not really an order — medical intake before purchase, clinical approval mid-flow, market-scoped catalogues, or subscription logic the platform will not model. Volumize and WisdomUp are both the second case.",
      },
      {
        q: "How do you stop duplicate charges and lost orders?",
        a: "Idempotency keys and a unique transaction index stop duplicates; dual settlement stops losses. The client path records the payment immediately and the webhook reconciles it afterwards, with a monotonic status so the late event cannot regress an order that has already shipped.",
      },
      {
        q: "Can you integrate a carrier or a fulfilment partner?",
        a: "Yes. The Volumize despatch flow generates labels through the Royal Mail API and writes tracking back onto the order, so fulfilment status lives in the same lifecycle as the payment rather than in somebody’s inbox.",
      },
    ],
    related: ["api-and-backend-development", "saas-mvp-development"],
  },
];

export const getService = (slug?: string) => services.find((s) => s.slug === slug);
