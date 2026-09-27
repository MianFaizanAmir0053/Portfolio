"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { GA_ID } from "@/lib/analytics";
import { whenReady } from "@/lib/ready";

/**
 * True once the page is ready (see `whenReady`), so the tag is not even added
 * until then. `lazyOnload` alone waits for the load event, and on a quick
 * connection with a slow processor the load event lands before the page has
 * finished booting — the tag then ran its script in the middle of it.
 */
function usePageReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => whenReady(() => setReady(true)), []);
  return ready;
}

/**
 * The GA4 Google tag (gtag.js) — the site's only analytics. Page views of
 * client-side navigations come from GA4's enhanced measurement, which follows
 * browser-history changes, so nothing here reports routes by hand.
 *
 * There was a Google Tag Manager container alongside it. It never held a tag,
 * a trigger or a rule, so it measured nothing, and it cost every visit a
 * ~100KB download (325KB of script to parse and run) and a noscript iframe.
 */
export function GoogleAnalytics() {
  const ready = usePageReady();
  if (!GA_ID || !ready) return null;

  return (
    <>
      {/*
       * `lazyOnload`: fetched once the page's own resources are in and the
       * browser is idle. `afterInteractive` started the download during
       * hydration, where on a slow connection it competed with the page's own
       * chunks and images for the same bandwidth. Measurement is not worth
       * that, and hits made before the tag arrives are queued, not lost.
       */}
      <Script
        id="ga-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
