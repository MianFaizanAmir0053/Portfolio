/**
 * Emphasis inside authored copy.
 *
 * Two marks, written inline in the data so the words and their weighting
 * are edited together:
 *
 *   **phrase**  the words that carry the sentence: set in full white against
 *               the soft running text.
 *   ==figure==  a number the reader should leave with: set in lime, the colour
 *               the site keeps for what is counted.
 *
 * One or two to a paragraph. Marked everywhere, a paragraph is as flat as
 * marked nowhere.
 */

export type Run = { text: string; mark?: "strong" | "figure" };

const MARK = /\*\*([^*]+)\*\*|==([^=]+)==/g;

/** The text as runs, each plain or marked, in order. */
export function runs(text: string): Run[] {
  const out: Run[] = [];
  let last = 0;
  for (const match of text.matchAll(MARK)) {
    const at = match.index ?? 0;
    if (at > last) out.push({ text: text.slice(last, at) });
    out.push(
      match[1] !== undefined
        ? { text: match[1], mark: "strong" }
        : { text: match[2], mark: "figure" },
    );
    last = at + match[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/** The text with its marks removed: for metadata, structured data and the plain-text corpus. */
export const plain = (text: string) => text.replace(MARK, (_, strong, figure) => strong ?? figure);
