"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

export type MapRegion = {
  lat: { min: number; max: number };
  lng: { min: number; max: number };
};

export type MapImage = { width: number; height: number; region: MapRegion };

export type Arc = {
  start: { lat: number; lng: number; label?: string };
  end: { lat: number; lng: number; label?: string };
};

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
        aria-hidden
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
          return (
            <motion.path
              key={`arc-${i}`}
              d={curve(a, b)}
              fill="none"
              stroke="url(#reach-arc)"
              strokeWidth={0.6}
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={reduce ? { duration: 0 } : { duration: 1.1, delay: 0.35 * i, ease: "easeOut" }}
            />
          );
        })}

        {dots.map((dot, i) => (
          <g key={`points-${i}`}>
            {[dot.start, dot.end].map((p, j) => {
              const { x, y } = project(p.lat, p.lng);
              return (
                <g key={`p-${i}-${j}`}>
                  <circle cx={x} cy={y} r={1.1} fill={lineColor} />
                  {!reduce && (
                    <circle cx={x} cy={y} r={1.1} fill={lineColor} opacity="0.5">
                      <animate
                        attributeName="r"
                        from="1.1"
                        to="4.5"
                        dur="1.6s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.5"
                        to="0"
                        dur="1.6s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
