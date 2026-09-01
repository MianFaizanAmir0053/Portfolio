import type { MetadataRoute } from "next";
import { PERSON, SITE_NAME } from "@/lib/site";

/**
 * Web app manifest. Not a ranking signal, but it is what supplies the install
 * name, the theme colour a browser paints its chrome with, and the icon set
 * mobile Chrome uses — all of which are part of how the site presents itself
 * once someone has found it.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: PERSON.name,
    description:
      "Portfolio and case studies of Faizan Amir, a senior software engineer working in React, Next.js, Node.js, Python and applied AI.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#060607",
    theme_color: "#060607",
    lang: "en",
    categories: ["portfolio", "technology", "business"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
