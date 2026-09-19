import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp.email({ name, username, email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Failed to sign up");
    } else {
      toast.success("Account created successfully");
      window.location.href = "/";
    }
  }

  return (
    <main className="border-border border-t">
      <div className="container-editorial flex min-h-[80vh] items-center py-16 md:py-24">
        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="mb-10 text-center">
            <p className="eyebrow justify-center">
              <span className="eyebrow-dot" />
              Account
            </p>
            <h1 className="display mt-4 text-4xl sm:text-5xl">
              Create account
            </h1>
            <p className="lead mt-3">
              Get started with VOMLabs — it&apos;s free.
            </p>
          </div>

          {/* Card */}
          <div className="border-border bg-card rounded-2xl border p-8 shadow-sm">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    autoComplete="name"
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    type="text"
                    value={name}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    autoComplete="username"
                    id="username"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    required
                    type="text"
                    value={username}
                  />
                </div>
              </div>
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
                  autoComplete="new-password"
                  id="password"
                  minLength={8}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                />
                <p className="text-muted-foreground text-xs">
                  Must be at least 8 characters.
                </p>
              </div>
              <Button className="mt-1" disabled={loading} type="submit">
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-muted-foreground mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              className="text-foreground font-medium underline-offset-4 hover:underline"
              to="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
