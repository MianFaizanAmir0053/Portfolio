/**
 * The site's type and spacing roles, set from the homepage.
 *
 * The homepage is the reference: it is the page whose hierarchy reads most
 * clearly, with a distinct step between a section headline, a card title, an
 * item and running text. Every other page takes its sizes from here, so the
 * same kind of text is the same size wherever it appears — a section headline
 * on /about is a section headline on the homepage, a paragraph in a case study
 * is a paragraph on /services.
 *
 * Pick a role, not a size. If nothing here fits, the element is probably one
 * of these under another name; a genuinely new role belongs in this file, not
 * inline on one page.
 *
 * Plain class strings rather than components: they work in server and client
 * files alike, and Tailwind reads them from here like any other source file.
 */
export const TYPE = {
  /* ---- display: Bebas Neue caps (the `.display` utility) ---- */

  /** A page's title, its h1: the homepage hero. */
  hero: "display text-[13vw] md:text-[clamp(3.5rem,7.4vw,7.5rem)]",
  /** A section's headline, h2. Balanced, so a wrapped line never leaves one word behind. */
  section: "display text-balance text-[12vw] leading-[0.9] md:text-[clamp(2.75rem,5vw,4.5rem)]",
  /** A large card's title: a featured project. */
  cardTitle: "display text-3xl md:text-5xl",
  /** A card's or a row's title: an experience entry, a case study or service in a list. */
  title: "display text-2xl md:text-4xl",
  /** An item in a list: an FAQ question, a stack group, a process step, a constraint. */
  item: "display text-xl md:text-2xl",
  /** A term in a strip of facts: a place on the reach map. */
  term: "display text-lg md:text-xl",

  /* ---- the serif accent, set as its own line ---- */

  /** Under a card title: the employer under the role. */
  subtitle: "accent-word block text-2xl md:text-3xl",
  /** Under a page title: a project's tagline, at the size the homepage sets project titles. */
  tagline: "accent-word block text-3xl md:text-5xl",

  /* ---- numerals ---- */

  /** One large count on its own: the years, the tool inventory. */
  stat: "display text-[18vw] leading-[0.8] text-cobalt md:text-[7vw]",
  /** A number in a row of results; capped, because the columns it sits in stop growing. */
  metric:
    "display text-[clamp(3.25rem,13vw,4.5rem)] leading-[0.85] text-cobalt lg:text-[clamp(4rem,6.2vw,6.25rem)]",
  /** An outlined index numeral: the [01] on an experience card. */
  index: "outline-num text-[16vw] md:text-[5vw]",

  /* ---- running text: Barlow ----
   *
   * All of it in `ink-soft`, not the muted grey: the grey is for labels and
   * meta. A phrase inside it that carries the sentence is set in full white,
   * a figure in lime (see `Rich`), so a skim still lands on the point.
   */

  /** The one paragraph a page stops for: the homepage's About statement, a chapter's opening. */
  statement: "text-[clamp(1.05rem,1.7vw,1.45rem)] leading-[1.5] text-ink",
  /** The paragraph under a page's title. */
  intro: "text-base leading-7 text-ink-soft",
  /**
   * Text that is read, not skimmed: a case study's paragraphs, an FAQ answer,
   * a service's detail. At the intro's size — 14px was fine beside a card
   * title and too small for paragraph after paragraph.
   */
  prose: "text-base leading-7 text-ink-soft",
  /** A short paragraph beside a title: a card's, a row's, a section's blurb. */
  body: "text-sm leading-7 text-ink-soft",
  /** Running text in lists and tight panels, and small print. */
  compact: "text-sm leading-6 text-ink-soft",
} as const;

/**
 * The two buttons. Both carry a 1px border, so a filled one and an outlined
 * one side by side are the same height — the homepage hero's rule, now on
 * every pair.
 */
export const BUTTON = {
  primary:
    "border border-cobalt bg-cobalt px-6 py-3 text-center text-sm font-medium text-paper transition-[background-color,border-color,transform] duration-200 ease-out hover:border-cobalt-deep hover:bg-cobalt-deep active:scale-[0.97]",
  secondary:
    "border border-ink px-6 py-3 text-center text-sm font-medium text-ink transition-[background-color,color,transform] duration-200 ease-out hover:bg-ink hover:text-paper active:scale-[0.97]",
} as const;

/** The vertical rhythm, in the homepage's distances. */
export const SPACE = {
  /** Top and bottom of a section. */
  section: "py-20 md:py-28",
  /** Top and bottom of a page's opening block. */
  pageHead: "pt-10 pb-16 md:pt-16 md:pb-24",
  /** From a section's bracket label to its headline (on the label). */
  tag: "mb-6",
  /** From a headline to the paragraph under it. */
  intro: "mt-8",
  /** From a headline, or its paragraph, to the content it introduces. */
  content: "mt-10",
  /** Between large blocks: text to a map, a diagram, the next picture. */
  block: "mt-12 md:mt-16",
} as const;
