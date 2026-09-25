# Portfolio Content and SEO Changes

## Purpose

This branch makes the portfolio easier to scan without weakening its search visibility or technical credibility. The content was edited for a balanced audience of hiring teams and prospective clients, with Faizan Amir positioned as a senior full-stack and AI engineer.

The main goals were:

- Reduce visible copy by roughly 30-40% where content was repetitive.
- Keep evidence-backed metrics, technical decisions, and project caveats.
- Move secondary detail into accessible accordions.
- Preserve indexable text, metadata, structured data, internal links, and AI-readable routes.
- Make the homepage a focused entry point to the deeper About, Work, and Services pages.

## Content Changes

### Homepage

- Removed duplicated Education, Other Work, Coming Soon, and Beyond Code sections from the homepage.
- Kept the primary journey: introduction, about, skills, experience, reach, featured work, FAQ, and contact.
- Shortened FAQ answers while retaining the main role, technology, location, availability, and project evidence.
- Corrected the dock navigation after the section removal.
- Moved unique content to the pages that own it:
  - Personal interests now appear on About.
  - The mailagent project now appears on Work.

### About and Contact

- Rewrote the bio and role summaries in a more direct, technically credible voice.
- Removed repeated explanations about availability, geography, and working style.
- Kept role history, education, markets, technologies, and measurable outcomes.
- Added accordions to secondary FAQ answers.
- Restored the Instagram link alongside the concise Beyond Code details.

### Services

- Tightened all five service records:
  - AI engineering
  - Next.js development
  - API and backend development
  - SaaS MVP development
  - E-commerce engineering
- Preserved natural search phrases such as RAG, agent workflows, Next.js, API development, SaaS MVP, Stripe, and e-commerce.
- Reduced repeated case-study narration in service evidence blocks.
- Kept process steps and proof visible.
- Moved service inclusions and FAQs into accordions.
- Updated service headings so the offered service is explicit in each H1.

### Case Studies

- Reworked all six case studies so each section adds a distinct fact or decision.
- Removed repeated rationale across the problem, approach, decisions, trade-offs, build, and reflection sections.
- Preserved:
  - Project status and ownership boundaries
  - Constraints and rejected alternatives
  - Architecture decisions
  - Production failures and fixes
  - Metrics and measurement caveats
  - Honest pre-production labels for WisdomUp and Alfa
- Added accordions for constraints, trade-offs, and failure details.
- Kept summaries, approach, build sections, outcomes, metrics, and provenance visible.
- Removed duplicate WisdomUp and Muterpe entries from the secondary Work list.

## Accordion and Accessibility Changes

The shared accordion component now force-mounts closed content. This is important because Radix normally removes closed panel content from the server-rendered markup.

The implementation now provides both behaviors:

- Closed panels remain present in the HTML for search and AI extraction.
- Closed panels remain visually hidden and inaccessible to assistive technology until opened.

The accordion implementation also:

- Avoids fixed measured heights that clipped open content after viewport resizing.
- Respects reduced-motion preferences.
- Preserves keyboard interaction and `aria-expanded` state.
- Keeps concise titles visible while moving supporting detail into the panel.

## SEO and AI Search Safeguards

The branch preserves or improves the following:

- One H1 per page.
- Unique page titles and meta descriptions.
- Canonical URLs.
- Breadcrumb and page structured data.
- `Person`, `WebSite`, `FAQPage`, `Service`, `CreativeWork`, and `ItemList` schema where applicable.
- Server-rendered content rather than client-created SEO copy.
- Internal links between Home, Work, Services, About, Contact, case studies, and service pages.
- Explicit project status so in-development systems are not described as shipped outcomes.
- Metric provenance and limitations.
- AI-readable `/llms.txt` and `/llms-full.txt` routes.

`/llms-full.txt` now includes case-study constraints, trade-offs, failures, and metric methodology. The AI routes also avoid listing case studies a second time under Also Shipped.

## Factual Integrity

The rewrite does not intentionally invent or inflate metrics. Evidence-backed claims remain qualified where needed, including:

- Carder adoption growth and its instrumented time window.
- Golegal extraction accuracy being limited to the evaluated set.
- Golegal manual-work reduction being user-reported.
- Muterpe's perceived-speed improvement not being model throughput.
- WisdomUp and Alfa having implementation evidence but no production outcome data yet.
- Volumize before-and-after operational measurements not being controlled experiments.

Several facts that were nearly lost during editing were explicitly retained, including the medical-platform scope at Ward Web Solutions, 50+ issues closed at Wanile, 15 admin hours per week returned on Volumize, and 20+ shipped features at Nazadv.

## Additional Fixes From Review

A second review identified and corrected:

- Collapsed copy existing only in Next.js script payloads instead of real page markup.
- Accordion content clipping after responsive viewport changes.
- A stale homepage dock link to a removed section.
- Missing bio words used as animation anchors.
- Mixed American and British spelling.
- A dependency-severity label that was not supported by the source content.
- Run-together text extraction in animated multi-line headings.
- A service-link row sitting outside the page gutter.
- Duplicate case-study entries on the Work and AI-readable pages.
- Missing measurement context in `llms-full.txt`.

## Files Changed

The implementation changes are concentrated in:

- `src/data/experience.ts`
- `src/data/projects.ts`
- `src/data/services.ts`
- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/services/page.tsx`
- `src/app/services/[slug]/page.tsx`
- `src/app/work/page.tsx`
- `src/app/work/[slug]/page.tsx`
- `src/app/llms.txt/route.ts`
- `src/app/llms-full.txt/route.ts`
- `src/components/ui/accordion.tsx`
- `src/components/site/DockNav.tsx`
- `src/components/site/scroll-fx.tsx`
- `src/lib/site.ts`

## Validation Performed

The reviewed version was checked with:

- Full ESLint run.
- TypeScript and Next.js production build.
- Static generation of all 33 outputs.
- Canonical, metadata, H1, and structured-data checks across representative routes.
- Raw server-HTML checks with script tags removed.
- Desktop and mobile horizontal-overflow checks.
- Accordion open, close, keyboard, and resize behavior.
- Animation-anchor and homepage-dock target checks.
- AI-readable output checks for complete metric methodology and no duplicate project entries.

The local production build used for verification was served from `http://127.0.0.1:3000`.
