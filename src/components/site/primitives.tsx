"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { scrollSignal } from "@/lib/scroll-signal";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- bracket label ---------- */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("label", className)}>{children}</span>;
}

/* ---------- curtain text reveal (signature animation) ---------- */
export function CurtainText({
  lines,
  className,
  as: As = "h2",
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  delay?: number;
  /**
   * Reveal on a CSS animation from parse time instead of waiting for hydration
   * and an IntersectionObserver. Set it on anything above the fold: the hero
   * headline is the page's largest text, and gating it on the client bundle
   * made the whole JavaScript payload part of the largest-contentful-paint
   * measurement. Below the fold the observer is still the right trigger.
   */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  return (
    <As className={className} ref={ref as never}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {/*
           * A real space between the lines. Each line is its own block, which
           * separates them visually, but `textContent` — what a crawler or an
           * answer engine lifting the page reads — has no separator to insert.
           * Without this the h1 extracts as "I build full-stackand AI-driven".
           * Whitespace between block boxes does not render.
           */}
          {i > 0 ? " " : null}
          <span className="block overflow-hidden pb-[0.06em]">
            {immediate ? (
              <span
                className="line-rise block"
                style={{ "--line-delay": `${delay + i * 0.06}s` } as CSSProperties}
              >
                {line}
              </span>
            ) : (
              <span
                className="block"
                style={{
                  transform: shown || reduce ? "translateY(0)" : "translateY(110%)",
                  transition: reduce
                    ? "none"
                    : `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay + i * 0.06}s`,
                  /* Dropped once the line has arrived: a promoted layer per
                     headline line, kept forever, is memory the compositor
                     never gets back. */
                  willChange: shown || reduce ? "auto" : "transform",
                }}
              >
                {line}
              </span>
            )}
          </span>
        </Fragment>
      ))}
    </As>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- staggered children reveal ---------- */
export function Stagger({
  children,
  className,
  step = 0.09,
  delay = 0,
  y = 20,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  delay?: number;
  y?: number;
  as?: "div" | "ul" | "ol" | "dl" | "section";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[As] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8%" }}
      variants={{
        hidden: {},
        show: { transition: reduce ? {} : { staggerChildren: step, delayChildren: delay } },
      }}
      custom={{ y, reduce }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  y = 20,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: "div" | "li" | "figure" | "p";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[As] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1 } : { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: reduce ? { duration: 0 } : { duration: 0.65, ease: EASE },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

/* ---------- diagonal-cut image frame with scroll parallax ---------- */
export function CutFrame({
  src,
  alt,
  className,
  cut = "cut-tr",
  ratio = "aspect-[16/10]",
  plus = true,
  parallax = true,
  grayscale = false,
  eager = false,
  sizes = "(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  cut?: "cut-tr" | "cut-bl" | "cut-br";
  ratio?: string;
  plus?: boolean;
  parallax?: boolean;
  grayscale?: boolean;
  eager?: boolean;
  /** Responsive `sizes` hint. Override where the frame is narrower than half. */
  sizes?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!parallax) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = wrapRef.current;
    const img = imgRef.current;
    if (!el || !img) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [parallax]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <div className={cn("relative overflow-hidden bg-paper-deep", ratio, cut)}>
        {/*
         * next/image, not a bare <img>: it emits a srcset sized to the viewport
         * and converts raster sources to AVIF/WebP, which the case-study
         * screenshots need the moment they stop being placeholder SVGs. An .svg
         * source is served untouched — Next skips optimisation for it
         * automatically.
         *
         * `fill` plus an explicit style: the frame overscans by 12% and sits 6%
         * high so the GSAP parallax has somewhere to travel without exposing an
         * edge. The style prop is merged after Next's own fill styles, so it
         * wins.
         */}
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          style={{ height: "112%", transform: "translateY(-6%)" }}
          className={cn(
            "w-full object-cover transition-[filter,transform] duration-500",
            grayscale && "grayscale group-hover:grayscale-0 group-hover:scale-[1.03]",
          )}
        />
      </div>
      {plus && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center bg-cobalt font-display text-sm text-paper"
        >
          +
        </span>
      )}
    </div>
  );
}

/* ---------- marquee ---------- */
/**
 * Velocity-reactive marquee.
 *
 * Idles at a constant crawl, but reads the shared scroll signal every frame:
 * scrolling drives it faster, scrolling *up* runs it backwards, and the band
 * shears in the direction of travel then springs back to upright once you
 * stop. Driven off GSAP's ticker rather than a CSS animation, because a
 * keyframed animation can only change speed by restarting.
 */
export function Marquee({
  text,
  speed = 40,
  className,
  dark = false,
}: {
  text: string;
  /** Seconds for one loop at rest. Scroll velocity multiplies this. */
  speed?: number;
  className?: string;
  dark?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (reduce) return;
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let skew = 0;

    const tick = (_time: number, deltaMs: number) => {
      // Two identical copies sit side by side, so wrapping at half the track
      // width loops seamlessly whatever the text length.
      const half = track.scrollWidth / 2;
      if (!half) return;

      const velocity = scrollSignal.velocity;
      const direction = velocity < -0.01 ? -1 : 1;
      const boost = 1 + Math.min(Math.abs(velocity) * 6, 6);
      x = gsap.utils.wrap(-half, 0, x - direction * (half / speed) * boost * (deltaMs / 1000));

      const target = gsap.utils.clamp(-9, 9, velocity * 11);
      skew += (target - skew) * Math.min(1, deltaMs / 110);

      gsap.set(track, { x, skewX: skew });
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      gsap.set(track, { x: 0, skewX: 0 });
    };
  }, [reduce, speed]);

  /*
   * Two repeats per half, not four. The band still has to be wider than any
   * viewport for the wrap to be seamless, but at four the same string appeared
   * eight times in the document — once for each visible repeat plus the mirror
   * copy — which reads as keyword repetition to anything extracting the page
   * and as a stutter to a screen reader. The whole band is decorative; the
   * single readable copy below carries it for assistive technology and for
   * anything lifting the text.
   */
  const content = `${text} `.repeat(2);
  return (
    <div className={cn("overflow-hidden py-4", dark ? "bg-ink text-paper" : "", className)}>
      <span className="sr-only">{text.replace(/\s*\+\s*$/, "")}</span>
      <div
        ref={trackRef}
        aria-hidden
        className="flex w-max whitespace-nowrap will-change-transform"
      >
        <span className="display pr-8 text-[clamp(1.5rem,3.4vw,3rem)]">{content}</span>
        <span className="display pr-8 text-[clamp(1.5rem,3.4vw,3rem)]">{content}</span>
      </div>
    </div>
  );
}

