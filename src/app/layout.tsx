import type { Metadata, Viewport } from "next";
import {
  Bebas_Neue,
  Barlow,
  Instrument_Serif,
  Geist_Mono,
} from "next/font/google";
import { LoadCurtain, RouteCurtain } from "@/components/site/Curtains";
import { ScrollProgress } from "@/components/site/primitives";
import { ScrollFxRoot } from "@/components/site/scroll-fx";
import { DockNav } from "@/components/site/DockNav";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { JsonLd } from "@/components/site/JsonLd";
import { SITE_URL, SITE_NAME, PERSON } from "@/lib/site";
import { graph, personSchema, websiteSchema } from "@/lib/schema";
import {
  GoogleAnalytics,
  GoogleTagManager,
  GoogleTagManagerNoScript,
  GtmRouteTracker,
} from "@/components/site/Analytics";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  /* 400 and 500 only: nothing on the site sets any other weight, and each
     one is a separate font file on the critical path. */
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* 60 characters: the name people search for, plus the two frameworks and the
   specialisation they search for when they do not have a name yet. */
const TITLE = "Faizan Amir — Senior Software Engineer | React, Next.js & AI";
/* 154 characters — inside the ~160 Google renders before truncating. */
const DESCRIPTION =
  "Faizan Amir is a senior software engineer building full-stack and AI products in React, Next.js, Node.js and Python. Case studies, stack and contact.";

export const metadata: Metadata = {
  /*
   * Every relative URL below — canonicals, OG images, the manifest — resolves
   * against this. Without it Next cannot build absolute social URLs at all,
   * and a canonical tag that is not absolute is a canonical tag crawlers
   * quietly disagree about.
   */
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    /* Child routes supply their own subject; the name is appended once, here. */
    template: "%s · Faizan Amir",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  publisher: PERSON.name,
  category: "technology",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      /* Let Google use the full snippet, image and video preview it wants. */
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "profile",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    firstName: "Faizan",
    lastName: "Amir",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: PERSON.name,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: PERSON.name, statusBarStyle: "black-translucent" },
  /* Phone numbers are linked deliberately in the contact block; Safari should
     not go looking for more and rewrite copy into tel: links. */
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060607",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${barlow.variable} ${instrumentSerif.variable} ${geistMono.variable}`}
    >
      <body>
        {/* First focusable thing in the document. Every page here opens with a
            sticky bar and a breadcrumb, so a keyboard or screen-reader visitor
            was tabbing through the same chrome on every navigation before
            reaching anything they came for. */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* The site's identity graph — Person and WebSite — server-rendered on
            every route so the pages consolidate into one entity rather than
            reading as unrelated documents. Page-level nodes are emitted by the
            pages themselves. */}
        <JsonLd data={graph(personSchema(), websiteSchema())} />
        {/* Inside <body>, not between <html> and <body>: a bare <script> there
            is invalid nesting, and the hydration mismatch it caused made React
            discard the server HTML and rebuild the tree — which orphaned every
            ScrollTrigger pin on the page. */}
        <GoogleTagManager />
        <GoogleTagManagerNoScript />
        <GoogleAnalytics />
        <GtmRouteTracker />
        <SmoothScroll />
        <ScrollProgress />
        <ScrollFxRoot />
        <LoadCurtain />
        <RouteCurtain />
        {children}
        <DockNav />
      </body>
    </html>
  );
}
