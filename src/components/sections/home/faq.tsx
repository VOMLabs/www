"use client";

import ArrowUpRight from "@gravity-ui/icons/ArrowUpRight";
import ChevronDown from "@gravity-ui/icons/ChevronDown";
import { useEffect, useState } from "react";

import { Link } from "@/components/link";
import { createLogger } from "@/lib/logger";

const logger = createLogger("Faq");

export function Faq({
  faqs,
}: {
  faqs: { id: string; question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    logger.debug("FAQ section mounted", { count: faqs.length });
  }, [faqs.length]);

  return (
    <section id="faq" className="border-border border-b">
      <div className="container-editorial py-16 md:py-24">
        <p className="eyebrow">
          <span className="eyebrow-dot" />
          FAQ
        </p>
        <h2 className="section-title mt-4">Frequently asked questions</h2>
        <div className="border-border divide-border mt-10 flex flex-col divide-y border-y">
          {faqs.map((faq) => {
            const isOpen = open === faq.id;
            const contentId = `faq-content-${faq.id}`;
            return (
              <div key={faq.id}>
                <button
                  aria-controls={contentId}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  onClick={() => {
                    try {
                      const next = isOpen ? null : faq.id;
                      logger.debug("FAQ item toggled", {
                        id: faq.id,
                        question: faq.question,
                        isOpen: !isOpen,
                      });
                      setOpen(next);
                    } catch (error) {
                      logger.error("Failed to toggle FAQ item", {
                        id: faq.id,
                        error:
                          error instanceof Error
                            ? error.message
                            : String(error),
                      });
                    }
                  }}
                  type="button"
                >
                  <span className="text-sm font-medium tracking-[-0.01em] md:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`text-muted-foreground size-4 shrink-0 transition-transform duration-150 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  id={contentId}
                >
                  <div className="overflow-hidden">
                    <div className="pb-6">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Link
          className="group text-muted-foreground hover:text-foreground mt-8 inline-flex items-center gap-1 text-sm underline-offset-4 transition-colors duration-200 hover:underline"
          to="/faq"
        >
          View all FAQ
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:-translate-y-0" />
        </Link>
      </div>
    </section>
  );
}
