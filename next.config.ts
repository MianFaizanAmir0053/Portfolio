import type { NextConfig } from "next";

/**
 * Long-lived caching for assets that are addressed by a stable path rather than
 * a content hash. `/_next/static/*` is already immutable by default; these are
 * the hand-placed files under `public/` that would otherwise be revalidated on
 * every visit.
 */
const IMMUTABLE = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  /* Canonical URLs have no trailing slash; the sitemap, the metadata and the
     internal links all agree on that, and this keeps the server from serving
     both forms. */
  trailingSlash: false,

  /* One less fingerprinting header on every response. */
  poweredByHeader: false,

  images: {
    /* AVIF first, WebP as the fallback — both are far smaller than the source
       PNG/JPG screenshots that will replace the placeholder SVGs. */
    formats: ["image/avif", "image/webp"],
    /* Screens this site is actually read on, rather than Next's default ladder
       which generates variants nobody requests. */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          /* Send the full URL to same-origin, origin only cross-origin: enough
             for referral analytics without leaking paths to third parties. */
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        /* The résumé is linked from the hero, the footer and the About page.
           It changes rarely and is worth caching hard. */
        source: "/resume.pdf",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }],
      },
      {
        source: "/:file(icon-192.png|icon-512.png|apple-icon.png|icon.svg|favicon.ico)",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
      {
        /*
         * The résumé and the generated dot map are assets, not pages. Left
         * alone, Google will happily index a 716KB SVG and a PDF as search
         * results that compete with the HTML pages describing the same thing.
         * `X-Robots-Tag` is the only way to say otherwise for a non-HTML file.
         */
        source: "/:file(resume.pdf|reach-map.svg)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
    ];
  },
};

export default nextConfig;
