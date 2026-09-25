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

- Removed the Education and Other Work sections, which duplicated About and Work, and moved Coming Soon and Beyond Code off the homepage.
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
- Restored the Instagram link alongside the concise Beyond Code details on About.

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

## Corrections After Fact Audit

A diff audit against the pre-rewrite copy found meanings that had shifted during tightening. These were corrected:

- Golegal services: fees are a fixed fee plus VAT, matching the screenshot, not "include VAT".
- Carder quotas: Free gets 5 AI generations in its first month only, then Pro 10 and Business 30 a month, matching the public pricing page.
- Restored dropped qualifiers: Golegal's evaluated set was small; Volumize's percentages are before-and-after on the same flow, not controlled experiments; Muterpe's uptime is over a rolling twelve months and its ~40% is perceived speed with the model unchanged.
- Card, OG and meta metrics now carry their qualifiers: "95% accuracy, eval set", "−30% manual work, user-reported", "+40% adoption vs first tracked month".
- Wanile metrics are attributed to the work that produced each one again; "led 8+ projects" is back to "led development across 8+ projects".
- Services evidence no longer credits Muterpe as an AI retrofit, describes Alfa's security as route- and row-level authorisation, scopes the 14 tests to settlement confirmation, and marks mailagent as in build.
- `/llms-full.txt` now emits each case study's team, ownership and not-mine limits; both AI routes describe figures as platform records, user reports or build counts.
- Remaining US spellings (subsidize, monetized, backward, dispatch) now follow the British copy.
- Service FAQ headings keep acronym capitals ("Questions about AI engineering").
- Confirmed with the author: the 30+ APIs are a career total, so the count no longer appears on the Ward Web Solutions entry; Nazadv's 20+ shipped features are the team's, 15+ his own; Golegal's canonical URL is go-legal.ai in the footer and marquee too.

Code fixes from the same review:

- Accordion panels fade in with a 4px drop instead of a height keyframe, which snapped open because forceMount means Radix never measures the panel. The old `motion-reduce:animate-none` lost to the open animation in the cascade; reduced motion now keeps the fade and drops the movement. The trigger transitions colours only, so the focus ring appears instantly.
- ScrollTrigger re-measures when `<main>` changes height, so opening or closing FAQ answers no longer shifts the Contact headline's scrub range and leaves its words hidden.
- Tailwind no longer scans `.agents/` and `.claude/`, whose skill docs were adding unused utilities to the CSS (about 13 KB).

## Funnel Changes

Inside the existing theme, with no change to colours, type, components or motion:

- The hero offers two doors under the intro: "Have a project? Start here" (to the contact page) and "Hiring? Get my resume" (the PDF), in the site's existing primary and outline button styles.
- The homepage leads with proof: Hero → Featured work → Experience → About → Stack → Reach → FAQ → Contact. Section labels and the dock follow the new order ([02] Experience, [03] About, [04] Stack), and the Experience rail now ends on the résumé rather than pointing back up at the work.
- Every case study ends with the existing call-to-action band ("Start a project", "Download resume") before the next case study.
- The homepage and contact page group contact options by reader: [PROJECTS] (form, email, WhatsApp) and [HIRING] (résumé, LinkedIn, GitHub).
- The four case studies without screenshots (Volumize, Alfa, WisdomUp, Muterpe) use their own architecture diagrams as covers instead of placeholder graphics, with accurate alt text; the case-study page does not repeat the diagram further down.
- The phone number is shown in international form, +92 303 0649009.

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
