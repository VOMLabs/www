"use client";

import ArrowRotateRight from "@gravity-ui/icons/ArrowRotateRight";
import BookOpen from "@gravity-ui/icons/BookOpen";
import Box from "@gravity-ui/icons/Box";
import Cpu from "@gravity-ui/icons/Cpu";
import Route from "@gravity-ui/icons/Route";
import Terminal from "@gravity-ui/icons/Terminal";
import Wrench from "@gravity-ui/icons/Wrench";
import { useEffect, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { type IconComponent } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { createLogger } from "@/lib/logger";

const logger = createLogger("Engineers");

const items: {
  icon: IconComponent;
  title: string;
  description: string;
}[] = [
  {
    icon: Cpu,
    title: "Powerful APIs",
    description:
      "Hook into our core systems with well-documented, type-safe APIs designed for extensibility.",
  },
  {
    icon: Box,
    title: "Quality First",
    description:
      "We deliver polished, reliable products backed by excellent support and documentation.",
  },
  {
    icon: Wrench,
    title: "Modern Tooling",
    description:
      "Leverage the latest technologies like React, Rust, Java, TypeScript, and C++ for high-performance development.",
  },
  {
    icon: ArrowRotateRight,
    title: "CI/CD Ready",
    description:
      "Our software integrates seamlessly with modern deployment pipelines and automated workflows.",
  },
  {
    icon: Terminal,
    title: "CLI Utilities",
    description:
      "Speed up your workflow with powerful command-line tools designed for speed and automation.",
  },
  {
    icon: Route,
    title: "Docker Ready",
    description:
      "Deploy instantly with pre-built Docker images for consistent environments across setups.",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description:
      "Comprehensive guides and references to help you get the most out of VOMLabs software.",
  },
];

export function Engineers() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    logger.debug("Engineers section mounted");
  }, []);

  return (
    <Section
      id="engineers"
      eyebrow="FOR DEVELOPERS"
      title="Built for Engineers"
      description="We prioritize developer experience, performance, and code quality in everything we build."
    >
      <ul className="border-border border-t">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li
              className="border-border grid gap-2 border-b py-6 md:grid-cols-[1fr_1.5fr] md:gap-10 md:py-8"
              key={item.title}
            >
              <div className="flex items-center gap-3">
                <Icon className="text-lime-dim dark:text-lime size-5 shrink-0" />
                <h3 className="text-sm font-medium tracking-[-0.01em] sm:text-base md:text-lg">
                  {item.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                {item.description}
              </p>
            </li>
          );
        })}
      </ul>
      {mounted && (
        <div className="mt-10">
          <Button
            onClick={() => {
              try {
                logger.info("Documentation button clicked", {
                  url: "https://docs.vomlabs.com",
                });
                toast.info("Opening documentation...", { duration: 2000 });
                window.open(
                  "https://docs.vomlabs.com",
                  "_blank",
                  "noopener,noreferrer",
                );
              } catch (error) {
                logger.error("Failed to open documentation", {
                  error: error instanceof Error ? error.message : String(error),
                });
                toast.error("Failed to open documentation. Please try again.");
              }
            }}
          >
            <BookOpen className="size-5" />
            View the Documentation
          </Button>
        </div>
      )}
    </Section>
  );
}
