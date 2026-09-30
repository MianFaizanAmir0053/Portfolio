"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";
import { isLite } from "@/lib/lite";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const EASE = "cubic-bezier(0.16,1,0.3,1)";

/**
 * Wide enough, in the zoom view, for the smallest type in a figure to read.
 * The diagrams set their sub-labels at 20px on a 1600px canvas: at 1200px
 * that is 15px, where on a phone's own width it was 4px. Screenshots hold up
 * a little narrower.
 */
const ZOOM_MIN_VECTOR = 1200;
const ZOOM_MIN_RASTER = 1000;

/** The frame spans the page's content width, or the whole screen on a phone. */
export const FULL_WIDTH_SIZES =
  "(min-width: 1536px) 1456px, (min-width: 768px) calc(100vw - 8rem), 100vw";

/**
 * A case-study figure: a screenshot or a diagram, shown at its own shape.
 *
 * What it replaces on the case-study pages is `CutFrame`, which forced every
 * image into a 16:10 or 16:9 box, then inset it by 4% at the sides and 12% at
 * top and bottom so a parallax could travel without exposing an edge. Fitted
 * into what was left, a phone screenshot came out at roughly half the width
 * of its frame and a diagram's labels at 7px — the "images are not good
 * quality" a reviewer saw, though every source file is 1600–2400px wide.
 *
 * Here the frame takes the image's own aspect ratio from its header (see
 * `imageMeta`), so nothing letterboxes and nothing is cropped. Nothing moves
 * it on scroll either: a transform that never comes to rest re-samples the
 * picture on every frame, which is the other half of a soft screenshot.
 * Raster sources are served at quality 90, where AVIF keeps small UI type
 * legible.
 *
 * It arrives the way the site's headlines do, on a curtain — a clip that
 * rises off it once, as it enters, and then leaves it alone. Anything already
 * on screen at first paint, reduced motion and lite mode all get the plain,
 * finished frame.
 *
 * Every figure opens full screen. On a desktop that is the same picture with
 * nothing around it; on a phone it is the only way to read a diagram at all,
 * so the zoom view holds it at a legible width and lets it pan.
 */
export function CaseFigure({
  src,
  alt,
  width,
  height,
  sizes = FULL_WIDTH_SIZES,
  cut = "cut-tr",
  eager = false,
  bleed = false,
  label,
  caption,
  className,
}: {
  src: string;
  alt: string;
  /** Intrinsic size, from `imageMeta`. Sets the frame's aspect ratio. */
  width: number;
  height: number;
  sizes?: string;
  cut?: "cut-tr" | "cut-bl" | "cut-br";
  /** The cover: fetched first, and never held behind a curtain. */
  eager?: boolean;
  /** Edge to edge below `md`, where the page's gutter costs a phone 10% of the picture. */
  bleed?: boolean;
  /** Short name for the figure: the zoom button and the zoom view's title. */
  label: string;
  caption?: ReactNode;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  /*
   * The full-size file is fetched on first open, not with the page, and kept
   * after that: unmounting it on close would blank the picture while the
   * dialog is still fading out.
   */
  const [opened, setOpened] = useState(false);
  const vector = /\.svg($|\?)/i.test(src);
  const { armed, hidden } = useCurtain(frameRef, !eager);

  return (
    <figure className={cn("relative", className)}>
      <div className={cn("group relative", bleed && "-mx-5 md:mx-0")}>
        <div
          ref={frameRef}
          className={cn("relative overflow-hidden bg-paper-deep", cut)}
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          <div
            className="absolute inset-0"
            style={
              armed
                ? {
                    clipPath: hidden ? "inset(100% 0 0 0)" : "inset(0 0 0 0)",
                    transition: `clip-path 1.1s ${EASE}`,
                  }
                : undefined
            }
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes={sizes}
              quality={vector ? undefined : 90}
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : "auto"}
              className="block h-full w-full object-contain"
              style={
                armed
                  ? {
                      transform: hidden ? "scale(1.06)" : "none",
                      transition: `transform 1.4s ${EASE}`,
                      willChange: hidden ? "transform" : "auto",
                    }
                  : undefined
              }
            />
          </div>

          {/* The whole picture is the control; the image keeps its own alt. */}
          <button
            type="button"
            onClick={() => {
              setOpened(true);
              setOpen(true);
            }}
            aria-haspopup="dialog"
            aria-label={`View full size: ${label}`}
            className="absolute inset-0 cursor-zoom-in focus-visible:outline-offset-[-4px]"
          />
        </div>

        {/*
         * The site's lime "+" marker, now doing a job: it says the picture
         * opens, and the wording slides out beside it on hover. It sits inside
         * the frame's corner on a phone, where the figure runs to the screen's
         * edge and anything hung outside it would scroll the page sideways;
         * from `md` it hangs off the corner, as the site's frames have it.
         */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute flex items-center md:-top-2 md:-right-2",
            bleed ? "top-0 right-0" : "-top-2 -right-2",
          )}
        >
          {/*
           * A diagram is unreadable at a phone's width, and a touch screen
           * never hovers, so there the words stay up: the "+" alone does not
           * say that the small type becomes legible behind it.
           */}
          <span
            className={cn(
              "label mr-1 translate-x-1 bg-cobalt px-2 py-1.5 text-paper opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100",
              vector && "pointer-coarse:translate-x-0 pointer-coarse:opacity-100",
            )}
          >
            View full size
          </span>
          <span className="flex h-8 w-8 items-center justify-center bg-cobalt font-display text-lg leading-none text-paper">
            +
          </span>
        </span>
      </div>

      {caption && <figcaption className="mt-4">{caption}</figcaption>}

      <Lightbox
        open={open}
        mounted={opened}
        onClose={() => setOpen(false)}
        src={src}
        alt={alt}
        width={width}
        height={height}
        vector={vector}
        label={label}
      />
    </figure>
  );
}

