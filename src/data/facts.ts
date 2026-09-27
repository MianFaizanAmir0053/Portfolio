/**
 * What the first-load intro shows while the page gets ready (see `Intro`).
 *
 * Small, true surprises from the history of the web, programming and AI — the
 * craft this site is about — rather than a summary of the site itself, which
 * the page says better a second later. Short on purpose: each is on screen for
 * `FACT_MS`, and a fast load lifts the intro after the first, so every one has
 * to land in a couple of seconds' reading.
 *
 * `accent` is the phrase the fact turns on, set in the accent face; it must
 * appear in `text` exactly once. `source` is where and when, shown beneath.
 * Checked against the record — keep any new one to the same standard: a fact
 * that is merely folklore undoes the point of showing it.
 */
export type Fact = { text: string; accent: string; source: string };

export const FACTS: Fact[] = [
  { text: "The internet’s first message was “LO”. Then it crashed.", accent: "“LO”", source: "ARPANET, 1969" },
  { text: "JavaScript was written in ten days.", accent: "ten days", source: "Netscape, 1995" },
  { text: "The first computer bug was a real moth.", accent: "a real moth", source: "Harvard Mark II, 1947" },
  { text: "Apollo 11 flew to the Moon on 4KB of RAM.", accent: "4KB of RAM", source: "NASA, 1969" },
  { text: "Python is named after Monty Python, not the snake.", accent: "Monty Python", source: "Guido van Rossum, 1991" },
  { text: "The first website ever made is still online.", accent: "still online", source: "info.cern.ch, 1991" },
  { text: "Git was tracking its own source code within four days.", accent: "within four days", source: "Linus Torvalds, 2005" },
  { text: "The first computer mouse was made of wood.", accent: "made of wood", source: "Douglas Engelbart, 1964" },
  { text: "The first program was written for a machine never built.", accent: "a machine never built", source: "Ada Lovelace, 1843" },
  { text: "The first text message said “Merry Christmas”.", accent: "“Merry Christmas”", source: "Vodafone, 1992" },
  { text: "“Artificial intelligence” was coined for a summer workshop.", accent: "a summer workshop", source: "Dartmouth, 1955" },
  { text: "The “T” in ChatGPT comes from a 2017 Google paper.", accent: "a 2017 Google paper", source: "“Attention Is All You Need”" },
  { text: "“Computer” was a job title long before it was a machine.", accent: "a job title", source: "First recorded, 1613" },
  { text: "The first YouTube video was 19 seconds long, shot at a zoo.", accent: "19 seconds", source: "“Me at the zoo”, 2005" },
  { text: "The first iPhone had no App Store.", accent: "no App Store", source: "Apple, 2007" },
  { text: "The first .com ever registered was symbolics.com.", accent: "symbolics.com", source: "March 15, 1985" },
];
