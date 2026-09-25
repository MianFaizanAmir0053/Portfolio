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
    title: "AI engineering — RAG, agents, LLM features",
    description:
      "RAG pipelines, agentic workflows and LLM features for production: retrieval that keeps document structure, evaluation before tuning, humans in the loop.",
    serviceType: "AI and LLM application development",
    headline: ["AI that survives", "contact with production"],
    accent: "production",
    answer:
      "Faizan Amir builds production RAG pipelines, agent workflows and LLM features with evaluation, observability and human approval where risk demands it. Five or more RAG and agentic systems have reached production, including legal-document extraction measured at 95% accuracy on its evaluated set.",
    includes: [
      {
        title: "Retrieval that preserves structure",
        body: "Chunks follow the document hierarchy and retain their ancestry, so retrieved passages arrive with enough context to interpret and cite correctly.",
      },
      {
        title: "Agent workflows with real routing",
        body: "A classifier routes each input to a focused agent with its own tools and validation schema instead of forcing every document through one prompt.",
      },
      {
        title: "Evaluation before tuning",
        body: "A scored regression set makes pipeline changes measurable. On mailagent, still in build, the harness reached 92.9% exact-match extraction on 14 hand-labelled fixtures and 100% retrieval hit@5 across 29 queries.",
      },
      {
        title: "Human-in-the-loop gates",
        body: "Actions that change calendars, documents or customer records pause for approval as an explicit step in the agent graph.",
      },
      {
        title: "Honest cost accounting",
        body: "Model calls track tokens, latency and price. Unknown cost remains NULL rather than becoming a misleading zero.",
      },
    ],
    process: [
      {
        step: "Scope the failure mode",
        body: "Identify what the model gets wrong on real data and whether the failure belongs to retrieval, routing, validation or prompting.",
      },
      {
        step: "Build the scoring harness",
        body: "Create a labelled fixture set before tuning so every change can be compared against a stable baseline.",
      },
      {
        step: "Ship the pipeline",
        body: "Build ingestion, chunking, retrieval, routing and actions with the simplest inspectable stack that fits the product.",
      },
      {
        step: "Put a human in the path",
        body: "Require approval for irreversible actions and show the relevant trace to the reviewer.",
      },
      {
        step: "Instrument, then iterate",
        body: "Track token cost, node latency, retrieval hit rate and task accuracy from the first deployment.",
      },
    ],
    evidence: [
      {
        slug: "golegal",
        project: "Golegal",
        claim:
          "Agentic RAG for legal documents: 95% extraction accuracy on the evaluated set, 100+ files processed monthly and 30% less manual work reported by users.",
      },
      {
        slug: "muterpe",
        project: "Muterpe",
        claim:
          "Per-user model training and queued generation on Fal.ai, billed by usage and running at 99% uptime over a rolling twelve months.",
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
        a: "Retrieval-augmented generation gives a model relevant source material at query time. Use it when answers must be grounded in private or changing data, such as contracts, policies or internal knowledge. Generic writing and classification often need only a well-designed prompt.",
      },
      {
        q: "How do you stop an LLM hallucinating over my documents?",
        a: "Preserve document structure during retrieval, route document types to validated extraction paths and test against labelled fixtures. This approach produced 95% extraction accuracy on Golegal’s evaluated set.",
      },
      {
        q: "Can you add AI to an existing product rather than starting fresh?",
        a: "Yes. Most engagements add a focused pipeline and API surface to an existing backend rather than rewriting the product. Golegal and medical platforms at Ward Web Solutions followed this approach.",
      },
      {
        q: "How long does a first production RAG pipeline take?",
        a: "A scoped first version usually takes weeks and includes evaluation data, ingestion, retrieval, one validated task path and instrumentation. Preparing reliable labelled fixtures often takes longer than connecting the model.",
      },
    ],
    related: ["saas-mvp-development", "api-and-backend-development"],
  },
  {
    slug: "nextjs-development",
    name: "Next.js development",
    title: "Next.js and React product development",
    description:
      "Next.js and React front ends for products with roles, sessions and money in them. App Router, TypeScript, Redux Toolkit and RTK Query.",
    serviceType: "Frontend web development",
    headline: ["Front ends that hold", "their own state"],
    accent: "state",
    answer:
      "Faizan Amir builds Next.js and React products with complex state, including multiple roles, partial onboarding, account selection and payments. Recent work uses the App Router, TypeScript, Redux Toolkit and RTK Query across personal, business and admin journeys.",
    includes: [
      {
        title: "One guard, not fifteen",
        body: "One guard resolves role, session and onboarding state from a bootstrapped user. Middleware only checks for a token at the edge.",
      },
      {
        title: "One API layer, many domains",
        body: "Feature domains inject endpoints into one RTK Query base API, sharing a reducer, middleware, cache and invalidation model.",
      },
      {
        title: "Config-driven pages",
        body: "Typed content models and defensive rendering turn merchandising changes into data edits without letting missing CMS fields break a page.",
      },
      {
        title: "Server components where they pay",
        body: "Content renders on the server for fast delivery and crawlability; client components are reserved for genuine interaction.",
      },
      {
        title: "Motion that does not cost vitals",
        body: "Motion is deliberate, reduced-motion is respected and layout stability is treated as a requirement.",
      },
    ],
    process: [
      {
        step: "Map the states first",
        body: "Map every role, partial state and resume point before defining routes.",
      },
      {
        step: "Set the data layer",
        body: "Define one base API, typed endpoints and shared validation schemas.",
      },
      {
        step: "Build the shells",
        body: "Build layout shells and form primitives so later screens are composed rather than duplicated.",
      },
      {
        step: "Wire the guards",
        body: "Centralise authentication, onboarding and role resolution with explicit redirects.",
      },
      {
        step: "Harden and measure",
        body: "Validate accessibility and Core Web Vitals, and block releases on type or build errors.",
      },
    ],
    evidence: [
      {
        slug: "alfa",
        project: "Alfa",
        claim:
          "Multi-role fintech platform with 6+ FastAPI services behind 10+ GraphQL APIs, with authorisation enforced at both route and row level.",
      },
      {
        slug: "carder",
        project: "Carder",
        claim:
          "AI mini-site builder for 150+ users, with 40% adoption growth from its first tracked month to February 2026 and three Stripe-backed metered tiers.",
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
        a: "App Router by default, including server components, route handlers and the metadata API. Existing Pages Router products can be maintained or migrated incrementally when the benefit justifies it.",
      },
      {
        q: "Can you take over a Next.js codebase someone else started?",
        a: "Yes. The first pass maps state, routing and authentication, then audits dependencies and vulnerabilities. On Volumize, that process took the package graph from 34 findings to 1.",
      },
      {
        q: "How do you handle SEO in a heavily animated React site?",
        a: "Render meaningful content, headings and structured data on the server, then attach animation after hydration. The page remains understandable and indexable without animation or client-side content creation.",
      },
    ],
    related: ["saas-mvp-development", "ecommerce-development"],
  },
  {
    slug: "api-and-backend-development",
    name: "API & backend development",
    title: "API and backend development in Node.js",
    description:
      "REST and GraphQL APIs, data models and integrations built to be operated: explicit lifecycles, reconciled payments, migrations without downtime.",
    serviceType: "Backend and API development",
    headline: ["Backends built to be", "operated, not just shipped"],
    accent: "operated",
    answer:
      "Faizan Amir builds operable Node.js, Express, PostgreSQL and MongoDB backends and has built 30+ REST and GraphQL APIs across client products, including a live telehealth platform that reduced approval turnaround by 45% and despatch time by 85%, with payments reconciled against Stripe.",
    includes: [
      {
        title: "Explicit lifecycles",
        body: "Orders, prescriptions, subscriptions and refunds use explicit states and transitions. Volumize connects intake, clinical review and fulfilment in one traceable lifecycle.",
      },
      {
        title: "Payments that reconcile",
        body: "Provider-backed entitlement, webhook reconciliation, idempotency and monotonic status prevent duplicate or late events from corrupting orders.",
      },
      {
        title: "Media off the app server",
        body: "Signed S3 uploads and edge delivery keep image-heavy workloads away from application request workers.",
      },
      {
        title: "Migrations without downtime",
        body: "Expand-and-contract migrations let schemas evolve while live products keep serving users.",
      },
      {
        title: "A dependency graph you can defend",
        body: "Phased dependency remediation cleared every high and moderate finding across Volumize’s 1,127-package graph.",
      },
    ],
    process: [
      {
        step: "Model the domain",
        body: "Create one definition per entity and share it across every application that uses it.",
      },
      {
        step: "Draw the state machine",
        body: "Define statuses, allowed transitions and irreversible actions, including refunds and cancellations.",
      },
      {
        step: "Build the endpoints",
        body: "Implement validated REST or GraphQL endpoints with authorisation next to data access.",
      },
      {
        step: "Guard the money",
        body: "Add signature, ownership and amount checks, idempotency, replay protection and settlement tests.",
      },
      {
        step: "Hand over something operable",
        body: "Ship CI/CD, logs and metrics so releases and production diagnosis are routine.",
      },
    ],
    evidence: [
      {
        slug: "volumize",
        project: "Volumize",
        claim:
          "Live telehealth commerce with 250+ subscriptions and £31,000+ revenue: approval turnaround down 45%, despatch time down 85%, and 15 admin hours a week returned.",
      },
      {
        slug: "wisdomup",
        project: "WisdomUp",
        claim:
          "Eight payment guard layers, from signature verification to monotonic order state, plus 14 tests on settlement confirmation.",
      },
      {
        slug: "carder",
        project: "Carder",
        claim:
          "Zero-downtime schema evolution, reconciled Stripe subscriptions and signed S3 media delivery for a live product.",
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
        a: "REST suits most product APIs. GraphQL is useful when clients need different views across a broad data graph. In either case, validate at the boundary and authorise where data is accessed.",
      },
      {
        q: "How do you handle Stripe webhooks arriving twice or out of order?",
        a: "Verify signatures, ownership and amounts; deduplicate transactions; and reject events that would move an order backwards. Immediate confirmation plus webhook reconciliation prevents a closed browser from losing a paid order.",
      },
      {
        q: "Can you work with an existing database you did not design?",
        a: "Yes. The first step is a written model of the existing schema, followed by expand-and-contract migrations that avoid maintenance windows.",
      },
    ],
    related: ["ai-engineering", "ecommerce-development"],
  },
  {
    slug: "saas-mvp-development",
    name: "SaaS MVP development",
    title: "SaaS MVP development, end to end",
    description:
      "Full-stack SaaS builds from empty repository to paying users: auth, data model, billing, media, deployment and the instrumentation to prove it worked.",
    serviceType: "SaaS product development",
    headline: ["From empty repo", "to paying users"],
    accent: "paying",
    answer:
      "Faizan Amir builds SaaS MVPs from repository to paying users, including authentication, data, billing, storage, deployment and instrumentation. As founding engineer on an AI image platform, he helped reach 200+ users and $5,000+ in usage-based revenue at 99% uptime.",
    includes: [
      {
        title: "The whole lifecycle, not a screen",
        body: "The MVP covers signup, onboarding, the core loop, billing and the operational tools required to run it.",
      },
      {
        title: "Billing wired in early",
        body: "Meter usage before finalising pricing; retrofitting billing into a live pipeline is slower and riskier.",
      },
      {
        title: "Async by default",
        body: "Long-running training, generation, imports and exports use queues and return progress without blocking the interface.",
      },
      {
        title: "One domain layer across apps",
        body: "Customer and admin applications share auth, database and UI packages so their domain rules stay aligned.",
      },
      {
        title: "Deployment that is not a ceremony",
        body: "CI/CD and environment parity make releases repeatable from the first week.",
      },
    ],
    process: [
      {
        step: "Cut the scope to the loop",
        body: "Identify the one loop that makes the product worth paying for and build it end to end first.",
      },
      {
        step: "Model and meter",
        body: "Design the data model and usage metering together so pricing rests on real units.",
      },
      {
        step: "Build the core loop",
        body: "Build the path from signup to the core outcome, including its queue and storage needs.",
      },
      {
        step: "Add the operational surface",
        body: "Add admin views, status visibility and controlled overrides before support depends on database edits.",
      },
      {
        step: "Instrument before iterating",
        body: "Instrument the funnel at launch so adoption and retention changes can be measured.",
      },
    ],
    evidence: [
      {
        slug: "muterpe",
        project: "Muterpe",
        claim:
          "AI training and image-generation SaaS with 200+ users, $5,000+ usage-based revenue, 99% uptime, and generation that feels ~40% faster than at first release with the model unchanged.",
      },
      {
        slug: "volumize",
        project: "Volumize",
        claim:
          "Customer and operations apps over shared packages, supporting intake, prescriptions, payments, despatch and 250+ live subscriptions.",
      },
      {
        slug: "carder",
        project: "Carder",
        claim:
          "Stripe subscriptions, S3 media delivery and CI/CD added to a live product without downtime.",
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
        a: "One complete user loop with billing and an operational view. Anything outside the path from signup to the core outcome is a candidate for a later release.",
      },
      {
        q: "Do you work with founders who are not technical?",
        a: "Yes. Work starts with a plain-language model of product states, followed by usable weekly increments rather than status-only reporting.",
      },
      {
        q: "Who owns the code?",
        a: "You do. The repository, infrastructure accounts and deployment pipeline are set up in your name from the start.",
      },
    ],
    related: ["nextjs-development", "ai-engineering"],
  },
  {
    slug: "ecommerce-development",
    name: "E-commerce engineering",
    title: "E-commerce and payments engineering",
    description:
      "Storefronts, checkout and settlement built for the cases that lose money: duplicate webhooks, out-of-order events, refunds and subscriptions.",
    serviceType: "E-commerce development",
    headline: ["Checkout that survives", "its own edge cases"],
    accent: "edge cases",
    answer:
      "Faizan Amir builds e-commerce systems around settlement, refunds, subscriptions and catalogue integrity. The work includes an eight-layer payment guard, dual settlement paths that protect paid orders, and Royal Mail despatch with tracking written back to the order.",
    includes: [
      {
        title: "Dual-path settlement",
        body: "Immediate confirmation records the payment; a webhook then reconciles it. Either path can recover if the other is delayed.",
      },
      {
        title: "Eight layers of payment guard",
        body: "Signature, ownership and amount checks combine with idempotency, replay protection and monotonic order status.",
      },
      {
        title: "Merchandising without a deploy",
        body: "CMS-managed merchandising uses typed contracts and defensive rendering, so campaigns change without a release.",
      },
      {
        title: "Market-scoped catalogue",
        body: "Catalogue scope is derived from host and market, then enforced again at checkout.",
      },
      {
        title: "Fulfilment wired to the carrier",
        body: "Carrier APIs generate labels and return tracking to the order, removing manual fulfilment steps.",
      },
    ],
    process: [
      {
        step: "Model the order",
        body: "Define order states and transitions for settlement, refund, cancellation and renewal.",
      },
      {
        step: "Assume events lie",
        body: "Design for duplicate, late and mismatched events, then test those cases directly.",
      },
      {
        step: "Separate the services",
        body: "Separate storefront, transactional API and CMS ownership so content changes cannot take down checkout.",
      },
      {
        step: "Connect fulfilment",
        body: "Connect labels, tracking and operational views to the order lifecycle.",
      },
      {
        step: "Watch the funnel",
        body: "Track checkout success, reconciliation accuracy and promotion conversion from launch.",
      },
    ],
    evidence: [
      {
        slug: "wisdomup",
        project: "WisdomUp",
        claim:
          "Three deployable services with dual settlement, eight payment guard layers and 14 focused settlement tests.",
      },
      {
        slug: "volumize",
        project: "Volumize",
        claim:
          "Telehealth commerce connecting intake, clinical approval, prescriptions, Stripe payments, Royal Mail despatch and renewals.",
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
        a: "Shopify fits standard catalogues and checkout. Custom engineering is justified when the order includes clinical approval, market-specific catalogues or subscription rules the platform cannot model cleanly.",
      },
      {
        q: "How do you stop duplicate charges and lost orders?",
        a: "Idempotency and a unique transaction index stop duplicates. Immediate confirmation plus webhook reconciliation prevents lost orders, while monotonic status rejects stale events.",
      },
      {
        q: "Can you integrate a carrier or a fulfilment partner?",
        a: "Yes. Volumize generates Royal Mail labels and writes tracking back to the order, keeping fulfilment and payment in one lifecycle.",
      },
    ],
    related: ["api-and-backend-development", "saas-mvp-development"],
  },
];

export const getService = (slug?: string) => services.find((s) => s.slug === slug);
