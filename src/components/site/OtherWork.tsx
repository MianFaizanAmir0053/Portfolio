"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { otherWork } from "@/data/projects";
import { Tag } from "./primitives";

/**
 * OTHER WORK — a two-pane index, not a third card treatment.
 *
 * The page already spends its two heaviest devices on projects: a pinned card
 * stack for the case studies and a halted state machine for the one in build.
 * A third stack of cards here would flatten all three into the same weight,
 * which is exactly the mistake the old horizontal rail made.
 *
 * So this reads like a file browser instead. The list is the index; one pane
 * beside it holds whichever row is under the cursor or the keyboard focus.
 * Nothing expands, nothing reflows — moving down the list swaps the pane, so
 * three projects cost one screen and comparing them costs no scrolling at all.
 *
 * Selection follows hover *and* focus, driven by a roving tabindex: ↑ / ↓ walk
 * the list, Home / End jump its ends, Enter opens. On mobile there is no
 * pointer to follow, so the pane sits under the list and the rows drive it by
 * tap.
 */
export function OtherWork() {
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const item = otherWork[active];

  function move(to: number) {
    const next = (to + otherWork.length) % otherWork.length;
    setActive(next);
    rowRefs.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const keys: Record<string, number> = {
      ArrowDown: i + 1,
      ArrowUp: i - 1,
      Home: 0,
      End: otherWork.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    move(keys[e.key]);
  }

  return (
    <section id="other" className="rule-t" aria-labelledby="other-work-heading">
      <div className="wrap py-16 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Tag className="block">[INDEX] OTHER WORK</Tag>
            {/* The section had no heading of any level, so three shipped
                projects sat outside the document outline entirely. */}
            <h2 id="other-work-heading" className="display mt-3 text-2xl md:text-4xl">
              Also shipped
            </h2>
          </div>
          <p className="label text-ink-muted">↑ ↓ TO BROWSE</p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
          {/* ---- the index ---- */}
          <ul className="rule-t">
            {otherWork.map((w, i) => {
              const on = i === active;
              return (
                <li key={w.name} className="rule-b">
                  <Link
                    href={w.href}
                    ref={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    /* Roving tabindex: one stop for the whole list, arrows for
                       the rest. Tabbing through three rows to leave a footnote
                       section is a tax nobody should pay. */
                    tabIndex={on ? 0 : -1}
                    onFocus={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    target={w.external ? "_blank" : undefined}
                    rel={w.external ? "noopener" : undefined}
                    className="group flex items-baseline gap-4 py-5 transition-colors"
                  >
                    <span
                      className={`label transition-colors ${on ? "text-cobalt" : "text-ink-muted"}`}
                      aria-hidden
                    >
                      {on ? "▸" : "·"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`display block text-2xl transition-colors md:text-3xl ${
                          on ? "text-cobalt" : "text-ink"
                        }`}
                      >
                        {w.name}
                      </span>
                      <span className="label mt-1 block text-ink-muted">{w.tagline}</span>
                    </span>
                    <span className="label shrink-0 text-ink-muted">{w.status}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ---- the panes ----
              All three render; the two that are not selected are `hidden`.
              Mounting only the active one meant two of the three write-ups
              never existed in the served HTML, so the section described one
              project to anything that does not run JavaScript. The fade is
              keyed on the active name so it still re-runs on every move. */}
          <div key={item.name} className="animate-[fade-up_360ms_ease-out_both] md:pt-6">
            {otherWork.map((work, i) => (
              <div key={work.name} hidden={i !== active}>
                <p className="label text-ink">[{String(i + 1).padStart(2, "0")}]</p>
                <h3 className="sr-only">
                  {work.name} — {work.tagline}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-ink-muted">{work.note}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {work.stack.map((t) => (
                    <span
                      key={t}
                      className="label border border-[color:var(--hairline)] px-2 py-1 text-ink"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  href={work.href}
                  target={work.external ? "_blank" : undefined}
                  rel={work.external ? "noopener" : undefined}
                  /* Not a keyboard stop: the row itself is already the link to
                     the same place, so this would be a second tab stop to
                     nowhere new. */
                  tabIndex={-1}
                  className="label group mt-8 inline-flex items-center gap-1 text-cobalt transition-colors hover:text-cobalt-deep"
                >
                  {work.hrefLabel} — {work.name}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
