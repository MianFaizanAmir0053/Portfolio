"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis smooth scrolling, wired into the GSAP ticker.
 *
 * The page is already built on ScrollTrigger pins, so Lenis cannot be dropped
 * in on its own raf loop — two clocks reading and writing scroll position in
 * the same frame is what makes pinned sections judder. Instead Lenis is stepped
 * from GSAP's ticker and pushes every position change into `ScrollTrigger.update`,
 * so measurement and animation stay on one clock.
 *
 * Wheel only. Touch keeps its native behaviour: hijacking it costs INP on
 * mobile and fights the horizontal panels, which are their own scrollers.
 */
export function SmoothScroll() {
  useEffect(() => {
    // A smoothed scroll is an animation. Anyone who asked the OS not to see
    // animations gets the browser's own scrolling, untouched.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      // Stepped from the GSAP ticker below, not from its own requestAnimationFrame.
      autoRaf: false,
      // Interpolation rather than a fixed duration: it keeps up with a fast
      // flick instead of queueing a long tween behind it.
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      // `#work` links from the dock and footer glide instead of jumping.
      anchors: true,
      // Any nested scroller opts out by marking itself — the horizontal
      // case-study rail scrolls itself and must not be intercepted.
      prevent: (node) => node.hasAttribute("data-lenis-prevent"),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    // GSAP's lag smoothing pauses the ticker after a long frame, which would
    // strand Lenis mid-scroll on a slow first paint.
    gsap.ticker.lagSmoothing(0);

    // Pin distances were measured against the native scroller; re-measure now
    // that Lenis owns the scroll position.
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
