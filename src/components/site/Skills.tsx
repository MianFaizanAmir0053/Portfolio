"use client";

import { Fragment, useState } from "react";
import { Plus } from "lucide-react";
import { CurtainText, Tag } from "./primitives";
import { MagneticSurface } from "./scroll-fx";

const SKILLS = [
  { n: "01", label: "Languages", items: ["JavaScript", "TypeScript", "Python"] },
  {
    n: "02",
    label: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "Redux Toolkit",
      "TanStack Query",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
      "MUI",
      "Shadcn",
      "Headless UI",
    ],
  },
  { n: "03", label: "Backend & APIs", items: ["Node.js", "Express.js", "REST APIs", "GraphQL", "NextAuth"] },
  { n: "04", label: "AI / ML", items: ["LangChain", "Agentic RAG", "LLM Integration", "OpenAI"] },
  { n: "05", label: "Infrastructure", items: ["PostgreSQL", "AWS S3", "CI/CD"] },
];

/** Derived, so it can never drift from the list above. */
const TOTAL_TOOLS = SKILLS.reduce((sum, s) => sum + s.items.length, 0);

/** What actually gets opened most days — each name is present in SKILLS. */
const DAILY_DRIVERS = [
  { k: "LANGUAGE", v: "TypeScript" },
  { k: "FRAMEWORK", v: "Next.js" },
  { k: "RUNTIME", v: "Node.js" },
  { k: "DATA", v: "PostgreSQL" },
  { k: "AI", v: "OpenAI · Agentic RAG" },
];

export function Skills() {
  const [open, setOpen] = useState<string | null>("01");
  return (
    <section id="skills" className="rule-t bg-paper-deep">
      <div className="wrap grid gap-12 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div>
          <Tag className="mb-6 block">[03] STACK</Tag>
          <CurtainText
            className="display mb-10 text-[11vw] md:text-[clamp(2.5rem,4.6vw,4rem)]"
            lines={[
              <Fragment key="1">
                An <span className="accent-word">inventory</span>
              </Fragment>,
              <Fragment key="2">of what I use</Fragment>,
            ]}
          />

          <ul>
            {SKILLS.map((s) => {
              const isOpen = open === s.n;
              return (
                <li key={s.n} className="rule-t last:rule-b">
                  {/* Rows are full-width, so cursor-following would read as
                      drift — `pull={false}` keeps only the hover/focus lift. */}
                  <MagneticSurface pull={false} lift={4}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : s.n)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-4 py-5 text-left"
                    >
                      <span className="label">[{s.n}]</span>
                      <span className="display text-xl md:text-2xl">{s.label}</span>
                      <span className="label ml-auto">({s.items.length})</span>
                      <span
                        className={`text-cobalt transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                        aria-hidden
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </MagneticSurface>
                  {isOpen && (
                    <ul className="flex flex-wrap gap-x-6 gap-y-2 pb-6">
                      {s.items.map((i) => (
                        <li key={i} className="text-sm text-ink-muted">
                          <span className="text-cobalt">*</span> {i}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="md:sticky md:top-24 md:self-start">
          <div className="cut-br grain relative bg-paper p-8">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center bg-cobalt font-display text-sm text-paper"
            >
              +
            </span>

            <Tag className="block">[INVENTORY]</Tag>
            <p className="display mt-6 text-[18vw] leading-[0.8] text-cobalt md:text-[7vw]">
              ({TOTAL_TOOLS})
            </p>
            <p className="label mt-3">
              * TOOLS ACROSS {SKILLS.length} AREAS
            </p>

            <dl className="mt-10 rule-t">
              {DAILY_DRIVERS.map((d) => (
                <div key={d.k} className="flex items-baseline justify-between gap-4 rule-b py-3">
                  <dt className="label">{d.k}</dt>
                  <dd className="text-sm">{d.v}</dd>
                </div>
              ))}
            </dl>
            <p className="label mt-4">* DAILY DRIVERS</p>
          </div>
        </div>
      </div>
    </section>
  );
}
