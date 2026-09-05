"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Briefcase } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FloatingDock, type DockItem } from "@/components/ui/floating-dock";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

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

    /*
     * One trigger per section, and no measuring during the scroll at all.
     *
     * This used to read a bounding rect for every section on every scroll
     * frame — seven forced layout flushes, in the same frames GSAP is writing
     * pin transforms, for the whole length of the page. ScrollTrigger already
     * measures each section once per refresh and just compares the cached
     * numbers as you scroll, so the same "which section straddles the middle"
     * question is answered for free. `onToggle` fires only at a boundary.
     *
     * The stack keeps the answer stable when two triggers overlap: the newest
     * active section wins, and leaving one falls back to whichever is still
     * active underneath rather than blanking the marker.
     */
    const active: string[] = [];
    const triggers = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          const at = active.indexOf(id);
          if (self.isActive) {
            if (at === -1) active.push(id);
          } else if (at !== -1) {
            active.splice(at, 1);
          }
          const next = active.length ? active[active.length - 1] : null;
          setSection((prev) => (prev === next ? prev : next));
        },
      });
    });

    return () => {
      for (const t of triggers) t?.kill();
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
