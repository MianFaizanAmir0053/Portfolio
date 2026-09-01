"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { Tag } from "./primitives";
import { SOCIAL } from "@/data/social";
import { cn } from "@/lib/utils";

/**
 * The site's page-level navigation, in the order the site argues itself.
 *
 * "Case studies" rather than "Work": the dock carries a Work item that scrolls
 * to the homepage's four featured projects, while this one opens the index of
 * all six. Two visible controls reading "Work" and going to two different
 * places is the ambiguity; the footer sitemap already names this route
 * "Case studies", so this matches it rather than inventing a third name.
 */
const NAV = [
  { href: "/work", label: "Case studies" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

/**
 * A client component only so it can read `usePathname` and mark the page you
 * are on — a server component has no access to the pathname, and splitting the
 * three links into their own client file would leave the header in two places.
 * The bar holds no other state, so all of it still ships in the server HTML.
 */
export function UtilityBar() {
  const pathname = usePathname();

  return (
    <header data-utility-bar className="sticky top-0 z-50 bg-paper/95 backdrop-blur-[2px] rule-b">
      <div className="wrap flex h-[var(--bar-h)] items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-hidden">
          <Link href="/" className="display text-sm tracking-normal" aria-label="Faizan Amir, home">
            FA
          </Link>
          <a
            href="mailto:faizanamir0053@gmail.com"
            className="label hidden text-ink hover:text-cobalt lg:inline"
          >
            faizanamir0053@gmail.com
          </a>
          {/*
           * This group is the one with `overflow-hidden`, so it is the one that
           * clips when the bar runs out of room — and the status pill is its
           * only variable-width child, so a full-width pill loses its closing
           * bracket on a narrow phone.
           *
           * The short form holds all the way to `lg`, not `md`. The nav appears
           * at `sm`, and "Case studies" is three times the width of the "Work"
           * it replaced, so the row is at capacity from 640px up; the long pill
           * only fits once the email address has its own room at `lg`.
           */}
          <Tag className="whitespace-nowrap text-cobalt">
            <span className="lg:hidden">[OPEN TO WORK]</span>
            <span className="hidden lg:inline">[STATUS: OPEN TO WORK]</span>
          </Tag>
        </div>

        {/*
         * Real links to real pages, on every page of the site. The dock below
         * is homepage wayfinding; this is the navigation a crawler follows and
         * the one that works from a case study. Labelled "Site" rather than
         * "Primary" because the dock's landmark is already called that, and two
         * identically named landmarks are a guess in the landmark list.
         */}
        <nav aria-label="Site" className="hidden sm:block">
          <ul className="flex items-center gap-5">
            {NAV.map((item) => {
              // Prefix match, not equality: a case study is where most search
              // traffic lands, so /work/muterpe has to light "Case studies" too.
              const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "label whitespace-nowrap hover:text-cobalt",
                      current ? "text-cobalt" : "text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* `shrink-0` so the clipping stays on the status pill, which has a short form. */}
        <div className="flex shrink-0 items-center gap-4">
          <a
            href={SOCIAL.github}
            target="_blank"
            rel="me noopener"
            aria-label="GitHub profile"
            className="hidden text-ink hover:text-cobalt sm:inline"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href={SOCIAL.linkedin}
            target="_blank"
            rel="me noopener"
            aria-label="LinkedIn profile"
            className="hidden text-ink hover:text-cobalt sm:inline"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
          <Link href="/contact" className="label whitespace-nowrap text-cobalt hover:underline">
            Let&apos;s connect
          </Link>
        </div>
      </div>
    </header>
  );
}
