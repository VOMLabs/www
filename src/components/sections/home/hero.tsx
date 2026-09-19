"use client";

import { toast } from "sonner";

import { DiscordIcon } from "@/components/icons/discord";
import { Button } from "@/components/ui/button";
import { createLogger } from "@/lib/logger";

import { GitHubOrgDialog } from "./github-org-dialog";
import { ScrollIndicator } from "./scroll-indicator";

const logger = createLogger("Hero");

export function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6">
      {/* Ambient gradient orb */}
      <div
        aria-hidden="true"
        className="hero-orb top-1/4 -right-32 h-[500px] w-[500px] sm:h-[600px] sm:w-[600px]"
      />
      <div
        aria-hidden="true"
        className="hero-orb top-[60%] -left-48 h-[400px] w-[400px] opacity-[0.06] sm:h-[500px] sm:w-[500px]"
      />

      <div className="container-editorial py-20 md:py-0">
        <div className="flex max-w-3xl flex-col items-start gap-10">
          <p className="eyebrow animate-fade-up motion-reduce:animate-none">
            <span className="eyebrow-dot" />
            Building the future of developer tools
          </p>
          <div
            className="animate-fade-up flex flex-col gap-6 motion-reduce:animate-none"
            style={{ animationDelay: "100ms" }}
          >
            <h1 className="display">VOMLabs</h1>
            <h2 className="text-foreground max-w-xl text-xl font-normal tracking-[-0.01em] sm:text-2xl lg:text-3xl">
              Modern software, built by developers, for developers.
            </h2>
            <p className="lead max-w-lg">
              We create high-performance tools, premium libraries, and
              developer-focused solutions — crafted with care and built to last.
            </p>
          </div>
          <div
            className="animate-fade-up flex flex-col gap-3 motion-reduce:animate-none sm:flex-row sm:gap-4"
            style={{ animationDelay: "200ms" }}
          >
            <GitHubOrgDialog />
            <Button
              size="hero"
              variant="outline"
              onClick={() => {
                try {
                  logger.info("Discord button clicked", {
                    url: "https://discord.vomlabs.com",
                  });
                  toast.info("Opening Discord...", { duration: 2000 });
                  window.open(
                    "https://discord.vomlabs.com",
                    "_blank",
                    "noopener,noreferrer",
                  );
                } catch (error) {
                  logger.error("Failed to open Discord", {
                    error:
                      error instanceof Error ? error.message : String(error),
                  });
                  toast.error("Failed to open Discord. Please try again.");
                }
              }}
            >
              <DiscordIcon className="size-4" />
              Join the Discord
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
