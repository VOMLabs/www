"use client";

import { useEffect, useState } from "react";

import { Link } from "@/components/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { createLogger } from "@/lib/logger";
import { cn } from "@/lib/utils";

import { NavActions } from "./NavActions";
import { NavDesktop } from "./NavDesktop";
import { NavMobileDrawer } from "./NavMobileDrawer";

const logger = createLogger("Navbar");

/**
 * Fixed glassmorphism navbar. SSR-safe: the scroll listener is registered in
 * an effect only, so the server render never touches `window`.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    logger.debug("Navbar mounted", { hasSession: !!session });
  }, [session]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none",
          scrolled
            ? "border-border/80 bg-background/80 shadow-sm"
            : "border-transparent bg-background/60",
        )}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-18 w-full max-w-(--breakpoint-2xl) items-center justify-between px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]"
        >
          <Link className="flex items-center gap-3" to="/">
            <Logo className="size-7" />
            <span className="text-base font-bold tracking-[-0.01em]">
              VOMLabs
            </span>
          </Link>

          <NavDesktop />

          <div className="hidden items-center justify-end gap-3 lg:flex">
            <NavActions session={session} />
            {!session && (
              <Button size="sm" variant="hero">
                <Link to="/signup">Get Started</Link>
              </Button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile bottom tab bar — always visible on mobile */}
      <NavMobileDrawer onOpenChange={() => {}} open={false} session={session} />
    </>
  );
}
