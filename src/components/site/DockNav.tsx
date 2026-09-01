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

/*
 * The site's real pages. The dock's eight items are all anchors on the index,
 * and below `sm` the utility bar hides its own nav for want of room — so
 * without these the only way to /work, /services and /about on a phone is the
 * footer. Mobile sheet only; the desktop bar already shows them.
 */
const routes = [
  { title: "Work", href: "/work" },
  { title: "Services", href: "/services" },
  { title: "About", href: "/about" },
];

/** Below this the dock stays hidden — the hero should be uncluttered. */
const REVEAL_AFTER = 80;

export function DockNav() {
  const pathname = usePathname();
  const [section, setSection] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  /*
   * Revealed once the reader is past the hero, and it stays. It used to require
   * a *downward* scroll, which meant the one gesture that means "I want to go
   * somewhere" — scrolling back up — was the gesture that hid the navigation.
   * It also made the `inert` below dishonest: at rest the dock's links were
   * outside the tab order entirely, so a keyboard visitor could only reach them
   * mid-scroll. Position alone decides now.
   */
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setVisible(window.scrollY > REVEAL_AFTER);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
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

    /*
     * Batched to one measurement per frame. `compute` reads a bounding rect per
     * section, and a scroll event can fire more than once a frame — so at worst
     * it was flushing layout seven times, in the middle of the frames where
     * GSAP is writing pin transforms and the card stack is writing scale.
     */
    let frame = requestAnimationFrame(compute);
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        compute();
      });
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  const activeHref = pathname.startsWith("/work/")
    ? "/#work"
    : pathname === "/"
      ? section
        ? `/#${section}`
        : "/"
      : // On a real page, that page is what is current — so the route chips in
        // the mobile sheet can mark themselves.
        pathname;

  return (
    // `inert` while concealed so hidden links are not keyboard-reachable.
    <nav aria-label="Primary" inert={!visible}>
      <FloatingDock
        items={links}
        routes={routes}
        activeHref={activeHref}
        visible={visible}
        desktopClassName="fixed right-5 top-1/2 z-60 -translate-y-1/2"
        mobileClassName="fixed bottom-6 right-5 z-60"
      />
    </nav>
  );
}
