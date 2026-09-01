"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PERSON } from "@/lib/site";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

/** Loads Cloudflare's widget script once, however many forms mount it. */
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        // Let a later mount try again rather than caching the rejection
        // forever — a blocked request now may succeed after a reconnect.
        scriptPromise = null;
        reject(new Error("Failed to load Turnstile"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

type WidgetStatus = "idle" | "pending" | "ready" | "failed";

/**
 * Cloudflare Turnstile, rendered into a div the library owns directly —
 * React never touches its children, so this only ever mounts and unmounts.
 *
 * Silently renders nothing without a site key, so a missing env var fails
 * open in development rather than blocking every contact form submission.
 *
 * The widget states are visible rather than implied. A tracker blocker or a
 * corporate proxy can stop Cloudflare's script from ever arriving, and the
 * previous version handled that by leaving an empty box on screen: no widget,
 * no token, no explanation. Now the load is caught, the failure is stated, and
 * the message carries a way to make contact without the form.
 */
export function Turnstile({
  onVerify,
  onExpire,
  className,
}: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  className?: string;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerId = useId();
  const widgetId = useRef<string | null>(null);
  const [status, setStatus] = useState<WidgetStatus>("idle");

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    let io: IntersectionObserver | null = null;

    const render = () => {
      setStatus("pending");
      loadTurnstile()
        .then(() => {
          if (cancelled) return;
          const target = document.getElementById(containerId);
          if (!target || !window.turnstile) {
            setStatus("failed");
            return;
          }
          widgetId.current = window.turnstile.render(target, {
            sitekey: siteKey,
            theme: "dark",
            callback: (token) => {
              setStatus("ready");
              onVerify(token);
            },
            "expired-callback": () => onExpire?.(),
            // A challenge that errors is not a challenge that will pass on its
            // own. Say so, instead of silently re-disabling the form.
            "error-callback": () => {
              setStatus("failed");
              onExpire?.();
            },
          });
        })
        .catch(() => {
          if (cancelled) return;
          setStatus("failed");
        });
    };

    /*
     * Deferred until the widget is close to the viewport. The contact form sits
     * at the bottom of a long page, so fetching Cloudflare's script at
     * hydration put a third-party request on the critical path of a page most
     * visitors never scroll to the end of. The 600px margin means the widget is
     * still ready by the time anyone reaches the form.
     */
    const el = document.getElementById(containerId);
    if (el && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting) return;
          io?.disconnect();
          render();
        },
        { rootMargin: "600px 0px" },
      );
      io.observe(el);
    } else {
      render();
    }

    return () => {
      cancelled = true;
      io?.disconnect();
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, containerId]);

  if (!siteKey) return null;

  return (
    <div className={className}>
      <div id={containerId} />
      {status === "pending" && (
        <p className="label mt-2" aria-live="polite">
          [VERIFYING…]
        </p>
      )}
      {status === "failed" && (
        <p className="label mt-2 text-cobalt" aria-live="polite">
          [CAPTCHA UNAVAILABLE] Send the message to{" "}
          <a href={`mailto:${PERSON.email}`} className="underline">
            {PERSON.email}
          </a>{" "}
          instead.
        </p>
      )}
    </div>
  );
}
