"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { productCategories } from "./nav-config";

export function NavMegaMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      <button
        aria-expanded={open}
        aria-haspopup="true"
        className="text-muted-foreground hover:text-foreground flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors duration-200"
        onClick={() => setOpen(!open)}
        type="button"
      >
        Products
        <svg
          className={cn(
            "size-3 transition-transform duration-200",
            open && "rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        className={cn(
          "absolute left-0 top-full z-50 mt-1 w-[280px] rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur-md transition-[opacity,transform] duration-200 motion-reduce:transition-none",
          open
            ? "translate-y-0 opacity-100"
            : "translate-y-1 pointer-events-none opacity-0",
        )}
        role="menu"
      >
        <ul className="space-y-0.5">
          {productCategories.map((cat) => (
            <li key={cat.label}>
              <a
                className="hover:bg-muted block rounded-lg px-3 py-2 transition-colors"
                href={cat.href}
                onClick={() => setOpen(false)}
              >
                <span className="text-sm font-medium">{cat.label}</span>
                <span className="text-muted-foreground block text-xs">
                  {cat.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
