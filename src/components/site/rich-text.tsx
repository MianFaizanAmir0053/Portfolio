import { Fragment } from "react";
import { runs } from "@/lib/emphasis";

/**
 * Authored copy with its emphasis rendered (see `@/lib/emphasis`): `**phrase**`
 * in full white, `==figure==` in lime. The parent sets the running text's own
 * size and colour; this only lifts the marked words out of it.
 */
export function Rich({ text }: { text: string }) {
  return runs(text).map((run, i) =>
    run.mark === "strong" ? (
      <strong key={i} className="font-medium text-ink">
        {run.text}
      </strong>
    ) : run.mark === "figure" ? (
      <mark key={i} className="bg-transparent font-medium text-cobalt">
        {run.text}
      </mark>
    ) : (
      <Fragment key={i}>{run.text}</Fragment>
    ),
  );
}
