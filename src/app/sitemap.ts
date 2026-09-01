import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { SITE_URL, CONTENT_REVIEWED, absoluteUrl } from "@/lib/site";

/**
 * The sitemap, derived from the same data the pages render from, so a new case
 * study or service is listed the moment it exists rather than whenever someone
 * remembers to edit an XML file.
 *
 * `lastModified` is the declared content-review date rather than build time:
 * stamping every URL with "now" on every deploy trains crawlers to ignore the
 * field, since nothing on the page actually changed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const reviewed = new Date(CONTENT_REVIEWED);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/work"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.7 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const caseStudyRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/work/${project.slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...caseStudyRoutes].map((entry) => ({
    ...entry,
    lastModified: reviewed,
  }));
}