/**
 * The curtain: hidden before first paint if the figure starts below the fold,
 * then lifted once when it scrolls in. Same contract as `FadeIn` — the server
 * ships it visible, so without JavaScript nothing is ever covered.
 */
function useCurtain(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || isLite()) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  return { armed, hidden: armed && !shown };
}

/**
 * Full-screen view of one figure, on a native modal `<dialog>`: the browser
 * supplies the focus trap, Escape, and focus returning to the figure.
 *
 * The page underneath stays put. Lenis is told to leave the dialog's wheel
 * events alone (`data-lenis-prevent`), so the picture pans natively, and the
 * root stops scrolling for as long as it is open.
 */
function Lightbox({
  open,
  mounted,
  onClose,
  src,
  alt,
  width,
  height,
  vector,
  label,
}: {
  open: boolean;
  /** True from the first open on: the picture inside is loaded then, and kept. */
  mounted: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  width: number;
  height: number;
  vector: boolean;
  label: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    /*
     * The page underneath holds still. Hiding the root's overflow takes its
     * scrollbar away, so the body is padded by the scrollbar's width to keep
     * the layout the same width behind the dialog — otherwise every line
     * re-wraps and the page lands somewhere else on close. (Not
     * `scrollbar-gutter: stable`: on the root it also shrinks every `vw`
     * unit, which reflows the page's fluid headings just the same.)
     */
    const root = document.documentElement;
    const { body } = document;
    const bar = window.innerWidth - root.clientWidth;
    const saved = { overflow: root.style.overflow, padding: body.style.paddingRight };
    root.style.overflow = "hidden";
    if (bar > 0) body.style.paddingRight = `${bar}px`;

    if (!dialog.open) dialog.showModal();

    /*
     * Wider than the screen means a phone: open on the middle of the picture
     * rather than its left edge. Measured from the layout box, not
     * `scrollWidth` — the picture is still scaled down for its opening
     * settle, and the transform shortens the scrollable width until it ends.
     */
    const scroller = scrollerRef.current;
    const picture = scroller?.querySelector("img");
    if (scroller && picture) {
      scroller.scrollLeft = picture.offsetLeft + picture.offsetWidth / 2 - scroller.clientWidth / 2;
      scroller.scrollTop = 0;
    }

    return () => {
      root.style.overflow = saved.overflow;
      body.style.paddingRight = saved.padding;
    };
  }, [open]);

  // A click on the empty space around the picture closes it, as it would a sheet.
  const onBackdrop = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );

  const min = vector ? ZOOM_MIN_VECTOR : ZOOM_MIN_RASTER;
  const ratio = width / height;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={label}
      data-lenis-prevent
      className="lightbox fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden bg-paper p-0 text-ink backdrop:bg-transparent"
    >
      <div className="flex h-full flex-col">
        <div className="wrap flex h-14 shrink-0 items-center justify-between gap-6 rule-b">
          <p className="label truncate text-ink">{label}</p>
          <button
            type="button"
            onClick={onClose}
            className="label -mr-3 flex h-11 shrink-0 items-center gap-2 px-3 text-ink transition-colors hover:text-cobalt"
          >
            Close <span aria-hidden className="text-base leading-none">×</span>
          </button>
        </div>

        {/* Focusable, so the arrow keys pan a picture wider than the screen. */}
        <div
          ref={scrollerRef}
          role="region"
          tabIndex={0}
          aria-label={`${label}, scroll to pan`}
          onClick={onBackdrop}
          className="relative flex min-h-0 flex-1 overflow-auto overscroll-contain focus-visible:outline-offset-[-3px]"
        >
          {mounted && (
            <div
              onClick={onBackdrop}
              className="flex min-h-full min-w-full p-4 md:p-8"
            >
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes={`(max-width: ${min}px) ${min}px, 100vw`}
                quality={vector ? undefined : 90}
                className="lightbox-image m-auto block h-auto max-w-none"
                style={
                  {
                    // Fit the screen where it is big enough; otherwise hold a
                    // legible width and let the reader pan across it.
                    width: `max(min(100%, calc((100dvh - 7.5rem) * ${ratio})), ${min}px)`,
                  } as CSSProperties
                }
              />
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
