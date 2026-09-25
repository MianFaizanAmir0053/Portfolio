---
target: homepage and key pages
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
target_identity: "file:C:\\Users\\faiza\\OneDrive\\Desktop\\Portfolio\\src\\app\\page.tsx"
target_fingerprint: "sha256:67acc98ccfeff4cc5301b0f7137426d0d6ca52747f57aac60b36ffb9a5324834"
target_path: "C:\\Users\\faiza\\OneDrive\\Desktop\\Portfolio\\src\\app\\page.tsx"
timestamp: 2026-09-25T18-36-47Z
slug: src-app-page-tsx
---
# Critique — homepage (src/app/page.tsx) + /work, /work/carder, /services/ai-engineering, /about

Method: dual-agent (A: isolated design-review agent · B: isolated detector agent). Browser pane hidden during run; scroll/motion timings derived from source.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Scramble flashes false metric values ("968+", "265+"); invalid fields show no state change |
| 2 | Match System / Real World | 2 | "REPLACE IN /public/projects" visible on cards; third-person FAQ; local-format phone |
| 3 | User Control and Freedom | 3 | Two pins (~1.8k/1.9k px) + Lenis inertia hold skimmers |
| 4 | Consistency and Standards | 2 | Mobile sheet repeats Work/About with different targets; numbering skips; lime = link/status/error/success |
| 5 | Error Prevention | 3 | Solid form; no draft persistence |
| 6 | Recognition Rather Than Recall | 3 | Rail tiles numerals only; labels on mouse hover, not keyboard focus |
| 7 | Flexibility and Efficiency | n/a | Portfolio, no repeated tasks |
| 8 | Aesthetic and Minimalist Design | 2 | Same 3 facts restated 6+ times; constant above-fold motion; 157/391 text runs are 12px caps |
| 9 | Error Recovery | 3 | Plain field-level errors, same lime as success |
| 10 | Help and Documentation | n/a | FAQs act as help |
| **Total** | | **21/32 (66%)** | **Acceptable** |

## Design Specificity Verdict

LLM: words authored (OWNED / NOT MINE, method notes, employer-labelled market map); visuals category kit (near-black + acid lime, Bebas caps + italic serif accent x17, bracket labels, marquees, floating dock, dotted map, pinned lit text). Nothing visual drawn from the domain (retrieval, evals, pipelines) though case studies hold architecture diagrams and eval numbers.

Deterministic: CLI 0 findings (61 files). Browser 143 findings on 5 pages, 11 advisory: all-caps-body 52, kicker-above-heading 28, tight-leading 13, clipped-overflow 10, image-hover-transform 10 (adv), low-contrast 7, italic-serif-display 6, line-length 5, buried-raster 5, heading-rhythm 3, oversized-h1 1, undersized-ui-text 1, layout-transition 1, em-dash 1 (adv). False positives: outline numerals (low-contrast), marquee (display type), CutFrame parallax clip, dock grain, FAQ header rhythm, stroke-width transition, self-detected overlay glow. Real: resume text 10px (page.tsx:274); 93–116 char lines (work/page.tsx:108, about/page.tsx:118, services/[slug]/page.tsx:141, work/page.tsx:224, work/[slug]/page.tsx:464); 12px/1.2 byline (globals.css:174). Detector missed placeholder art and scramble.

## Overall Impression

Strong writing, generic heavy wrapper. Biggest opportunity: real proof first, faster feel.

## What's Working

- Case-study provenance system (OWNED / NOT MINE, method notes, review dates).
- Locked 6-token palette, measured contrast (ink-muted 7.7:1, lime 17:1), zero radius + diagonal cuts applied consistently.
- Accessibility groundwork: skip link, 2px focus ring, reduced-motion path for every effect.

## Priority Issues

