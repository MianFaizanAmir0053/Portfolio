"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Tag } from "@/components/site/primitives";

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
    <div className="flex min-h-svh items-center justify-center bg-paper px-5 py-20">
      {/* A landmark, so this route is not the one page on the site with no
          document structure at all. */}
      <main id="main" className="w-full max-w-xl">
        {/*
         * The bracket label, not a hand-rolled <p>. [ERROR] belongs to the same
         * family as [404] and [SENT]; writing it as a one-off meant the one
         * page a visitor reaches when something breaks was also the one page
         * that did not look like the site.
         */}
        <Tag className="mb-6 block text-cobalt">[ERROR]</Tag>
        <h1 className="display text-3xl md:text-4xl">This page didn&rsquo;t load</h1>
        {/*
         * First person, like the rest of the site. "Our end" implied a company;
         * there is one person here and he owns the fault.
         */}
        <p className="mt-3 text-sm leading-7 text-ink-muted">
          Something broke on my side. Try again, or take one of the links below — the case studies
          and the contact details are still there.
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

        {/*
         * The same routes the 404 offers. A real fault is a worse place to
         * strand someone than a mistyped URL, and the links cost nothing.
         */}
        <nav aria-label="Site" className="mt-10 rule-t pt-6">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <li>
              <Link href="/work" className="text-cobalt hover:underline">
                Case studies
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-cobalt hover:underline">
                Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-cobalt hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-cobalt hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </main>
    </div>
  );
}
