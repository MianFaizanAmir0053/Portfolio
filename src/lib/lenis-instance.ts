import type Lenis from "lenis";
import type { VirtualScrollData } from "lenis";
import { introUp } from "./intro";

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

/**
 * Wheel input a section takes over, turning it into steps instead of a glide.
 *
 * Each gate sees every wheel and touch event, with Lenis's normalised deltas,
 * before Lenis acts on it — wired in as Lenis's `virtualScroll` option.
 * Returning `false` claims the event and Lenis leaves it alone; the gate is
 * then responsible for the event's `preventDefault`.
 */
type WheelGate = (data: VirtualScrollData) => boolean;

const gates = new Set<WheelGate>();

export function gateWheel(gate: WheelGate) {
  gates.add(gate);
  return () => {
    gates.delete(gate);
  };
}

export function passWheel(data: VirtualScrollData) {
  /*
   * Nothing scrolls under the first-load intro. The head script's own wheel
   * hold stops the browser scrolling, but Lenis scrolls the page itself, and
   * it boots while the intro is still up. `lenis.stop()` would hold it too,
   * but it also clips the root's overflow, which drops the scrollbar and
   * re-lays the page out at a new width under every pinned section.
   */
  if (introUp()) {
    if (data.event.type === "wheel" && data.event.cancelable) data.event.preventDefault();
    return false;
  }
  for (const gate of gates) if (!gate(data)) return false;
  return true;
}
