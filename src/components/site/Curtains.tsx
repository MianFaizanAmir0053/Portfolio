"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Page-load curtain: ink panel wipes upward off-screen. */
export function LoadCurtain() {
  const reduce = useReducedMotion();
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setGone(true), reduce ? 100 : 1200);
    return () => window.clearTimeout(t);
  }, [reduce]);

  if (gone) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] bg-paper-deep"
      initial={{ y: 0 }}
      animate={reduce ? { opacity: 0 } : { y: "-100%" }}
      transition={{ duration: reduce ? 0.2 : 1, ease: EASE, delay: reduce ? 0 : 0.25 }}
    />
  );
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
