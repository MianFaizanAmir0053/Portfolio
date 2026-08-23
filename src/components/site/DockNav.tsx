"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Briefcase } from "lucide-react";
import { FloatingDock, type DockItem } from "@/components/ui/floating-dock";

const iconClass = "h-full w-full";

/** Section numerals, drawn in the display face to match the site's [01] labels. */
const num = (n: string) => <span className="display leading-none">{n}</span>;

/** Section anchors the dock can highlight, in document order. */
const SECTION_IDS = ["about", "skills", "experience", "reach", "work", "beyond", "contact"];

/*
 * Pure wayfinding now — Resume, GitHub, and LinkedIn dropped. All three are
 * already one click away (utility bar, hero, contact section), so carrying
 * them here too was the dock repeating links the page already offers, which
 * is most of why it read as heavy.
 *
 * Order matches the page's own reading order — [01] hero through [07]
 * contact, Work slotted in where it actually sits in the DOM (between Reach
 * and Beyond Code) rather than tacked on at the end. Featured work carries no
 * numeral on the page, so it gets the briefcase glyph instead of a number the
 * page never uses.
 */
const links: DockItem[] = [
  { title: "Index", icon: num("01") },
  { title: "About", icon: num("02") },
  { title: "Stack", icon: num("03") },
  { title: "Experience", icon: num("04") },
  { title: "Reach", icon: num("05") },
  { title: "Work", icon: <Briefcase className={iconClass} strokeWidth={1.75} /> },
  { title: "Beyond Code", icon: num("06") },
  { title: "Contact", icon: num("07") },
].map((item, i) => ({
  ...item,
  href: i === 0 ? "/" : `/#${SECTION_IDS[i - 1]}`,
}));

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
        desktopClassName="fixed right-5 top-1/2 z-60 -translate-y-1/2"
        mobileClassName="fixed bottom-6 right-5 z-60"
      />
    </nav>
  );
}
