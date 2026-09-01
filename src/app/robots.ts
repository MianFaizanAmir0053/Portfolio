import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt, generated so the sitemap URL can never drift from `SITE_URL`.
 *
 * The AI crawlers are named explicitly rather than left to the wildcard. The
 * point of this site is to be found by people hiring an engineer, and a growing
 * share of that search happens inside ChatGPT, Claude, Perplexity and AI
 * Overviews — a bot that cannot read the site cannot cite it. CCBot is the one
 * exception: it feeds bulk training corpora rather than a search surface that
 * links back, so it gets nothing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API routes have nothing to index and the error/loading shells are
        // Next internals, not pages.
        disallow: ["/api/"],
      },
      {
        // Search-and-cite AI crawlers: explicitly welcome.
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "PerplexityBot",
          "Perplexity-User",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "anthropic-ai",
          "Google-Extended",
          "Bingbot",
          "Applebot",
          "Applebot-Extended",
          "meta-externalagent",
          "Amazonbot",
          "DuckAssistBot",
          "cohere-ai",
        ],
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // Bulk training-corpus scraper with no citation surface.
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
