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
import { DockNav } from "@/components/site/DockNav";
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
        <ScrollProgress />
        <LoadCurtain />
        <RouteCurtain />
        {children}
        <DockNav />
      </body>
    </html>
  );
}
