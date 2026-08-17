"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Reads a media query as an external store rather than syncing it into state
 * from an effect. Server/hydration snapshot is always `false`, so markup is
 * stable and the real value lands on the first client render.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const noopSubscribe = () => () => {};

/** True only after hydration — for deciding whether to mount client-only work. */
export function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
