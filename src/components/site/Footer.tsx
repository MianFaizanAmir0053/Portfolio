import Link from "next/link";
import { Marquee } from "./primitives";

export function Footer() {
  return (
    <>
      <Marquee text="FAIZAN AMIR + " speed={34} className="rule-t rule-b" />
      <footer className="on-ink bg-ink text-paper">
        <div className="wrap grid gap-10 py-16 md:grid-cols-4">
          <address className="not-italic">
            <p className="label mb-3">[CONTACT]</p>
            <p className="text-sm leading-6">
              Faizan Amir
              <br />
              Senior Software Engineer
              <br />
              Lahore, Pakistan
            </p>
            <a
              href="mailto:faizanamir0053@gmail.com"
              className="mt-3 inline-block text-sm text-link hover:underline"
            >
              faizanamir0053@gmail.com
            </a>
            <br />
            <a href="tel:+923030649009" className="text-sm text-link hover:underline">
              0303 0649009
            </a>
          </address>

          <nav aria-label="Sitemap">
            <p className="label mb-3">[SITEMAP]</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-link">
                  * Index
                </Link>
              </li>
              <li>
                <Link href="/#work" className="hover:text-link">
                  * Featured work
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="hover:text-link">
                  * Experience
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-link">
                  * Contact
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Connect">
            <p className="label mb-3">[CONNECT]</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-link">
                  * GitHub
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-link">
                  * LinkedIn
                </a>
              </li>
              <li>
                <a href="https://wa.me/923030649009" target="_blank" rel="noreferrer" className="hover:text-link">
                  * WhatsApp
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Resources">
            <p className="label mb-3">[RESOURCES]</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/resume.pdf" className="hover:text-link">
                  * Resume (PDF)
                </a>
              </li>
              <li>
                <a href="https://carder.app" target="_blank" rel="noreferrer" className="hover:text-link">
                  * carder.app
                </a>
              </li>
              <li>
                <a
                  href="https://golegal.wanile.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-link"
                >
                  * golegal.wanile.dev
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center justify-between border-t border-paper/45 px-5 py-3">
          <span className="label">©26 ALL RIGHTS RESERVED</span>
          <span className="label">[END]</span>
        </div>

        <div className="overflow-hidden">
          <p className="display -mx-[6vw] whitespace-nowrap text-center text-[24vw] leading-[0.8]">
            FAIZAN AMIR
          </p>
        </div>
      </footer>
    </>
  );
}
