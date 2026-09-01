"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { otherWork, type OtherWork as WorkEntry } from "@/data/projects";
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
 * the list, Home / End jump its ends, Enter opens.
 *
 * All of that needs a cursor. Where there is none the rows are the only way in
 * and a tap on one navigates rather than selects, so the pane sat frozen on the
 * first project for the whole visit while the other two write-ups stayed hidden
 * beside it. The composition is therefore gated on `md:pointer-fine:` — on the
 * pointer as much as on the width, so a tablet is not handed a pane it has no
 * way to drive — and touch gets the honest arrangement instead: every write-up
 * open, inline under the row it belongs to. Rows stay plain links in both, so a
 * tap still goes where it says it goes.
 */

/**
 * One write-up: the note, the stack, the labelled way in.
 *
 * It renders in both arrangements — inline under its row where there is no
 * cursor, in the pane where there is — so it is defined once here rather than
 * written twice and left to drift.
 *
 * No numeral. The bracketed [nn] everywhere else on the site is the project's
 * catalogue index, and this list is in presentation order, so a positional
 * counter here labelled Muterpe [03] and then opened a page headed
 * [CASE STUDY 06]. The row's own name is the only label the pane needs.
 */
function Detail({ work }: { work: WorkEntry }) {
  return (
    <>
      <p className="max-w-md text-sm leading-7 text-ink-muted">{work.note}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {work.stack.map((t) => (
          <span key={t} className="label border border-[color:var(--hairline)] px-2 py-1 text-ink">
            {t}
          </span>
        ))}
      </div>

      <Link
        href={work.href}
        target={work.external ? "_blank" : undefined}
        rel={work.external ? "noopener" : undefined}
        /* Not a keyboard stop: the row itself is already the link to the same
           place, so this would be a second tab stop to nowhere new. */
        tabIndex={-1}
        className="label group mt-8 inline-flex items-center gap-1 text-cobalt transition-colors hover:text-cobalt-deep"
      >
        {work.hrefLabel} — {work.name}
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </>
  );
}

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
          {/* Only true where the pane it browses exists. */}
          <p className="label hidden text-ink-muted md:pointer-fine:block">↑ ↓ TO BROWSE</p>
        </div>

        <div className="grid gap-8 md:pointer-fine:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:pointer-fine:gap-14">
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
                    {/* The marker reads as "selected", which is only true while
                        something is doing the selecting, so it belongs to the
                        pane arrangement and is dropped along with it. */}
                    <span
                      className={`label hidden transition-colors md:pointer-fine:block ${
                        on ? "text-cobalt" : "text-ink-muted"
                      }`}
                      aria-hidden
                    >
                      {on ? "▸" : "·"}
                    </span>
                    <div className="min-w-0 flex-1">
                      {/* The row's name is the project's heading, rather than a
                          screen-reader copy of it inside the pane: it is the
                          same element in both arrangements, so the outline no
                          longer depends on which one rendered, and nothing gets
                          announced twice where the write-up sits directly under
                          its row. */}
                      <h3
                        className={`display block text-2xl text-ink transition-colors md:text-3xl ${
                          on ? "md:pointer-fine:text-cobalt" : ""
                        }`}
                      >
                        {w.name}
                      </h3>
                      <span className="label mt-1 block text-ink-muted">{w.tagline}</span>
                    </div>
                    <span className="label shrink-0 text-ink-muted">{w.status}</span>
                  </Link>

                  {/* The inline write-up. It is in the served HTML for all three
                      projects at every viewport, which is what keeps the section
                      whole for crawlers and for readers without JavaScript now
                      that the pane mounts only the selected one. */}
                  <div className="pb-6 md:pointer-fine:hidden">
                    <Detail work={w} />
                  </div>
                </li>
              );
            })}
          </ul>

          {/* ---- the pane ----
              The selected write-up, and only where there is a pointer to select
              it with. The fade is keyed on the active name so it re-runs on
              every move. */}
          <div
            key={item.name}
            className="hidden animate-[fade-up_360ms_ease-out_both] md:pt-6 md:pointer-fine:block"
          >
            <Detail work={item} />
          </div>
        </div>
      </div>
    </section>
  );
}
