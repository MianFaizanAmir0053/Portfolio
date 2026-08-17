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
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Fragment, useRef, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

export type DockItem = {
  title: string;
  icon: ReactNode;
  href: string;
  /** Items with differing groups get a hairline divider between them. */
  group?: string;
};

const REST_SIZE = 44;

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
} & React.AriaAttributes) {
  if (isExternal(href) || isFile(href)) {
    const external = isExternal(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
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

/** The layered glass pane: rim shell, refracting fill, grain, specular streak. */
function GlassPane() {
  return (
    <>
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
  desktopClassName,
  mobileClassName,
  activeHref,
  visible = true,
}: {
  items: DockItem[];
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
        className={mobileClassName}
        activeHref={activeHref}
        visible={visible}
      />
    </>
  );
};

const FloatingDockMobile = ({
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
  const [open, setOpen] = useState(false);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");

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

  return (
    <motion.div
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
            className="absolute inset-x-0 bottom-full mb-3 flex flex-col items-end gap-2"
          >
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
                    className="relative flex h-11 w-11 shrink-0 items-center justify-center"
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
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        className="relative flex h-12 w-12 items-center justify-center"
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
  const mouseX = useMotionValue(Infinity);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      animate={{
        clipPath: visible ? CLIP_SHOWN : CLIP_HIDDEN,
        opacity: visible ? 1 : 0,
      }}
      transition={reduce ? { duration: 0 } : REVEAL}
      className={cn("hidden md:block", className, !visible && "pointer-events-none")}
    >
      <GlassPane />
      <div className="relative flex h-[72px] items-end gap-3 px-4 pb-3.5">
        {items.map((item, i) => (
          <Fragment key={item.title}>
            {i > 0 && items[i - 1].group !== item.group && (
              <span aria-hidden className="mb-3 h-7 w-px shrink-0 self-end bg-[var(--hairline)]" />
            )}
            <IconContainer mouseX={mouseX} active={activeHref === item.href} {...item} />
          </Fragment>
        ))}
      </div>
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  active,
}: {
  mouseX: MotionValue;
  title: string;
  icon: ReactNode;
  href: string;
  active: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [REST_SIZE, 82, REST_SIZE]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [REST_SIZE, 82, REST_SIZE]);
  const iconWidthTransform = useTransform(distance, [-150, 0, 150], [20, 38, 20]);
  const iconHeightTransform = useTransform(distance, [-150, 0, 150], [20, 38, 20]);
  // Numeral glyphs scale by font-size, not box size, so they magnify too.
  const fontTransform = useTransform(distance, [-150, 0, 150], [15, 30, 15]);

  const spring = { mass: 0.1, stiffness: 150, damping: 12 };
  const width = useSpring(widthTransform, spring);
  const height = useSpring(heightTransform, spring);
  const widthIcon = useSpring(iconWidthTransform, spring);
  const heightIcon = useSpring(iconHeightTransform, spring);
  const fontSize = useSpring(fontTransform, spring);

  const [hovered, setHovered] = useState(false);

  return (
    <DockLink
      href={href}
      aria-label={title}
      aria-current={active ? "page" : undefined}
      className="relative shrink-0"
    >
      <motion.div
        ref={ref}
        style={reduce ? { width: REST_SIZE, height: REST_SIZE } : { width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex items-center justify-center border transition-colors duration-200",
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-ink/30",
          active
            ? "border-cobalt/55 bg-cobalt/15 text-cobalt"
            : "border-[var(--hairline)] bg-ink/8 text-ink hover:border-cobalt/45 hover:bg-ink/15 hover:text-cobalt",
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, y: 6, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              transition={{ duration: 0.18 }}
              className="label absolute -top-10 left-1/2 w-fit border border-[var(--hairline)] bg-paper-deep/95 px-2 py-1 whitespace-pre text-cobalt backdrop-blur-md"
            >
              [{title}]
            </motion.span>
          )}
        </AnimatePresence>

        <motion.span
          style={
            reduce
              ? { width: 20, height: 20, fontSize: 15 }
              : { width: widthIcon, height: heightIcon, fontSize }
          }
          className="relative flex items-center justify-center"
        >
          {icon}
        </motion.span>
      </motion.div>

      {active && (
        <span
          aria-hidden
          className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 bg-cobalt"
        />
      )}
    </DockLink>
  );
}
