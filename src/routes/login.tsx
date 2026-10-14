import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn.email({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Failed to sign in");
    } else {
      toast.success("Signed in successfully");
      window.location.href = "/";
    }
  }

  return (
    <main className="border-border border-t">
      <div className="container-editorial flex min-h-[80vh] items-center py-16 md:py-24">
        <div className="animate-fade-up mx-auto w-full max-w-md motion-reduce:animate-none">
          {/* Header */}
          <div className="mb-10 text-center">
            <p className="eyebrow justify-center">
              <span className="eyebrow-dot" />
              Account
            </p>
            <h1 className="display mt-4 text-4xl sm:text-5xl">Welcome back</h1>
            <p className="lead mt-3">
              Sign in to access your dashboard, licenses, and downloads.
            </p>
          </div>

          {/* Card */}
          <div className="border-border bg-card rounded-2xl border p-8 shadow-sm">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  autoComplete="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  autoComplete="current-password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                />
              </div>
              <Button className="mt-1" disabled={loading} type="submit">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-muted-foreground mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              className="text-foreground font-medium underline-offset-4 hover:underline"
              to="/signup"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
