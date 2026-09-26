export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-KJSVNLRR";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-7NG4EKXYDX";

/**
 * GTM gets a data layer of its own; `dataLayer` belongs to gtag.js.
 *
 * They used to share one. GTM reads gtag commands off its data layer, so
 * whenever the container got to the queue before gtag.js had registered, it
 * found gtag's `config` for the GA4 property and downloaded a second copy of
 * the same Google tag to act on it (`gtag/js?id=…&cx=c`, ~170KB). Which script
 * won was down to network timing, so it happened on some loads and not
 * others. Separate queues mean the container never sees gtag's commands.
 */
export const GTM_DATA_LAYER = "gtmDataLayer";

type DataLayerEntry = Record<string, unknown> | IArguments;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    [GTM_DATA_LAYER]?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Push an event onto the GTM data layer. No-ops during SSR. */
export function gtmPush(event: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  (window[GTM_DATA_LAYER] ??= []).push(event);
}

/**
 * Send a gtag command to GA4. gtag.js only reads its own `dataLayer`, so a
 * `gtmPush` never reaches the GA4 property — these are separate pipes.
 */
export function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.gtag?.(...args);
}
