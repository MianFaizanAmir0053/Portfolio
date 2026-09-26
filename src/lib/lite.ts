/**
 * Lite mode: the same site, with the continuous effects switched off, for
 * devices and connections that cannot carry them.
 *
 * Decided once, by an inline script in the document <head> (see `LITE_SCRIPT`)
 * before anything paints, and recorded as `data-lite` on <html>. The
 * stylesheet reads the attribute for the CSS side — no load curtain, no
 * backdrop blur, no idle loops — and components read it through `isLite()` /
 * `useLite()` to take the paths they already have for reduced motion: native
 * scrolling instead of Lenis, sections that flow instead of pinning, a still
 * portrait instead of an animated one.
 *
 * What counts as constrained, and why each signal is there:
 *  - `saveData` — the visitor asked their browser, in so many words, to use
 *    less. Also the `prefers-reduced-data` media query, where supported.
 *  - an effective connection of 2G — the page's own chunks are still arriving
 *    long after the first screen; nothing optional should compete with them.
 *  - `deviceMemory` of 2GB or less — the clearest signal Chrome gives for the
 *    phones and laptops that stutter on pinned, scrubbed sections.
 * `hardwareConcurrency` is deliberately not one of them: cheap Android phones
 * report eight slow cores, and Safari reports a capped value, so it would
 * misjudge both ends.
 */
export const LITE_SCRIPT = `(function(){try{var n=navigator,c=n.connection||{},m=n.deviceMemory;if(c.saveData||/(^|-)2g$/.test(c.effectiveType||"")||(m&&m<=2)||matchMedia("(prefers-reduced-data: reduce)").matches)document.documentElement.setAttribute("data-lite","")}catch(e){}})();`;

/** Whether this document is running in lite mode. Client-only. */
export function isLite() {
  return typeof document !== "undefined" && document.documentElement.hasAttribute("data-lite");
}
