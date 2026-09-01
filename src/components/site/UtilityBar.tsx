import Link from "next/link";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { Tag } from "./primitives";
import { SOCIAL } from "@/data/social";

/** The site's primary navigation, in the order the site argues itself. */
const NAV = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export function UtilityBar() {
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
          <Tag className="whitespace-nowrap text-cobalt">[STATUS: OPEN TO WORK]</Tag>
        </div>

        {/*
         * Real links to real pages, on every page of the site. The dock below
         * is homepage wayfinding; this is the navigation a crawler follows and
         * the one that works from a case study.
         */}
        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="label text-ink hover:text-cobalt">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
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
