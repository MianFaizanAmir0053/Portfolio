export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-KJSVNLRR";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-7NG4EKXYDX";

type DataLayerEntry = Record<string, unknown> | IArguments;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Push an event onto the GTM dataLayer. No-ops during SSR. */
export function gtmPush(event: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
}

/**
 * Send a gtag command to GA4. gtag.js reads the same dataLayer but only acts on
 * its own `arguments` objects, so a plain `gtmPush` never reaches the GA4
 * property — these two are separate pipes despite the shared queue.
 */
export function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.gtag?.(...args);
}
