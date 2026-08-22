"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

export type MapRegion = {
  lat: { min: number; max: number };
  lng: { min: number; max: number };
};

export type MapImage = { width: number; height: number; region: MapRegion };

export type MapPoint = {
  lat: number;
  lng: number;
  /** Place name, shown as the tooltip's headline. */
  label?: string;
  /** What this site actually claims about the place. */
  note?: string;
};

export type Arc = { start: MapPoint; end: MapPoint };

/**
 * Adapted from the original for this project:
 *  - `motion/react` -> `framer-motion`
 *  - dropped `next-themes` (`useTheme`) — uninstalled here, palette is locked
 *    dark, so the light/dark branch was dead and the import would not resolve
 *  - the dot SVG is built at build time and served as its own cached asset, so
 *    neither the 344KB `dotted-map` payload nor the ~1.1MB rendered SVG ends up
 *    in the page HTML or the RSC flight data
 *  - coordinates project from the map's own reported region rather than an
 *    assumed -180/180 span, so arcs land on the correct dots
 *  - endpoints are de-duplicated into real, hoverable places (the hub appears
 *    on every arc, and was previously drawn — and pulsed — once per arc)
 *  - palette tokens, zero radius, motion respects prefers-reduced-motion
 */
export default function WorldMap({
  src,
  image,
  dots = [],
  lineColor = "var(--cobalt)",
  className,
}: {
  /** URL of the pre-rendered dot map. */
  src: string;
  image: MapImage;
  dots?: Arc[];
  lineColor?: string;
  className?: string;
}) {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [active, setActive] = useState<string | null>(null);
  const { width, height, region } = image;

  const project = (lat: number, lng: number) => ({
    x: ((lng - region.lng.min) / (region.lng.max - region.lng.min)) * width,
    y: ((region.lat.max - lat) / (region.lat.max - region.lat.min)) * height,
  });

  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const midX = (a.x + b.x) / 2;
    const midY = Math.min(a.y, b.y) - height * 0.12;
    return `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`;
  };

  const key = (p: MapPoint) => `${p.lat},${p.lng}`;

  /*
   * One entry per place, not per arc endpoint. The hub sits at the start of
   * every arc, so without this it carried four stacked markers — four overlaid
   * pulses, and four hit targets fighting over the same pixels.
   */
  const byPlace = new Map<string, MapPoint>();
  for (const arc of dots) {
    for (const p of [arc.start, arc.end]) {
      const k = key(p);
      const prev = byPlace.get(k);
      byPlace.set(k, prev ? { ...prev, label: prev.label ?? p.label, note: prev.note ?? p.note } : p);
    }
  }
  const points = [...byPlace.entries()].map(([k, p]) => ({ ...p, key: k, ...project(p.lat, p.lng) }));

  const activePoint = points.find((p) => p.key === active) ?? null;

  /*
   * Tooltip placement. The card hangs above its marker and is centred on it,
   * except near an edge — where centring would push it out of the frame — and
   * near the top, where there is nothing above the marker to hang into.
   */
  const anchorStyle = (): CSSProperties => {
    if (!activePoint) return {};
    const leftPct = (activePoint.x / width) * 100;
    const topPct = (activePoint.y / height) * 100;
    const box: CSSProperties = topPct < 26 ? { top: 16 } : { bottom: 16 };
    if (leftPct < 20) box.left = -12;
    else if (leftPct > 80) box.right = -12;
    else {
      box.left = "50%";
      box.transform = "translateX(-50%)";
    }
    return box;
  };

  return (
    <div className={cn("relative w-full", className)} style={{ aspectRatio: `${width} / ${height}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden
        draggable={false}
        loading="lazy"
        decoding="async"
        className="pointer-events-none h-full w-full select-none [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
      />

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        role="group"
        aria-label="Places this work reaches"
      >
        <defs>
          <linearGradient id="reach-arc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
            <stop offset="12%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="88%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => {
          const a = project(dot.start.lat, dot.start.lng);
          const b = project(dot.end.lat, dot.end.lng);
          // Hovering a place is a question about that place: its own routes stay
          // lit, the rest step back rather than disappear.
          const related = !active || key(dot.start) === active || key(dot.end) === active;
          return (
            <motion.path
              key={`arc-${i}`}
              d={curve(a, b)}
              fill="none"
              stroke="url(#reach-arc)"
              strokeWidth={related && active ? 0.9 : 0.6}
              className="transition-[stroke-width,opacity] duration-300"
              opacity={related ? 1 : 0.18}
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={reduce ? { duration: 0 } : { duration: 1.1, delay: 0.35 * i, ease: "easeOut" }}
            />
          );
        })}

        {points.map((p) => {
          const on = p.key === active;
          const name = [p.label, p.note?.replace(/^\*\s*/, "")].filter(Boolean).join(" — ");
          return (
            <g key={p.key}>
              {!reduce && !on && (
                <circle cx={p.x} cy={p.y} r={1.1} fill={lineColor} opacity="0.5">
                  <animate attributeName="r" from="1.1" to="4.5" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}

              {on && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={3.2}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth={0.45}
                  opacity="0.85"
                />
              )}

              <circle
                cx={p.x}
                cy={p.y}
                r={on ? 1.7 : 1.1}
                fill={lineColor}
                className="transition-[r] duration-200"
              />

              {/* Transparent target: the marker itself is ~2px wide on screen. */}
              <circle
                cx={p.x}
                cy={p.y}
                r={4.5}
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={name || undefined}
                className="pointer-events-auto cursor-pointer"
                onPointerEnter={() => setActive(p.key)}
                onPointerLeave={() => setActive((cur) => (cur === p.key ? null : cur))}
                onFocus={() => setActive(p.key)}
                onBlur={() => setActive((cur) => (cur === p.key ? null : cur))}
                onClick={() => setActive((cur) => (cur === p.key ? null : p.key))}
              />
            </g>
          );
        })}
      </svg>

      {/* HTML, not <text>: inside the viewBox the type would scale with the map
          and stop matching anything else on the page. */}
      <div className="pointer-events-none absolute inset-0">
        <AnimatePresence>
          {activePoint && (
            /* The animated element has to be AnimatePresence's own child, or
               there is nothing left to run an exit on when it unmounts. */
            <motion.div
              key={activePoint.key}
              className="absolute"
              style={{
                left: `${(activePoint.x / width) * 100}%`,
                top: `${(activePoint.y / height) * 100}%`,
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: reduce ? 0 : 0.18, ease: "easeOut" }}
            >
              <span
                aria-hidden
                className="absolute left-0 h-4 w-px bg-cobalt/50"
                style={(activePoint.y / height) * 100 < 26 ? { top: 0 } : { bottom: 0 }}
              />
              <div className="absolute" style={anchorStyle()}>
                <div className="cut-sm min-w-[9rem] whitespace-nowrap border border-cobalt/45 bg-paper px-4 py-3 text-left">
                  <p className="display text-base leading-none md:text-lg">{activePoint.label}</p>
                  {activePoint.note && <p className="label mt-2 text-cobalt">{activePoint.note}</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
