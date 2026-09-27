import type { CSSProperties } from "react";
import { FACTS, type Fact } from "@/data/facts";
import { FACT_MS } from "@/lib/intro";

/*
 * What the status line says, by stage (see `introBoot`). The stages follow
 * the bar, so the words never disagree with the number beside them; "slow"
 * takes over when the wait runs long or a step of it runs late — the moment a
 * reader starts to wonder whether anything is happening at all.
 */
const STAGES = [
  ["load", "Loading the work"],
  ["build", "Putting it together"],
  ["slow", "Good things take time"],
  ["polish", "Final touches"],
  ["ready", "Ready"],
] as const;

/** A fact's text, with the phrase it turns on set in the accent face. */
function FactText({ text, accent }: Fact) {
  const at = text.indexOf(accent);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className="accent-word">{accent}</span>
      {text.slice(at + accent.length)}
    </>
  );
}

/**
 * First-load intro: a full-screen panel that holds the page until it is
 * actually ready, and spends the wait on something worth reading — a fact
 * from the history of the web, programming and AI (`FACTS`). It used to
 * summarise the site, which read as a delay before the same summary; a
 * surprise earns the wait instead. The head script deals the facts from a deck
 * shuffled once per browser, so each visit opens on one not seen before.
 *
 * It replaced a curtain that lifted on a fixed one-second timer. The page it
 * uncovered was not ready at one second: until the client bundle had booted,
 * measured every pinned section and started smooth scrolling — two seconds
 * after that on a good laptop, far more on a phone — the first scroll ran
 * native, then jumped as the pins arrived. Now the panel leaves when the page
 * says it is ready (`introReady`), after a minimum long enough to read the
 * name and a fact, and never later than a hard cap set by the head script.
 * The bar tracks an estimate of the load, corrected as it goes (`introBoot`),
 * with its position as a percentage and a line saying what stage it is at.
 *
 * Server-rendered and static, so it is on screen from the first paint, before
 * any JavaScript: the head script (`INTRO_SCRIPT`) opts a load in by setting
 * `data-intro` on <html>, and without that the stylesheet keeps the panel
 * hidden — no JavaScript, lite mode and reduced motion all get the page at
 * once. Everything that moves inside is transform and opacity — CSS, and for
 * the bar the Web Animations API — which the compositor runs off the main
 * thread: this is on screen exactly while the main thread is busiest, and
 * anything stepped from script frame by frame would stutter through the work
 * it is covering. The one exception is the percentage, which is text: the
 * head script sets it ten times a second, which costs next to nothing, and
 * it catches up with the bar whenever the thread comes free.
 *
 * `aria-hidden`: it repeats the page's own content, and a screen reader is
 * better served reading the page, which is there underneath from the start.
 */
export function Intro() {
  return (
    <div aria-hidden className="intro grain">
      <div className="intro-body wrap">
        <div className="flex items-center justify-between gap-6 pt-5 md:pt-6">
          <span className="label text-ink">[00] LOADING</span>
          <span className="label text-cobalt">[OPEN TO WORK]</span>
        </div>

        {/* The name, and beside it on a wide screen — under it on a phone —
            the facts, level with the name's last line. */}
        <div className="intro-stage flex flex-col justify-center md:grid md:grid-cols-[auto_minmax(0,1fr)] md:content-center md:items-end md:gap-x-16 lg:gap-x-24">
          <div>
            <p className="intro-kicker label">The work of</p>
            <p className="display text-[25vw] leading-[0.82] md:text-[clamp(6rem,15vw,15rem)]">
              <span className="block overflow-hidden">
                <span className="intro-rise block" style={{ "--line-delay": "0.05s" } as CSSProperties}>
                  Faizan
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="intro-rise block" style={{ "--line-delay": "0.15s" } as CSSProperties}>
                  <span className="accent-word">Amir.</span>
                </span>
              </span>
            </p>
          </div>
          <div className="mt-6 md:mt-0 md:pb-[1.2vw]">
            <p className="intro-facts-kicker label">Did you know?</p>
            <div className="intro-facts" style={{ "--fact-ms": `${FACT_MS}ms` } as CSSProperties}>
              {FACTS.map((fact, i) => (
                <p
                  key={fact.text}
                  className="intro-fact max-w-[34rem] text-lg leading-snug text-balance text-ink md:max-w-[30rem] md:text-3xl lg:max-w-[38rem] lg:text-4xl"
                  // Its turn in the order the head script dealt; in page order without it.
                  style={{ "--i": `var(--f${i}, ${i})` } as CSSProperties}
                >
                  <FactText {...fact} />
                  <span className="label mt-3 block text-ink-muted md:mt-4">{fact.source}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="pb-6 md:pb-8">
          {/* What is happening, and how far along: the stage the head script
              reports (`data-intro-stage`), and the bar's own position as a
              number — set on `--pct`, so React's markup never changes under it. */}
          <div className="mb-3 flex items-end justify-between gap-6 md:mb-4">
            <div className="flex items-center gap-3 pb-1">
              <span className="intro-pulse" />
              <span className="intro-status label text-ink">
                {STAGES.map(([stage, words]) => (
                  <span key={stage} data-stage={stage}>
                    {words}
                  </span>
                ))}
              </span>
            </div>
            <span
              className="intro-pct display text-5xl text-ink md:text-7xl"
              // The head script writes the number onto it before React hydrates.
              suppressHydrationWarning
            />
          </div>
          <div className="intro-bar">
            <span />
            <span />
          </div>
          <div className="mt-3 flex justify-between gap-6">
            <span className="label">Full-stack &amp; AI engineering</span>
            <span className="label">US · UK · ME · EU</span>
          </div>
        </div>
      </div>
    </div>
  );
}
