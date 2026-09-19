"use client";

import ArrowUpRight from "@gravity-ui/icons/ArrowUpRight";
import LogoGithub from "@gravity-ui/icons/LogoGithub";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createLogger } from "@/lib/logger";

const logger = createLogger("GitHubOrgDialog");

const githubOrgs = [
  {
    name: "VOMLabs",
    url: "https://github.com/VOMLabs",
    description: "Open source projects & tools",
  },
  {
    name: "VOMHost",
    url: "https://github.com/VOMHost",
    description: "Hosting & infrastructure",
  },
] as const;

/**
 * Dialog for selecting a GitHub organization to visit.
 * Manages its own open/close state internally.
 */
export function GitHubOrgDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button
            size="hero"
            variant="hero"
            onClick={() => {
              logger.info("GitHub dialog trigger clicked");
            }}
          >
            <LogoGithub className="size-5" />
            GitHub
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select an Organization</DialogTitle>
          <DialogDescription>
            Choose which GitHub organization you&apos;d like to visit.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          {githubOrgs.map((org) => (
            <a
              className="group border-border bg-card hover:bg-muted flex items-center gap-4 rounded-xl border p-4 transition-colors duration-150"
              href={org.url}
              key={org.name}
              onClick={() => {
                try {
                  logger.info("GitHub org link clicked", {
                    name: org.name,
                    url: org.url,
                  });
                  setOpen(false);
                  toast.info(`Opening ${org.name}...`, {
                    duration: 2000,
                  });
                } catch (error) {
                  logger.error("Failed to open GitHub org", {
                    name: org.name,
                    error:
                      error instanceof Error ? error.message : String(error),
                  });
                }
              }}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                <LogoGithub className="size-5" />
              </div>
              <div className="flex flex-1 flex-col text-left">
                <span className="text-sm font-medium">{org.name}</span>
                <span className="text-muted-foreground text-xs">
                  {org.description}
                </span>
              </div>
              <ArrowUpRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
