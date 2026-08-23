"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { comingSoon } from "@/data/projects";
import { Tag } from "./primitives";

/**
 * COMING SOON — mailagent, replayed rather than described.
 *
 * The product's whole argument is that an LLM proposes and a human disposes:
 * the graph runs classify → extract → retrieve → conflict_check, then *stops*
 * at an interrupt and waits for a tap before anything touches a calendar. So
 * this section runs the same graph, and stops in the same place. The visitor
 * is the human in the loop — the approval card does not advance on a timer,
 * and there is no path to the `act` span that does not go through their hand.
 *
 * That is the point of building it this way instead of writing a paragraph
 * about human-in-the-loop design: a paragraph can claim the gate exists, but
 * a reader who had to tap through one has felt it.
 */

const STEPS = comingSoon.trace;
const GATE = STEPS.findIndex((s) => s.gate);

/** Playback cadence, derived from the real span durations but compressed. */
const delayFor = (ms: number) => 240 + Math.min(ms, 1200) / 4;

/**
 * `running` and `awaiting` are *derived* from how many spans have resolved —
 * the graph is waiting exactly when it has reached the gate and nobody has
 * answered yet. Only the states a tap puts it into are stored.
 */
type Outcome = "editing" | "acting" | "done" | "declined";
type Phase = "running" | "awaiting" | Outcome;

/** True once the element has entered the viewport, and true from then on. */
function useRevealed<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;
    const io = new IntersectionObserver(
      ([entry]) => entry?.isIntersecting && setRevealed(true),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, revealed]);
  return revealed;
}

