"use client";
/**
 * Floating dock — liquid-glass chrome on editorial geometry.
 *
 * Adapted from the original Aceternity component for this project:
 *  - no motion library: the reveal, the menu and the rail labels are CSS
 *    transitions and keyframes. This component is on every route, and it was
 *    one of the reasons a second animation runtime shipped next to GSAP.
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
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
  onClick,
  ...rest
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
} & React.AriaAttributes) {
  if (isExternal(href) || isFile(href)) {
    const external = isExternal(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
        className={className}
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
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

/**
 * A fast start and a long, soft settle — what the spring this replaced
 * (near-critically damped, so it never visibly overshot) actually drew.
 */
const SETTLE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Menu tiles enter and leave one after another, this far apart. */
const STAGGER_S = 0.05;
const ITEM_S = 0.25;

export const FloatingDock = ({
  items,
  routes,
  footer,
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
  /** The phone menu's last block: the ways to get in touch. */
  footer?: ReactNode;
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
        footer={footer}
        className={mobileClassName}
        activeHref={activeHref}
        visible={visible}
      />
    </>
  );
};

/*
 * Phone navigation: a glass button in the corner that opens a full-screen
 * menu. It used to open a column of tiles above the button, and that column
 * sat inside the button's reveal clip, which is only the button wide — so the
 * page links and every section's name were cut off at the button's edge, and
 * what was left floated bare over the page text. The menu is its own layer
 * now, outside the clip, on an opaque panel: the pages, then this page's
 * sections as a numbered list, then the ways to get in touch.
 */
