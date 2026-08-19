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
  revitalize: "/projects/revitalize.svg",
  wisdomup: "/projects/wisdomup.svg",
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
    slug: "revitalize",
    index: "04",
    name: "Revitalize",
    accentWord: "Revitalize",
    tagline: "Telehealth E-Commerce Platform",
    summary:
      "A telehealth commerce platform for hair-loss treatment — medical intake, doctor approval, prescriptions, payments, and subscriptions in one lifecycle across two apps.",
    role: "Full-Stack Engineer",
    timeline: "2026 – Present",
    status: "Production",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "MongoDB",
      "Mongoose",
      "Socket.IO",
      "DNA Payments",
      "AWS S3",
      "Turborepo",
    ],
    indexMetrics: ["94 API routes", "-97% vulnerabilities", "2 apps · 3 packages"],
    image: img.revitalize,
    alt: "Revitalize telehealth commerce dashboard",
    problemHeadline: "Intake and checkout live in different systems",
    problem:
      "A hair-loss treatment journey usually runs across disconnected tools. Medical intake sits apart from the purchase flow, clinical approval and prescription handoff are manual, and order, subscription, and refund operations are scattered — which makes payments hard to reconcile and leaves nobody with a view of the whole journey.",
    approach:
      "Put the whole lifecycle behind one architecture: a Turborepo monorepo with a customer app and an operational back office, sharing auth, data models, and UI so the two surfaces cannot drift apart.",
    decisions: [
      "Split the product into a customer app and an admin app over three shared packages — auth, db, ui — so session logic and domain models have exactly one definition.",
      "Issued separate session tokens for users and admins rather than one shared trust boundary, keeping role-scoped checks simple and the blast radius small.",
      "Modelled the order lifecycle as explicit statuses and transitions, connecting questionnaire, doctor review, prescription generation, and fulfilment into one traceable pipeline.",
      "Kept refunds executing against the same DNA Payments environment as the original transaction, so payment operations reconcile instead of drifting.",
      "Made product pages config-driven, so merchandising changes are composition rather than layout rewrites.",
      "Wired Socket.IO for event-driven status updates, giving doctors and admins live operational visibility.",
    ],
    diagram: {
      src: img.diagram,
      alt: "Revitalize monorepo: user and admin apps over shared auth, db and ui packages",
      caption: "* MONOREPO + TREATMENT LIFECYCLE",
    },
    build: [
      {
        title: "Two apps, one domain layer",
        body: "The customer app and the back office are separate deployments over shared auth, database, and UI packages. Fifteen Mongoose models live in one place, so an order means the same thing on both sides of the platform.",
        image: img.revitalize,
        alt: "Revitalize monorepo structure",
      },
      {
        title: "Intake to delivery, as one pipeline",
        body: "Signup leads into a medical questionnaire, then checkout, then doctor review. Approval generates a prescription PDF and hands off to the pharmacy; rejection stops the order. Delivery rolls into the subscription renewal cycle, and refunds are a modelled branch rather than an afterthought.",
        image: img.diagram,
        alt: "Treatment and commerce lifecycle flow",
      },
      {
        title: "Security hardening pass",
        body: "A phased dependency remediation — non-breaking fixes first, breaking upgrades second — prioritising routing, middleware, email transport, and the parsing and network stack. Next.js moved to 16.3.0 and Nodemailer to 9.0.4, clearing every high and moderate finding across a 1,127-package graph.",
        image: img.terminal,
        alt: "Dependency audit output",
      },
    ],
    metrics: [
      { value: "94", caption: "API route files", note: "* 46 user · 48 admin" },
      { value: "-97%", caption: "Vulnerabilities", note: "* 34 down to 1" },
      { value: "99", caption: "Audit score / 100", note: "* up from 18" },
      { value: "0", caption: "High & moderate findings", note: "* was 22 high, 8 moderate" },
    ],
    reflection:
      "The security work was reactive — 34 findings had already accumulated before anyone went looking. The fix was a one-off cycle when it should have been a gate: audit thresholds in CI, so the graph never drifts that far again. Cutting vulnerabilities by 97% reads well, but not having needed to reads better.",
  },
  {
    slug: "wisdomup",
    index: "05",
    name: "WisdomUp",
    accentWord: "WisdomUp",
    tagline: "Multi-Service E-Commerce Platform",
    summary:
      "A three-service commerce platform — storefront, transactional API, and CMS admin — built around checkout that survives its own edge cases.",
    role: "Full-Stack Product Engineer",
    timeline: "2026 – Present",
    status: "In development",
    inDevelopment: true,
    stack: [
      "Next.js",
      "TypeScript",
      "Express 5",
      "MongoDB",
      "Payload CMS",
      "Stripe",
      "Redux Toolkit",
      "RTK Query",
      "Zod",
    ],
    indexMetrics: ["3 services", "8-layer payment guard", "14 settlement tests"],
    image: img.wisdomup,
    alt: "WisdomUp storefront and admin dashboard",
    problemHeadline: "Checkout breaks in the edge cases",
    problem:
      "E-commerce builds tend to fail in the same three places. Content changes need a developer, so campaigns wait on deploys. Payment edge cases — duplicate webhooks, events arriving out of order, amounts that do not match — turn into real financial risk. And a monolith makes both problems harder to fix safely.",
    approach:
      "Separate the three concerns into independently deployable services, then treat settlement as a distributed-systems problem rather than a happy path: assume events arrive twice, late, or out of order, and make the order state machine refuse to go backwards.",
    decisions: [
      "Split into a storefront, an Express transactional API, and a Payload CMS admin, each deployable on its own with bounded ownership over a shared database.",
      "Settled payments down two paths — immediate confirmation after client success, plus a webhook fallback — so a dropped browser never loses an order.",
      "Guarded settlement with signature verification, ownership and amount checks, idempotency keys, unique transaction indexing, and replay protection.",
      "Enforced monotonic order status, so a stale webhook cannot regress an order that has already moved on.",
      "Derived catalog scope from host and market, enforced again at checkout, so local and global products cannot cross storefronts.",
      "Drove homepage sections, navigation, FAQs, and testimonials from the CMS with typed contracts and defensive rendering, so a missing field degrades instead of breaking the page.",
    ],
    diagram: {
      src: img.diagram,
      alt: "WisdomUp services: storefront, Express API, Payload CMS, Stripe and MongoDB",
      caption: "* THREE SERVICES + DUAL SETTLEMENT",
    },
    build: [
      {
        title: "Two paths to settled",
        body: "The client confirms with Stripe and the backend records it immediately. The webhook then arrives and reconciles — verifying signature, checking the amount and owner, deduplicating on a unique transaction index, and refusing any event that would move the order backwards. Fourteen tests cover that logic specifically.",
        image: img.wisdomup,
        alt: "Checkout and settlement flow",
      },
      {
        title: "Merchandising without a deploy",
        body: "Hero, banners, feature bars, FAQs, and testimonials are CMS collections, not components. Eleven admin collections plus site settings and navigation as editable globals mean a campaign change is an edit, not a release — with CSV product import for bulk catalog work.",
        image: img.diagram,
        alt: "Payload CMS collections and globals",
      },
      {
        title: "Storefront surface",
        body: "Listing and detail flows with category filtering and search, cart and wishlist, guest checkout with resumable session state, promo codes validated server-side for eligibility and discount, and reviews rendered moderation-aware. Fifty components across twenty-three route directories.",
        image: img.terminal,
        alt: "Storefront routes and components",
      },
    ],
    metrics: [
      { value: "3", caption: "Deployable services", note: "* storefront · API · CMS" },
      { value: "8", caption: "Payment guard layers", note: "* signature to state machine" },
      { value: "14", caption: "Settlement tests passing", note: "* confirmation logic" },
      { value: "39", caption: "Backend route handlers", note: "* across 10 route files" },
    ],
    reflection:
      "Everything measurable here is about the build, not the business. The payment layer is hardened and tested, but checkout success rate, reconciliation accuracy, and promo conversion are still targets rather than readings — I set them without shipping the instrumentation to answer them. Reliability engineering you cannot observe in production is a hypothesis, and I would wire the funnel telemetry before adding another feature.",
  },
  {
    slug: "alfa",
    index: "06",
    name: "Alfa",
    accentWord: "Alfa",
    tagline: "Multi-Role Fintech Frontend",
    summary:
      "A role-aware fintech frontend serving personal, business, and admin journeys from one architecture — onboarding, transfers, scheduled payments, and card management.",
    role: "Frontend Engineer — architecture & implementation",
    timeline: "2026 – Present",
    status: "In development",
    inDevelopment: true,
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Redux Toolkit",
      "RTK Query",
      "Zod",
      "Tailwind v4",
      "AWS S3",
    ],
    indexMetrics: ["3 user roles", "7 API domains", "4 route groups"],
    image: img.alfa,
    alt: "Alfa fintech dashboard",
    problemHeadline: "Three roles, one routing surface",
    problem:
      "Fintech products tend to break down exactly where account setup and role switching meet. A user can hold both a personal and a business account with no session chosen yet, or be mid-onboarding — and every page that guesses at that state becomes another place for the routing to go wrong.",
    approach:
      "Split the auth decision in two. Middleware does one cheap thing at the edge — check a token exists. Everything conditional (role, session, onboarding completeness) resolves on the client against a single bootstrapped user object, so the rules live in one guard instead of scattered across pages.",
    decisions: [
      "Kept middleware to a token-presence gate; role and session rules run in a RequireAuth guard against Redux state.",
      "Bootstrapped the session once from /auth/user/me into a userSlice, making it the single source of truth for the app.",
      "Used one RTK Query baseApi with domain endpoints injected per feature, so seven API areas share one reducer, one middleware, and one cache.",
      "Routed onboarding by account type, letting the guard redirect incomplete journeys instead of each page checking for itself.",
      "Handled S3 document upload and delete inside Next.js route handlers with AWS SDK v3, keeping credentials server-side.",
      "Validated forms with Zod schemas shared between onboarding and dashboard flows.",
    ],
    diagram: {
      src: img.diagram,
      alt: "Alfa auth flow: middleware token gate, user bootstrap, role and session guard",
      caption: "* AUTH + SESSION RESOLUTION",
    },
    build: [
      {
        title: "Hybrid auth model",
        body: "Login optionally passes through 2FA before an access token lands in a cookie. A bootstrap provider then fetches the user once and hands Redux the session. From there the guard resolves one of four outcomes — admin area, dashboard, onboarding, or an account selector when someone holds both account types and has not picked a session.",
        image: img.alfa,
        alt: "Alfa authentication and session flow",
      },
      {
        title: "One API, seven domains",
        body: "Rather than a slice per feature, a single baseApi is created once and each domain injects its own endpoints: auth, business, cards, transactions, schedules, wallet, admin. Adding an endpoint means touching one file and getting caching, tag invalidation, and generated hooks for free.",
        image: img.diagram,
        alt: "RTK Query base API with injected domain endpoints",
      },
      {
        title: "Money movement surfaces",
        body: "Transfers for personal and business contexts, payment requests, calendar-driven scheduled payments, transaction history, and card issuing and assignment — each built from shared layout shells and form primitives so a new dashboard screen starts from composition rather than scratch.",
        image: img.terminal,
        alt: "Alfa dashboard modules",
      },
    ],
    metrics: [
      { value: "3", caption: "User roles served", note: "* personal · business · admin" },
      { value: "7", caption: "API domains", note: "* one injected base API" },
      { value: "4", caption: "Route groups", note: "* auth · dashboard · onboarding · admin" },
      { value: "WIP", caption: "In active development", note: "* not a finished claim" },
    ],
    reflection:
      "The architecture is sound but under-tested for what it is. Money movement and auth are exactly the paths that deserve integration and end-to-end coverage, and right now correctness rests on the guard logic being right rather than on anything proving it. That is the next thing I would build, before analytics on onboarding drop-off or feature flags for staged rollout.",
  }
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
