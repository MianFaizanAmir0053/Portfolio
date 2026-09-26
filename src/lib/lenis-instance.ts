import type Lenis from "lenis";

/**
 * The page's one Lenis instance, for components that need to cooperate with it
 * rather than write to the scroll position behind its back.
 *
 * `SmoothScroll` and its consumers are siblings in the layout, so either
 * effect can run first. Subscribing covers both orders: a late subscriber is
 * handed the instance straight away, an early one is called when it arrives.
 * The callback's return value runs as cleanup when the instance goes away.
 */
type Listener = (lenis: Lenis) => void | (() => void);

let current: Lenis | null = null;
const listeners = new Map<Listener, (() => void) | void>();

export function setLenis(lenis: Lenis | null) {
  listeners.forEach((cleanup, listener) => {
    cleanup?.();
    listeners.set(listener, lenis ? listener(lenis) : undefined);
  });
  current = lenis;
}

export function onLenis(listener: Listener) {
  listeners.set(listener, current ? listener(current) : undefined);
  return () => {
    listeners.get(listener)?.();
    listeners.delete(listener);
  };
}
