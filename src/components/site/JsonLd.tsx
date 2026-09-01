/**
 * Renders a JSON-LD graph into the document.
 *
 * A plain <script> in a server component, deliberately — not next/script and
 * not a client effect. Structured data injected after hydration is invisible to
 * every crawler that does not run JavaScript, which includes most of the AI
 * answer engines this site wants to be cited by.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from this repo's own typed data, never user input.
      // `<` is escaped so a stray character in copy cannot close the tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
