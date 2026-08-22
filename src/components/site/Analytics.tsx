"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { GA_ID, GTM_ID, gtmPush } from "@/lib/analytics";

/**
 * Google Tag Manager container script. Rendered from the root layout so it
 * loads on every page; `beforeInteractive` hoists it ahead of first-party code.
 */
export function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    // The rule targets the Pages Router, where `beforeInteractive` belongs in
    // `pages/_document.js`. This is the App Router root layout, which is
    // exactly where Next's docs say to put it.
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="gtm-base" strategy="beforeInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/** The <noscript> fallback iframe for visitors without JavaScript. */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

/**
 * The GA4 Google tag (gtag.js), measuring directly into the property rather
 * than through the GTM container.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        id="ga-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}

// Module scope, not a ref: the tracker can remount (Suspense, HMR, StrictMode)
// within a single document load, and a ref would reset with it — re-reporting
// the landing page that gtm.js has already counted.
let lastReportedUrl: string | null = null;
let lastReportedTitle = "";

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    // The container script fires its own pageview on load, so the first URL of
    // a document load is seeded, not pushed. Only the client-side navigations
    // that follow are reported.
    if (lastReportedUrl === null) {
      lastReportedUrl = url;
      lastReportedTitle = document.title;
      return;
    }
    if (lastReportedUrl === url) return;
    lastReportedUrl = url;

    // Next applies the new route's metadata after this effect runs, so
    // document.title still holds the previous page's value here. Poll briefly
    // for it to change, with a cap so identical titles still report.
    // Timers, not requestAnimationFrame: rAF is suspended in background tabs,
    // which would silently drop the page_view for anyone browsing in one.
    const previousTitle = lastReportedTitle;
    let attempts = 0;

    const report = () => {
      // Next blanks the title while the new route streams in, so an empty one
      // means "not settled yet", not "changed".
      const settled = document.title !== "" && document.title !== previousTitle;
      if (!settled && attempts < 20) {
        attempts += 1;
        window.setTimeout(report, 50);
        return;
      }
      lastReportedTitle = document.title;

      const payload = {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
      };

      // GTM only. GA4's enhanced measurement already emits its own page_view on
      // browser-history changes, so sending one through gtag as well would
      // double-count every client-side navigation in the property.
      gtmPush({ event: "page_view", ...payload });
    };

    // Deliberately not cancelled on cleanup: the Suspense boundary around this
    // tracker can re-suspend mid-navigation, and tearing down a pending timer
    // would drop the page_view entirely. `lastReportedUrl` is already claimed
    // above, so a remount cannot double-report it.
    window.setTimeout(report, 0);
  }, [pathname, searchParams]);

  return null;
}

/** Reports client-side route changes to GTM as `page_view` events. */
export function GtmRouteTracker() {
  return (
    <Suspense fallback={null}>
      <RouteTracker />
    </Suspense>
  );
}