const FloatingDockMobile = ({
  items,
  routes,
  footer,
  className,
  activeHref,
  visible,
}: {
  items: DockItem[];
  routes?: { title: string; href: string }[];
  footer?: ReactNode;
  className?: string;
  activeHref?: string | null;
  visible: boolean;
}) => {
  const [open, setOpen] = useState(false);
  /** Open, but playing its tiles out before the sheet unmounts. */
  const [closing, setClosing] = useState(false);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef(0);

  // Concealing the dock closes the menu, so it never reappears still-open on the
  // next scroll down. Adjusted during render rather than in an effect: an effect
  // would need rAF//a paint to land, and rAF is throttled in background tabs —
  // the reset would silently not happen. No exit here: the whole dock is
  // already clipping itself away.
  const [wasVisible, setWasVisible] = useState(visible);
  if (wasVisible !== visible) {
    setWasVisible(visible);
    if (!visible && open) {
      setOpen(false);
      setClosing(false);
    }
  }

  const isOpen = open && visible;
  const expanded = isOpen && !closing;

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /*
   * Closing waits for the panel's fade out. A timer rather than
   * `animationend`, which never fires when the animations are switched off.
   */
  const exitMs = reduce ? 0 : MENU_OUT_MS;
  const close = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    if (exitMs === 0) {
      setOpen(false);
      return;
    }
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, exitMs);
  }, [exitMs]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  /*
   * While the menu is open: Escape closes it and hands focus back to the
   * button that opened it, focus starts on its close button, and the page
   * underneath holds still — a swipe on the panel must not scroll the page
   * it covers.
   */
  useEffect(() => {
    if (!expanded) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      toggleRef.current?.focus();
    };
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = overflow;
    };
  }, [expanded, close]);

  const open_ = () => {
    // Opening — or catching a menu that is still on its way out.
    window.clearTimeout(closeTimer.current);
    setClosing(false);
    setOpen(true);
  };

  return (
    <>
      <div
        ref={rootRef}
        style={{
          clipPath: visible ? CLIP_SHOWN : CLIP_HIDDEN,
          opacity: visible ? 1 : 0,
          transition: reduce ? "none" : `clip-path 0.5s ${SETTLE}, opacity 0.3s ease-out`,
        }}
        className={cn("block md:hidden", className, !visible && "pointer-events-none")}
      >
        <button
          type="button"
          ref={toggleRef}
          onClick={() => (expanded ? close() : open_())}
          aria-expanded={expanded}
          aria-controls="site-menu"
          aria-label={expanded ? "Close navigation" : "Open navigation"}
          className="relative flex h-12 w-12 items-center justify-center focus-visible:-outline-offset-4"
        >
          <GlassPane />
          <Menu className="relative h-5 w-5 text-ink" />
        </button>
      </div>

      {isOpen && (
        <div
          ref={panelRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-80 flex flex-col bg-paper-deep md:hidden"
          style={{
            animation: reduce ? "none" : `${closing ? "menu-out" : "menu-in"} ${MENU_OUT_MS / 1000}s ${SETTLE} both`,
          }}
        >
          <div className="wrap flex h-(--bar-h) shrink-0 items-center justify-between rule-b">
            <span className="label text-ink-muted">[MENU]</span>
            <button
              type="button"
              ref={closeRef}
              onClick={() => {
                close();
                toggleRef.current?.focus({ preventScroll: true });
              }}
              aria-label="Close navigation"
              className="-mr-2.5 flex h-11 w-11 items-center justify-center text-ink hover:text-cobalt"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="wrap flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-[max(2rem,env(safe-area-inset-bottom))]">
            {/* The site's pages: below `sm` the utility bar has no room for them. */}
            {routes && routes.length > 0 && (
              <ul className="mt-6 grid grid-cols-3 gap-2">
                {routes.map((route) => {
                  const current = activeHref === route.href;
                  return (
                    <li key={route.href}>
                      <DockLink
                        href={route.href}
                        onClick={close}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "label flex h-11 items-center justify-center border transition-colors",
                          current ? "border-cobalt text-cobalt" : "border-[var(--hairline)] text-ink hover:border-cobalt hover:text-cobalt",
                        )}
                      >
                        {route.title}
                      </DockLink>
                    </li>
                  );
                })}
              </ul>
            )}

            <p className="label mt-8 text-ink-muted">[ON THIS PAGE]</p>
            <ol className="mt-2 rule-t">
              {items.map((item, idx) => {
                const active = activeHref === item.href;
                return (
                  <li
                    key={item.title}
                    className="dock-item rule-b"
                    style={{
                      animation: reduce ? "none" : `dock-item-in ${ITEM_S}s ${SETTLE} ${0.06 + idx * STAGGER_S * 0.7}s both`,
                    }}
                  >
                    <DockLink
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-center gap-4 py-3"
                    >
                      <span
                        className={cn(
                          "flex h-5 w-7 shrink-0 items-center text-sm",
                          active ? "text-cobalt" : "text-ink-muted group-hover:text-cobalt",
                        )}
                      >
                        <span className="flex h-5 w-5 items-center justify-center">{item.icon}</span>
                      </span>
                      <span
                        className={cn(
                          "display text-[2rem] leading-none transition-colors",
                          active ? "text-cobalt" : "text-ink group-hover:text-cobalt",
                        )}
                      >
                        {item.title}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "ml-auto text-lg transition-[color,translate]",
                          active ? "text-cobalt" : "text-ink-muted group-hover:translate-x-1 group-hover:text-cobalt",
                        )}
                      >
                        {active ? "●" : "→"}
                      </span>
                    </DockLink>
                  </li>
                );
              })}
            </ol>

            {footer && (
              <div className="mt-auto pt-8" onClick={close}>
                {footer}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/** The phone menu's fade in and out, in ms. */
const MENU_OUT_MS = 280;

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
    <div
      style={{
        opacity: visible ? 1 : 0,
        // `transform`, not the `translate` property: the rail is centred with
        // Tailwind's `-translate-y-1/2`, which owns `translate`. The two
        // compose rather than one overwriting the other.
        transform: visible ? "none" : "translateX(12px)",
        transition: reduce ? "none" : `opacity 0.35s ease-out, transform 0.45s ${SETTLE}`,
      }}
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
    </div>
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
  return (
    <DockLink
      href={href}
      aria-label={title}
      aria-current={active ? "page" : undefined}
      className="group relative shrink-0"
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

      {/*
       * Hover state in CSS rather than React: no re-render per tile per hover,
       * and keyboard focus gets the same label a pointer does. `invisible`
       * while hidden, so the blur behind it is not composited for nothing;
       * the name itself is the link's `aria-label`, hence `aria-hidden`.
       */}
      <span
        aria-hidden
        className="label pointer-events-none invisible absolute right-full top-1/2 mr-3 w-max -translate-y-1/2 translate-x-1 border border-[var(--hairline)] bg-paper-deep/95 px-2 py-1 text-cobalt opacity-0 backdrop-blur-md transition-[opacity,translate,visibility] duration-150 group-hover:visible group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:visible group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        [{title}]
      </span>
    </DockLink>
  );
}
