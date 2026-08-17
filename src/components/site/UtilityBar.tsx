import Link from "next/link";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { Tag } from "./primitives";

export function UtilityBar() {
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-[2px] rule-b">
      <div className="wrap flex h-11 items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-hidden">
          <a
            href="mailto:faizanamir0053@gmail.com"
            className="label hidden text-ink hover:text-cobalt sm:inline"
          >
            faizanamir0053@gmail.com
          </a>
          <Tag className="whitespace-nowrap text-cobalt">[STATUS: OPEN TO WORK]</Tag>
        </div>

        <Link
          href="/"
          className="display absolute left-1/2 hidden sm:block -translate-x-1/2 text-sm tracking-normal"
        >
          FA
        </Link>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="text-ink hover:text-cobalt"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
            className="text-ink hover:text-cobalt"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
          <Link href="/#contact" className="label whitespace-nowrap text-cobalt hover:underline">
            Let&apos;s connect
          </Link>
        </div>
      </div>
    </header>
  );
}