1. [P0] Placeholder art in the proof — Volumize, Alfa, WisdomUp, Muterpe covers are placeholder SVGs reading "PLACEHOLDER / REPLACE IN /public/projects" (src/data/projects.ts:13-16); 2 of 4 featured homepage cards; case-study heroes. Alt text describes dashboards not shown. Forced grayscale on touch (primitives.tsx:337). Fix: point to authored diagrams (volumize-lifecycle.svg, alfa-services.svg, wisdomup-settlement.svg, muterpe-pipeline.svg), fix alts, drop grayscale; later real screenshots. Command: $impeccable harden
2. [P1] Proof buried, hero has no action — first case study ~7,100px down (~58% of page) after About (pinned), Skills, Experience (pinned), Reach. Hero actions: [SCROLL] + 10px resume sticker. Case studies end with no hire CTA. Fix: Hero → proof strip → Featured work → Experience → About → FAQ → Contact; Reach into Experience; hero CTAs "View case studies" / "Start a project"; CTA after "Honestly". Commands: $impeccable layout, $impeccable distill
3. [P1] Motion weighs on the most frequent input — Lenis lerp 0.09 (~1s glide per wheel notch); anchors ~89px off (scroll-padding + offset double-subtract, traced in source); load curtain ~1s hides h1 reveal; lime route wipe ~570ms each navigation; 350ms lift on keyboard focus. Fix: remove Lenis and both curtains. Commands: $impeccable animate, $impeccable quieter
4. [P1] Mobile traps — Experience carousel shows 8px peek + "KEEP SCROLLING →", vertical scroll skips roles; no menu until 80px scroll (UtilityBar.tsx:71, DockNav.tsx:58); 32/34 links on /work/golegal under 24px. Fix: stack mode on small screens, 44x44 menu button from first paint, min-h-11 links. Command: $impeccable adapt
5. [P2] System dilution — lime carries ~12 roles incl. error + success; every CTA a 12px caps label; serif accent x17; labels in proportional Barlow while Geist Mono unused; scramble shows false digits. Fix: lime for actions/data only, errors #ff4d4d, 3 button tiers at 13–14px, accent max once per page, mono labels, static or monotonic numbers. Commands: $impeccable typeset, $impeccable colorize

## Persona Red Flags

Jordan: no labelled hero action; rail "01"–"06" unlabelled; availability answer collapsed third-person ~12 screens down; mailagent jargon (RRF, hit@5, tsquery) unexplained.
Riley: placeholder text; numbers change before settling; overlapping roles with no full-time/contract tag; "(27) tools" omits MongoDB, FastAPI, Supabase, LangGraph, pgvector used in case studies.
Casey: carousel trap; no menu on load; small tap targets; contact ~screen 12; local-format phone not dialable abroad.
Sam: rail labels hover-only; errors colour-only and same colour as success; screen reader can land mid-scramble.

## Motion review (Emil Kowalski standards) — Block

| Before | After | Why |
|---|---|---|
| SmoothScroll.tsx:34 lerp 0.09 | Delete Lenis; PIN_TYPE "fixed" (scroll-fx.tsx:69) | ~1s glide per wheel notch |
| SmoothScroll.tsx:41 anchors offset -barHeight() | anchors: false | Double-subtracted offset, 89px off target |
| globals.css:423 .load-curtain 0.85s + 0.15s | Delete; keep 600ms line rise | Curtain hides the reveal it's paired with |
| Curtains.tsx:63 RouteCurtain lime ~570ms | Delete, or 200ms dark transform wipe | Latency on every navigation |
| scroll-fx.tsx:1399 350ms lift on focusin/pointerenter | Mouse + fine pointer only, 200ms | Animation on keyboard action; hops on tap |
| page.tsx:427,518 transition-all w-0 → w-full | scale-x transform 200ms | Layout property every frame |
| floating-dock.tsx:262 7 x 50ms stagger, symmetric exit | 180ms in / 120ms out, no stagger | ~600ms to reach top tile; slow Escape |
| primitives.tsx:401 marquee skew ±9°, no pause | WAAPI loop, skew ≤3°, pause on hover/focus | Stutters during scroll; WCAG 2.2.2 |
| primitives.tsx:336 500ms grayscale + scale 1.03 | filter only 200ms, no scale | Seen dozens of times; scale ignores reduced motion |
| primitives.tsx:640, world-map.tsx:200 hover handlers | Gate (hover:hover) and (pointer:fine) | Touch leaves tilt stuck; map tooltip flickers |

## Minor Observations

No testimonials. GA without consent for UK/EU. White footer and next panel break the dark/no-gradient lock. Mobile sheet 10 entries. Hero headlines smallest revenue (Muterpe $5K vs Volumize £31K). Gmail with digits on a site with its own domain.

## Questions to Consider

- 45-second hiring manager: pinned About or the Golegal card?
- Hero says resume (recruiter), services say "Start a project" (founder) — split the two paths?
- Would a homepage opening with an architecture diagram and eval table perform the site's honesty better than a portrait?
