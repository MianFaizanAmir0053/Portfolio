"use client";

import dynamic from "next/dynamic";
import { useIsClient, useMediaQuery } from "@/hooks/use-media-query";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const HERO_FALLBACK = "/projects/hero-object.svg";

export function HeroObject() {
  const isClient = useIsClient();
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const small = useMediaQuery("(max-width: 767px)");
  const enabled = isClient && !reduce && !small;

  const fallback = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={HERO_FALLBACK}
      alt="Abstract low-poly wireframe form"
      width={1024}
      height={1024}
      className="h-full w-full object-contain"
    />
  );

  return (
    <div className="relative aspect-square w-full">
      {/* dotted orbit */}
      <span
        aria-hidden
        className="absolute inset-[8%] rounded-full border border-dashed border-ink-muted/60"
      />
      <div className="absolute inset-[10%]">{enabled ? <HeroScene /> : fallback}</div>
    </div>
  );
}
