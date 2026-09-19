/**
 * Animated scroll indicator chevron with bounce animation.
 * Used at the bottom of the hero section.
 */
export function ScrollIndicator() {
  return (
    <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2">
      <svg
        aria-hidden="true"
        className="size-5"
        fill="none"
        height="20"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="20"
      >
        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
      </svg>
      <span className="font-mono text-[10px] tracking-[0.15em] uppercase">
        Scroll
      </span>
    </div>
  );
}