/* ---------- scramble number ---------- */
const GLYPHS = "0123456789";
export function Scramble({ value, className }: { value: string; className?: string }) {
  const [out, setOut] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || done.current) return;
        done.current = true;
        let frame = 0;
        const total = 26;
        const id = window.setInterval(() => {
          frame += 1;
          const revealed = Math.floor((frame / total) * value.length);
          setOut(
            value
              .split("")
              .map((ch, i) =>
                i < revealed || !/\d/.test(ch)
                  ? ch
                  : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
              )
              .join(""),
          );
          if (frame >= total) {
            window.clearInterval(id);
            setOut(value);
          }
        }, 45);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {reduce ? value : out}
    </span>
  );
}

/* ---------- magnetic wrapper ---------- */
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < Math.max(r.width, r.height) / 2 + 40) {
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      } else {
        el.style.transform = "translate(0,0)";
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [strength]);

  return (
    <span ref={ref} className={cn("inline-block transition-transform duration-200", className)}>
      {children}
    </span>
  );
}

/* ---------- generic scroll parallax wrapper ---------- */
export function Parallax({
  children,
  className,
  distance = 60,
  rotate = 0,
}: {
  children: ReactNode;
  className?: string;
  /** total travel in px across the viewport pass */
  distance?: number;
  /** total rotation in degrees across the pass */
  rotate?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: distance / 2, rotate: -rotate / 2 },
        {
          y: -distance / 2,
          rotate: rotate / 2,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [distance, rotate]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

/* ---------- pointer tilt ---------- */
export function Tilt({
  children,
  className,
  max = 8,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
    };
    const reset = () => {
      el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, [max]);

  return (
    <div ref={ref} className={cn("transition-transform duration-300 ease-out", className)}>
      {children}
    </div>
  );
}

/* ---------- scroll progress hairline ---------- */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[70] h-px bg-transparent">
      <div className="h-full bg-cobalt transition-[width] duration-150" style={{ width: `${pct}%` }} />
    </div>
  );
}
