# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary audiences, served equally, each with an explicit path from the first screen:

- **Hiring teams**: recruiters and engineering managers evaluating Faizan Amir for a senior full-stack or AI engineering role. Success is an interview request or a résumé download.
- **Clients**: founders and teams hiring a contractor for scoped builds, embedded contract work or technical audits. Success is a project enquiry.

Both come from the United States, United Kingdom, Middle East and Europe. He works remotely from Lahore, Pakistan (UTC+5).

## Product Purpose

The personal portfolio and services site of Faizan Amir, a senior software engineer building full-stack and AI products with React, Next.js, TypeScript, Node.js and Python. It exists to turn a visit into an interview or a project conversation by showing production work that a sceptical reader can verify.

## Positioning

Confirmed by the author, all three together:

- **Production AI, measured.** Shipped RAG and agent systems with sourced results: evaluation sets, provenance notes, and what each number does and does not mean.
- **End-to-end ownership.** Backend, billing, payments and infrastructure on live products, not isolated features.
- **Engineering honesty.** Each case study states what he owned and what he did not, what broke, and what he would do differently.

## Operating Context

From the repository:

- Six case studies: Carder, Volumize, Golegal and Muterpe are live; Alfa and WisdomUp are in development and report build evidence, not outcomes. mailagent is in build; LightspeedGo is listed under Also shipped.
- Five service pages: AI engineering, Next.js development, API and backend development, SaaS MVP development, e-commerce engineering. Plus About, Contact and Work.
- Search and AI answer engines are first-class readers: server-rendered copy, one H1 per page, canonical URLs, JSON-LD (`Person`, `WebSite`, `FAQPage`, `Service`, `CreativeWork`, `ItemList`, breadcrumbs), and `/llms.txt` and `/llms-full.txt`.

## Capabilities and Constraints

- Next.js 16 App Router, Tailwind CSS v4, deployed on Vercel at faizan-dev.vercel.app.
- Contact paths: form (with Turnstile), email, WhatsApp, LinkedIn, GitHub, résumé PDF.
- Every metric is shown with its provenance and qualifier; in-development projects never claim outcomes.
- FAQ answers mirror the `FAQPage` structured data and must stay in the server-rendered HTML.
- British spelling throughout.
- Undecided:
  - the one site-wide descriptor ("senior software engineer" or "senior full-stack and AI engineer");
  - Golegal's audience (consumers or legal professionals);
  - the source for Volumize's "15 admin hours a week";
  - the pre-November-2022 experience that supports "4+ years", which the site does not yet list.

## Brand Commitments

- Name: Faizan Amir. Voice: plain, specific, first person in the bio and case studies.
- Contact email stays faizanamir0053@gmail.com.
- The current visual theme is binding and final: the dark ground, lime accent, Bebas Neue display with Instrument Serif accent words, bracketed labels, pixel portrait, curtains and scroll effects all stay. Improvements are content, section order and conversion flow inside this theme, never a restyle, unless the author asks for one in so many words.

## Evidence on Hand

- Case studies with metrics and method notes: `src/data/projects.ts`.
- Screenshots: Carder (`public/projects/carder-*.png`) and Golegal (`public/projects/golegal-*`).
- Architecture diagrams for all six projects (`public/projects/*-architecture.svg`, `*-lifecycle.svg`, `*-services.svg`, `*-settlement.svg`, `*-pipeline.svg`, `golegal-rag.svg`).
- Coming: real or redacted screenshots for Volumize, Alfa, WisdomUp and Muterpe.
- Obtainable, not yet on hand: two or three attributed testimonials. None exist in the repository; do not invent them.
- Absent: client logos, press. Do not fabricate.

## Product Principles

1. Proof before description: the work and its measured results lead; self-description follows.
2. Every number is sourced and qualified where it is shown, not only on the detail page.
3. Two audiences, two doors: the hiring path and the project path stay explicit and equal.
4. Honest scope: owned versus not his, live versus in development, stated plainly.
5. Readable by machines as well as people: server-rendered, structured, and AI-readable.
