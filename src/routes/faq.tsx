import Magnifier from "@gravity-ui/icons/Magnifier";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { getAllFaqs } from "@/lib/db/functions";

export const Route = createFileRoute("/faq")({
  loader: async () => {
    const { faqs } = await getAllFaqs();
    return { faqs };
  },
  component: FaqPage,
});

/**
 * True subsequence fuzzy match — characters must appear in order but not
 * contiguously.  Trailing whitespace in the query is ignored.
 */
function fuzzyMatch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return true;
  let qi = 0;
  for (let ti = 0; ti < lowerText.length && qi < lowerQuery.length; ti++) {
    if (lowerText[ti] === lowerQuery[qi]) qi++;
  }
  return qi === lowerQuery.length;
}

function FaqPage() {
  const { faqs: allFaqs } = Route.useLoaderData();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return allFaqs;
    return allFaqs.filter(
      (faq) => fuzzyMatch(faq.question, query) || fuzzyMatch(faq.answer, query),
    );
  }, [allFaqs, query]);

  return (
    <main className="border-border border-t">
      <div className="container-editorial py-16 md:py-24">
        <header className="mb-12 flex max-w-3xl flex-col gap-4 md:mb-16">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            FAQ
          </p>
          <h1 className="display">Frequently asked questions</h1>
          <p className="lead max-w-2xl">
            Answers to what people usually want to know about VOMLabs.
          </p>
        </header>
        <div className="relative mb-10 max-w-md">
          <Magnifier className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            aria-label="Search questions"
            className="border-border bg-background placeholder:text-muted-foreground focus:border-foreground h-10 w-full border pr-3 pl-8 text-sm outline-none"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
            type="text"
            value={query}
          />
        </div>
        <div className="divide-border border-border flex w-full flex-col divide-y border-y">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground py-8 text-sm">
              No results found for &quot;{query}&quot;
            </p>
          ) : (
            filtered.map((faq) => (
              <div
                className="grid gap-2 py-6 md:grid-cols-[1fr_2fr] md:gap-10 md:py-8"
                key={faq.id}
              >
                <h2 className="text-foreground text-sm font-medium tracking-[-0.01em] md:text-base">
                  {faq.question}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
