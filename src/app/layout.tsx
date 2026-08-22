import type { Metadata } from "next";
import {
  Bebas_Neue,
  Barlow,
  Barlow_Condensed,
  Instrument_Serif,
  Geist_Mono,
} from "next/font/google";
import { LoadCurtain, RouteCurtain } from "@/components/site/Curtains";
import { ScrollProgress } from "@/components/site/primitives";
import { ScrollFxRoot } from "@/components/site/scroll-fx";
import { DockNav } from "@/components/site/DockNav";
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
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["400", "600"],
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

const TITLE = "Faizan Amir — Senior Software Engineer, Full-Stack & AI";
const DESCRIPTION =
  "Senior software engineer with 4 years shipping React, Next.js, Python and Node.js systems — RAG architectures, agentic AI and LLM integrations used by hundreds of people.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "Faizan Amir" }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${barlow.variable} ${barlowCondensed.variable} ${instrumentSerif.variable} ${geistMono.variable}`}
    >
      <body>
        {/* Inside <body>, not between <html> and <body>: a bare <script> there
            is invalid nesting, and the hydration mismatch it caused made React
            discard the server HTML and rebuild the tree — which orphaned every
            ScrollTrigger pin on the page. `beforeInteractive` still hoists this
            into <head>, so load order is unchanged. */}
        <GoogleTagManager />
        <GoogleTagManagerNoScript />
        <GoogleAnalytics />
        <GtmRouteTracker />
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
