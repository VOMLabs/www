"use client";

import Moon from "@gravity-ui/icons/Moon";
import Sun from "@gravity-ui/icons/Sun";
import { useTheme } from "next-themes";
import { useEffect, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { createLogger } from "@/lib/logger";

const logger = createLogger("ThemeToggle");

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    logger.debug("ThemeToggle mounted", { theme });
  }, [theme]);

  if (!mounted) {
    return (
      <Button size="icon" variant="ghost">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={() => {
        try {
          const next = theme === "light" ? "dark" : "light";
          logger.info("Theme toggled", { from: theme, to: next });
          setTheme(next);
        } catch (error) {
          logger.error("Failed to toggle theme", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }}
      size="icon"
      variant="ghost"
    >
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
