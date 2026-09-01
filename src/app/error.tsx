"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5">
      {/* A landmark, so this route is not the one page on the site with no
          document structure at all. */}
      <main id="main" className="w-full max-w-md">
        <p className="label mb-6 block text-cobalt">[ERROR]</p>
        <h1 className="display text-3xl md:text-4xl">This page didn&apos;t load</h1>
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Something went wrong on our end. You can try again or head back to the index.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={reset}
            className="bg-cobalt px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-cobalt-deep"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Go home
          </Link>
        </div>
      </main>
    </div>
  );
}