export function ComingSoon() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useRevealed(ref);

  /*
   * Reduced motion gets the same machine with the cadence removed: every span
   * up to the gate resolves on arrival, and the gate still gates. The
   * interaction is the content here, so it is not something to opt out of —
   * only the animation is.
   */
  const instant = useMediaQuery("(prefers-reduced-motion: reduce)");

  /* How many spans have finished. The gate span is "reached", never auto-run. */
  const [done, setDone] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [slot, setSlot] = useState("15:00");
  const [edited, setEdited] = useState(false);

  const phase: Phase = outcome ?? (done >= GATE ? "awaiting" : "running");

  useEffect(() => {
    if (!revealed || outcome || done >= GATE) return;
    /* Reduced motion still goes through a task rather than a synchronous set,
       so the run always starts from the same place — just with no wait. */
    const t = setTimeout(
      () => setDone((d) => (instant ? GATE : d + 1)),
      instant ? 0 : delayFor(STEPS[done].ms),
    );
    return () => clearTimeout(t);
  }, [revealed, outcome, done, instant]);

  function confirm() {
    setOutcome("acting");
    setTimeout(
      () => {
        setDone(STEPS.length);
        setOutcome("done");
      },
      instant ? 0 : 520,
    );
  }

  function replay() {
    setDone(0);
    setOutcome(null);
    setSlot("15:00");
    setEdited(false);
  }

  /* Cost accounting mirrors the real thing: spans without a priced call are
     NULL, not zero. A zero would read as "this step was free". */
  const tokens = STEPS.slice(0, done).reduce((n, s) => n + (s.tokens ?? 0), 0);
  const elapsed = STEPS.slice(0, done).reduce((n, s) => n + s.ms, 0);

  return (
    <section id="next" className="rule-t bg-paper-deep">
      <div ref={ref} className="wrap grid gap-12 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-16 md:py-28">
        {/* ---- the write-up ---- */}
        <div>
          <Tag className="mb-6 block">[NEXT] IN BUILD</Tag>
          <h2 className="display text-[13vw] leading-[0.85] md:text-[clamp(3rem,5vw,4.5rem)]">
            {comingSoon.name}
          </h2>
          <p className="accent-word mt-3 block text-2xl md:text-3xl">{comingSoon.tagline}</p>

          <span className="label mt-5 inline-block border border-cobalt px-2 py-1 text-cobalt">
            [{comingSoon.status.toUpperCase()}]
          </span>

          <p className="mt-6 max-w-lg text-sm leading-7 text-ink-muted">{comingSoon.summary}</p>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 rule-t pt-6">
            {comingSoon.evidence.map((e) => (
              <div key={e.caption}>
                <p className="display text-3xl text-cobalt md:text-4xl">{e.value}</p>
                <p className="label mt-2 text-ink">{e.caption}</p>
                <p className="label mt-1 text-ink-muted">{e.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {comingSoon.stack.map((t) => (
              <span key={t} className="label border border-ink px-2 py-1 text-ink">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ---- the graph, running ---- */}
        <div>
          <div className="cut-tr border border-[color:var(--hairline)] bg-paper">
            <header className="flex items-center justify-between gap-4 rule-b px-5 py-3">
              <p className="label text-ink">LANGGRAPH · RUN #0af31c</p>
              <p className="label" aria-live="polite">
                {phase === "awaiting" && <span className="text-cobalt">◆ INTERRUPT</span>}
                {phase === "editing" && <span className="text-cobalt">◆ EDITING</span>}
                {phase === "running" && "▮ RUNNING"}
                {phase === "acting" && "▮ ACTING"}
                {phase === "done" && <span className="text-cobalt">✓ COMPLETE</span>}
                {phase === "declined" && "✕ DECLINED"}
              </p>
            </header>

            <ol className="px-5 py-4 font-mono text-xs leading-relaxed">
              {STEPS.map((step, i) => {
                const state =
                  i < done ? "done" : i === done && phase === "awaiting" ? "gate" : "pending";
                if (state === "pending" && !(i === GATE && phase !== "declined")) return null;

                return (
                  <li
                    key={step.id}
                    className={`grid grid-cols-[1rem_1fr] gap-x-3 py-1.5 transition-opacity duration-300 ${
                      state === "pending" ? "opacity-30" : "opacity-100"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={state === "pending" ? "text-ink-muted" : "text-cobalt"}
                    >
                      {state === "done" ? "✓" : state === "gate" ? "◆" : "·"}
                    </span>
                    <span>
                      <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <span className="text-ink">{step.label}</span>
                        <span className="text-ink-muted">
                          {state === "done" ? `${step.ms}ms` : "—"}
                          {" · "}
                          {step.tokens ? `${step.tokens} tok` : "NULL"}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-ink-muted">{step.detail}</span>
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* ---- the interrupt: a Telegram card, and the only way forward ---- */}
            {(phase === "awaiting" || phase === "editing") && (
              <div className="rule-t bg-paper-deep px-5 py-5">
                <p className="label text-ink">TELEGRAM · APPROVAL REQUIRED</p>
                <p className="mt-3 text-sm leading-7 text-ink">
                  Move <span className="text-cobalt">Design sync</span> to{" "}
                  <span className="text-cobalt">Thu {slot}</span>
                  {edited && <span className="text-ink-muted"> (edited)</span>}? Original 14:00
                  clashes with <span className="text-ink-muted">1:1 · Ali</span>.
                </p>

                {phase === "editing" ? (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <label className="label text-ink" htmlFor="slot">
                      NEW TIME
                    </label>
                    <input
                      id="slot"
                      type="time"
                      value={slot}
                      onChange={(e) => setSlot(e.target.value)}
                      className="border border-[color:var(--hairline)] bg-paper px-3 py-2 font-mono text-xs text-ink"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEdited(true);
                        setOutcome(null);
                      }}
                      className="label bg-cobalt px-4 py-2 text-paper transition-colors hover:bg-cobalt-deep"
                    >
                      SET
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={confirm}
                      className="label bg-cobalt px-4 py-2 text-paper transition-colors hover:bg-cobalt-deep"
                    >
                      CONFIRM
                    </button>
                    <button
                      type="button"
                      onClick={() => setOutcome("editing")}
                      className="label border border-ink px-4 py-2 text-ink transition-colors hover:border-cobalt hover:text-cobalt"
                    >
                      EDIT
                    </button>
                    <button
                      type="button"
                      onClick={() => setOutcome("declined")}
                      className="label border border-[color:var(--hairline)] px-4 py-2 text-ink-muted transition-colors hover:text-ink"
                    >
                      CANCEL
                    </button>
                  </div>
                )}

                <p className="label mt-4 text-ink-muted">
                  * the graph is halted here. nothing reaches the calendar until you tap.
                </p>
              </div>
            )}

            {(phase === "done" || phase === "declined") && (
              <div className="flex flex-wrap items-center justify-between gap-4 rule-t px-5 py-4">
                <p className="font-mono text-xs text-ink-muted">
                  {phase === "done" ? (
                    <>
                      run settled · {elapsed}ms · {tokens.toLocaleString()} tok ·{" "}
                      <span className="text-cobalt">$0.0004</span>
                    </>
                  ) : (
                    <>run declined · calendar untouched · no write attempted</>
                  )}
                </p>
                <button
                  type="button"
                  onClick={replay}
                  className="label text-cobalt transition-colors hover:text-cobalt-deep"
                >
                  ↻ REPLAY
                </button>
              </div>
            )}
          </div>

          {/* ---- what broke ----
              Kept in the reader's view rather than buried in a repo. Native
              disclosure so the four headlines scan in one pass and the detail
              is one click away, with no JavaScript holding it open. */}
          <div className="mt-8">
            <p className="label mb-2 text-ink">[WHAT BROKE]</p>
            {comingSoon.broke.map((b) => (
              <details key={b.title} className="group rule-t py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm text-ink transition-colors hover:text-cobalt [&::-webkit-details-marker]:hidden">
                  {b.title}
                  <span className="label text-cobalt transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-2 max-w-xl text-sm leading-7 text-ink-muted">{b.body}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
