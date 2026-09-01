"use client";
/**
 * Floating dock — liquid-glass chrome on editorial geometry.
 *
 * Adapted from the original Aceternity component for this project:
 *  - `motion/react` -> `framer-motion` (the package this repo already uses)
 *  - `@tabler/icons-react` -> `lucide-react` (avoids a second icon library)
 *  - hardcoded gray/neutral + `dark:` variants -> design tokens. This site has
 *    a single locked dark palette and never sets a `.dark` class, so every
 *    `dark:` variant would have been dead code.
 *  - `rounded-2xl` + circular tiles -> diagonal cut + square tiles, matching
 *    the site's `--radius: 0` / clip-path language.
 *  - internal hrefs route through next/link; static files stay plain anchors.
 *  - magnification is disabled under prefers-reduced-motion.
 **/

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type MouseEventHandler, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

export type DockItem = {
  title: string;
  icon: ReactNode;
  href: string;
};

const isExternal = (href: string) => /^(https?:)?\/\/|^mailto:|^tel:/.test(href);

/**
 * Static assets (/resume.pdf) live in public/ and are not routes — next/link
 * would prefetch and client-navigate them, which never resolves.
 */
const isFile = (href: string) => /\.[a-z0-9]{2,4}($|[?#])/i.test(href.split("/").pop() ?? "");

function DockLink({
  href,
  className,
  children,
  ...rest
}: {
  href: string;
  className?: string;
  children: ReactNode;
} & React.AriaAttributes & {
    onMouseEnter?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
  }) {
  if (isExternal(href) || isFile(href)) {
    const external = isExternal(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}

/** The layered glass pane: base, rim shell, refracting fill, grain, specular streak. */
function GlassPane() {
  return (
    <>
      {/*
       * An opaque base under the glass. Every other layer here is transparent,
       * which is correct over the dark page but not over the footer — the one
       * light surface on the site, and the one the mobile dock is parked on
       * whenever a reader reaches the end of a page. Composited over white the
       * pane stayed white and the white glyph inside it disappeared. Over
       * `--paper` this layer is invisible; over `--ink` it is what keeps the
       * icon at 13:1 instead of 1.1:1.
       */}
      <span aria-hidden className="cut-sm pointer-events-none absolute inset-px bg-paper/85" />
      <span aria-hidden className="glass-rim glass-lift cut-sm pointer-events-none absolute inset-0" />
      <span aria-hidden className="glass-fill cut-sm pointer-events-none absolute inset-px" />
      <span aria-hidden className="glass-grain cut-sm pointer-events-none absolute inset-px" />
      <span aria-hidden className="glass-sheen pointer-events-none absolute inset-x-[12%] top-0 h-px" />
    </>
  );
}

/*
 * Reveal: the pane stretches open from its centre to full width.
 *
 * Animating `width` would relayout every frame and squash the tiles; `scaleX`
 * would distort the glyphs. An inset clip-path grows the visible band instead,
 * so content sits still at final position and is simply uncovered — composited,
 * no distortion. Vertical insets stay generously negative so hover tooltips,
 * the active marker, and the mobile menu are never clipped.
 */
// 3-arg form (left mirrors right) — this is what getComputedStyle returns, so
// the authored and computed shapes match and always interpolate cleanly.
const CLIP_HIDDEN = "inset(-800px 50% -32px)";
const CLIP_SHOWN = "inset(-800px 0% -32px)";

/** Slight overshoot — the elastic settle Apple uses. */
const REVEAL = { type: "spring", stiffness: 220, damping: 26, mass: 0.9 } as const;

export const FloatingDock = ({
  items,
  routes,
  desktopClassName,
  mobileClassName,
  activeHref,
  visible = true,
}: {
  items: DockItem[];
  /**
   * Whole pages, as opposed to sections of the current one. Rendered in the
   * mobile sheet only: the desktop layout already carries them in the utility
   * bar, and repeating them in the rail would be the dock offering links the
   * chrome above it is already showing.
   */
  routes?: { title: string; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
  activeHref?: string | null;
  /** Drives the reveal/conceal transition. */
  visible?: boolean;
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
        activeHref={activeHref}
        visible={visible}
      />
      <FloatingDockMobile
        items={items}
        routes={routes}
        className={mobileClassName}
        activeHref={activeHref}
        visible={visible}
      />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  routes,
  className,
  activeHref,
  visible,
}: {
  items: DockItem[];
  routes?: { title: string; href: string }[];
  className?: string;
  activeHref?: string | null;
  visible: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Concealing the dock closes the menu, so it never reappears still-open on the
  // next scroll down. Adjusted during render rather than in an effect: an effect
  // would need rAF//a paint to land, and rAF is throttled in background tabs —
  // the reset would silently not happen.
  const [wasVisible, setWasVisible] = useState(visible);
  if (wasVisible !== visible) {
    setWasVisible(visible);
    if (!visible && open) setOpen(false);
  }

  const isOpen = open && visible;

  /*
   * A disclosure that declares `aria-expanded` has to behave like one: Escape
   * closes it and hands focus back to the trigger, and a tap outside dismisses
   * it. Neither existed — the only way to close the sheet was the toggle
   * itself, or an upward scroll, and the scroll path has just been removed in
   * DockNav. Both listeners are attached only while the sheet is open.
   */
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  return (
    <motion.div
      ref={rootRef}
      animate={{
        clipPath: visible ? CLIP_SHOWN : CLIP_HIDDEN,
        opacity: visible ? 1 : 0,
      }}
      transition={reduce ? { duration: 0 } : REVEAL}
      className={cn("block md:hidden", className, !visible && "pointer-events-none")}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="nav"
            /*
             * Its own box, and capped. Eleven tiles stand ~490px off the
             * bottom of the screen; a landscape phone has about 330px of
             * height, so the first items ran off the top of a `fixed` wrapper
             * with nothing to scroll. `w-max` keeps the labels inside the
             * scroll box so only the vertical axis moves, and `svh` is the same
             * unit the pinned sections measure in.
             */
            className="absolute bottom-full right-0 mb-3 flex max-h-[calc(100svh-9rem)] w-max flex-col items-end gap-2 overflow-y-auto overscroll-contain"
          >
            {/*
             * Pages first, then sections of a page. Below `sm` the utility bar
             * has room for the status tag and one link, so without this row the
             * only route to /work, /services and /about on a phone is the
             * footer — thirteen sections down. One row of chips rather than
             * three more tiles: the sheet already stands eight items tall and a
             * short phone cannot afford another 150px of column.
             */}
            {routes && routes.length > 0 && (
              <>
                <div className="flex items-center gap-2">
                  {routes.map((route) => (
                    <DockLink
                      key={route.href}
                      href={route.href}
                      aria-current={activeHref === route.href ? "page" : undefined}
                      className="label relative flex h-11 items-center px-3 text-cobalt focus-visible:-outline-offset-4"
                    >
                      <GlassPane />
                      <span className="relative">[{route.title}]</span>
                    </DockLink>
                  ))}
                </div>
                <span aria-hidden className="my-1 h-px w-11 bg-[var(--hairline)]" />
              </>
            )}
            {items.map((item, idx) => {
              const active = activeHref === item.href;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10, transition: { delay: idx * 0.05 } }}
                  transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <span className="label border border-[var(--hairline)] bg-paper-deep/90 px-2 py-1 text-cobalt backdrop-blur-md">
                    [{item.title}]
                  </span>
                  <DockLink
                    href={item.href}
                    aria-label={item.title}
                    aria-current={active ? "page" : undefined}
                    // Ring pulled inside the pane: the default 3px offset draws
                    // it on whatever is behind the dock, which over the footer
                    // is white on white.
                    className="relative flex h-11 w-11 shrink-0 items-center justify-center focus-visible:-outline-offset-4"
                  >
                    <GlassPane />
                    <span
                      className={cn(
                        "relative flex h-[18px] w-[18px] items-center justify-center text-[13px] transition-colors",
                        active ? "text-cobalt" : "text-ink",
                      )}
                    >
                      {item.icon}
                    </span>
                  </DockLink>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        ref={toggleRef}
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        className="relative flex h-12 w-12 items-center justify-center focus-visible:-outline-offset-4"
      >
        <GlassPane />
        <Menu
          className={cn(
            "relative h-5 w-5 transition-[color,transform] duration-300",
            isOpen ? "rotate-90 text-cobalt" : "text-ink",
          )}
        />
      </button>
    </motion.div>
  );
};

/*
 * Desktop rail — a slim vertical column in the page's own margin, not a wide
 * bar claiming the bottom of the screen. No magnify-on-approach: at eleven
 * items that move was most of why the old dock read as heavy. What is left is
 * eight small, fixed-size marks and a hairline tying them together — the same
 * progress-rail language `PinnedLitText` and `ScrollRail` already use
 * elsewhere on the page, so the nav looks like part of the site rather than a
 * widget bolted onto it.
 */
const RAIL_TILE = 30;

const FloatingDockDesktop = ({
  items,
  className,
  activeHref,
  visible,
}: {
  items: DockItem[];
  className?: string;
  activeHref?: string | null;
  visible: boolean;
}) => {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const activeIndex = items.findIndex((item) => item.href === activeHref);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 12 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
      className={cn("hidden md:flex flex-col items-center", className, !visible && "pointer-events-none")}
    >
      {/* The hairline sits behind the tiles, full height, so it reads as one
          spine the marks hang off rather than a separate progress bar. */}
      <div className="relative flex flex-col items-center gap-2 px-1.5 py-2">
        <span
          aria-hidden
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-[var(--hairline)]"
        />
        {items.map((item, i) => (
          <RailTile key={item.title} {...item} active={i === activeIndex} />
        ))}
      </div>
    </motion.div>
  );
};

function RailTile({
  title,
  icon,
  href,
  active,
}: {
  title: string;
  icon: ReactNode;
  href: string;
  active: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <DockLink
      href={href}
      aria-label={title}
      aria-current={active ? "page" : undefined}
      className="group relative shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{ width: RAIL_TILE, height: RAIL_TILE }}
        className={cn(
          "relative flex items-center justify-center border bg-paper text-[11px] transition-colors duration-200",
          active
            ? "border-cobalt/60 text-cobalt"
            : "border-[var(--hairline)] text-ink-muted group-hover:border-cobalt/45 group-hover:text-cobalt",
        )}
      >
        {icon}
      </span>

      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 2 }}
            transition={{ duration: 0.15 }}
            className="label pointer-events-none absolute right-full top-1/2 mr-3 w-max -translate-y-1/2 border border-[var(--hairline)] bg-paper-deep/95 px-2 py-1 text-cobalt backdrop-blur-md"
          >
            [{title}]
          </motion.span>
        )}
      </AnimatePresence>
    </DockLink>
  );
}
