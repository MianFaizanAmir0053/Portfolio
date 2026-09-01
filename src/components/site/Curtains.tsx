"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Page-load curtain: ink panel wipes upward off-screen.
 *
 * Pure CSS, deliberately. The previous version waited for hydration before
 * starting a 1.2s timer and then animated for another second, so an opaque
 * panel covered the page for roughly two and a half seconds — and on a slow
 * connection, for as long as the JavaScript took to arrive. A keyframe
 * animation declared in the stylesheet starts when the document parses, so the
 * curtain is gone on a fixed schedule whether or not React has booted, and the
 * content behind it paints on time. `prefers-reduced-motion` is handled in the
 * stylesheet too — see `.load-curtain` in globals.css.
 */
export function LoadCurtain() {
  return <div aria-hidden className="load-curtain" />;
}

/** Route curtain: cobalt panel wipes across on navigation. */
export function RouteCurtain() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [key, setKey] = useState<string | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setKey(pathname + Date.now());
    const t = window.setTimeout(() => setKey(null), 900);
    return () => window.clearTimeout(t);
  }, [pathname]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {key && (
        <motion.div
          key={key}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[80] bg-cobalt"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.45, ease: EASE }}
        />
      )}
    </AnimatePresence>
  );
}
