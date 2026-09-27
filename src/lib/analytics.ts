export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-7NG4EKXYDX";

type DataLayerEntry = Record<string, unknown> | IArguments;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Send a gtag command to GA4. No-ops during SSR and until gtag.js is set up. */
export function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.gtag?.(...args);
}
