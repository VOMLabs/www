"use client";

import CodeFork from "@gravity-ui/icons/CodeFork";
import HandOk from "@gravity-ui/icons/HandOk";
import Persons from "@gravity-ui/icons/Persons";
import { useEffect, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { type IconComponent } from "@/components/icons";
import { DiscordIcon } from "@/components/icons/discord";
import { Button } from "@/components/ui/button";
import { createLogger } from "@/lib/logger";

const logger = createLogger("BecomeDev");

const items: {
  icon: IconComponent;
  title: string;
  description: string;
}[] = [
  {
    icon: Persons,
    title: "Join Our Community",
    description: "Connect with developers and contributors on Discord.",
  },
  {
    icon: CodeFork,
    title: "Quality Products",
    description:
      "Help us build high-quality, affordable tools that developers love.",
  },
  {
    icon: HandOk,
    title: "Build with Us",
    description:
      "Work on C++, Java, TypeScript, and Rust projects alongside experienced devs.",
  },
];

export function BecomeDev() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    logger.debug("BecomeDev section mounted");
  }, []);

  return (
    <section
      id="become-a-developer"
      className="border-border bg-muted/30 border-y"
    >
      <div className="container-editorial py-12 sm:py-16 md:py-24">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              Join the team
            </p>
            <h2 className="section-title mt-4">Become a Developer</h2>
            <p className="lead mt-4">
              Join our community and help build the future of developer tools.
            </p>
          </div>
          {mounted && (
            <div className="self-start lg:self-auto">
              <Button
                onClick={() => {
                  try {
                    logger.info("BecomeDev Discord button clicked", {
                      url: "https://discord.vomlabs.com",
                    });
                    toast.info("Opening Discord...", { duration: 2000 });
                    window.open(
                      "https://discord.vomlabs.com",
                      "_blank",
                      "noopener,noreferrer",
                    );
                  } catch (error) {
                    logger.error("Failed to open Discord from BecomeDev", {
                      error:
                        error instanceof Error ? error.message : String(error),
                    });
                    toast.error("Failed to open Discord. Please try again.");
                  }
                }}
              >
                <DiscordIcon className="size-4" />
                Join Discord to Apply
              </Button>
            </div>
          )}
        </div>
        <ul className="mt-10 grid gap-8 sm:mt-12 sm:grid-cols-3 sm:gap-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li
                className="border-border border-t pt-6 sm:pt-6"
                key={item.title}
              >
                <Icon className="text-lime-dim dark:text-lime size-5" />
                <h3 className="mt-3 text-sm font-medium tracking-[-0.01em] sm:text-base">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed sm:text-sm">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
