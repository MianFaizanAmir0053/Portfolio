"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Briefcase, FileText } from "lucide-react";
import { FloatingDock, type DockItem } from "@/components/ui/floating-dock";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

const iconClass = "h-full w-full";

/** Section numerals, drawn in the display face to match the site's [01] labels. */
const num = (n: string) => <span className="display leading-none">{n}</span>;

/*
 * Order and numbers mirror the index page's own section labels exactly:
 * [01] hero · [02] about · [03] stack · [04] experience · [05] reach ·
 * [06] beyond code · [07] contact.
 * Featured work carries no number on the page, so it sits in the next group
 * with an icon rather than being given a number the page never uses.
 */
const links: DockItem[] = [
  { title: "Index", icon: num("01"), href: "/", group: "sections" },
  { title: "About", icon: num("02"), href: "/#about", group: "sections" },
  { title: "Stack", icon: num("03"), href: "/#skills", group: "sections" },
  { title: "Experience", icon: num("04"), href: "/#experience", group: "sections" },
  { title: "Reach", icon: num("05"), href: "/#reach", group: "sections" },
  { title: "Beyond Code", icon: num("06"), href: "/#beyond", group: "sections" },
  { title: "Contact", icon: num("07"), href: "/#contact", group: "sections" },
  { title: "Work", icon: <Briefcase className={iconClass} />, href: "/#work", group: "extra" },
  { title: "Resume", icon: <FileText className={iconClass} />, href: "/resume.pdf", group: "extra" },
  { title: "GitHub", icon: <GithubIcon className={iconClass} />, href: "https://github.com", group: "social" },
  { title: "LinkedIn", icon: <LinkedinIcon className={iconClass} />, href: "https://linkedin.com", group: "social" },
];

/** Index sections the dock can highlight, in document order. */
const SECTION_IDS = ["about", "skills", "experience", "reach", "work", "beyond", "contact"];

/** Below this the dock stays hidden — the hero should be uncluttered. */
const REVEAL_AFTER = 80;
/** Ignore sub-pixel scroll jitter. */
const DELTA = 6;

export function DockNav() {
  const pathname = usePathname();
  const [section, setSection] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  // Reveal on scroll down, conceal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - last;
      if (Math.abs(dy) < DELTA) return;
      last = y;
      setVisible(y > REVEAL_AFTER && dy > 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Section highlighting only means anything on the index page.
    if (pathname !== "/") {
      const reset = requestAnimationFrame(() => setSection(null));
      return () => cancelAnimationFrame(reset);
    }

    // Whichever section straddles the viewport midline is the active one.
    const compute = () => {
      const mid = window.innerHeight / 2;
      let found: string | null = null;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          found = id;
          break;
        }
      }
      setSection((prev) => (prev === found ? prev : found));
    };

    const raf = requestAnimationFrame(compute);
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [pathname]);

  const activeHref = pathname.startsWith("/work/")
    ? "/#work"
    : pathname === "/"
      ? section
        ? `/#${section}`
        : "/"
      : null;

  return (
    // `inert` while concealed so hidden links are not keyboard-reachable.
    <nav aria-label="Primary" inert={!visible}>
      <FloatingDock
        items={links}
        activeHref={activeHref}
        visible={visible}
        desktopClassName="fixed bottom-6 left-1/2 z-60 -translate-x-1/2"
        mobileClassName="fixed bottom-6 right-5 z-60"
      />
    </nav>
  );
}
