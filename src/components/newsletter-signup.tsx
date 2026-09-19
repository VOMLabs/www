"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NewsletterSignup({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Thanks for subscribing!");
    setEmail("");
    setLoading(false);
  };

  return (
    <form
      className={cn("flex flex-col gap-3 sm:flex-row", className)}
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex-1 rounded-none border px-4 py-2.5 text-sm outline-none focus-visible:ring-1"
        disabled={loading}
        id="newsletter-email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        type="email"
        value={email}
      />
      <Button disabled={loading} size="sm" type="submit" variant="hero-glow">
        {loading ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}
