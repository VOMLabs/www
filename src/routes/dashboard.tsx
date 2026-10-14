import Box from "@gravity-ui/icons/Box";
import CircleQuestion from "@gravity-ui/icons/CircleQuestion";
import Gear from "@gravity-ui/icons/Gear";
import Person from "@gravity-ui/icons/Person";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/db/functions";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { user } = await getCurrentUser();
    if (!user) {
      throw redirect({ to: "/login" });
    }
    return { user };
  },
  component: DashboardPage,
});

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function DashboardPage() {
  const { user } = Route.useRouteContext();

  return (
    <main className="border-border border-t">
      <div className="container-editorial py-16 md:py-24">
        {/* Header */}
        <header className="mb-12 flex max-w-3xl flex-col gap-4 md:mb-16">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            Dashboard
          </p>
          <h1 className="display">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="lead max-w-2xl">
            Manage your account, view your projects, and access your downloads.
          </p>
        </header>

        {/* Bento grid */}
        <div className="grid gap-6 md:grid-cols-6">
          {/* -- Profile card: spans 2 cols, 2 rows -- */}
          <Card className="md:col-span-2 md:row-span-2">
            <CardContent className="flex h-full flex-col items-center gap-6 py-8">
              <Avatar className="size-24">
                {user.image ? (
                  <AvatarImage className="object-cover" src={user.image} />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-center">
                <p className="text-foreground text-lg font-medium">
                  {user.name}
                </p>
                <p className="text-muted-foreground text-sm">{user.email}</p>
                {user.username && (
                  <p className="text-muted-foreground font-mono text-xs">
                    @{user.username}
                  </p>
                )}
              </div>
              {user.bio && (
                <p className="text-muted-foreground max-w-[200px] text-center text-sm leading-relaxed">
                  {user.bio}
                </p>
              )}
              <div className="mt-auto pt-2">
                <Button
                  render={<Link to="/settings" />}
                  size="sm"
                  variant="outline"
                >
                  <Gear className="size-3.5" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* -- Account info: spans 4 cols -- */}
          <Card className="md:col-span-4">
            <CardContent className="py-6">
              <h3 className="text-muted-foreground mb-4 font-mono text-xs tracking-[0.15em] uppercase">
                Account
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Role</span>
                  <span className="text-sm font-medium capitalize">
                    {user.role ?? "User"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">
                    Username
                  </span>
                  <span className="text-sm font-medium">
                    @{user.username ?? "—"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">
                    Location
                  </span>
                  <span className="text-sm font-medium">
                    {user.location ?? "—"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Website</span>
                  {user.website ? (
                    <a
                      className="text-foreground text-sm font-medium underline-offset-4 hover:underline"
                      href={user.website}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {user.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    <span className="text-sm font-medium">—</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">
                    Member since
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                {user.birthday && (
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs">
                      Birthday
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(user.birthday).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* -- Quick links: 3-col tiles -- */}
          {[
            {
              label: "Settings",
              desc: "Manage your profile",
              icon: Gear,
              href: "/settings",
            },
            {
              label: "Products",
              desc: "Browse our tools",
              icon: Box,
              href: "/products",
            },
            {
              label: "FAQ",
              desc: "Get help",
              icon: CircleQuestion,
              href: "/faq",
            },
          ].map((link) => (
            <Card key={link.href}>
              <CardContent className="py-6">
                <Link
                  className="group flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  to={link.href as never}
                >
                  <div className="bg-muted group-hover:bg-foreground/10 flex size-9 items-center justify-center rounded-lg transition-colors">
                    <link.icon className="text-muted-foreground size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{link.label}</p>
                    <p className="text-muted-foreground text-xs">{link.desc}</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}

          {/* -- Admin panel (admin only): spans 2 cols -- */}
          {user.role === "admin" && (
            <Card className="md:col-span-2">
              <CardContent className="py-6">
                <Link
                  className="group flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  to="/admin"
                >
                  <div className="bg-muted group-hover:bg-foreground/10 flex size-9 items-center justify-center rounded-lg transition-colors">
                    <Person className="text-muted-foreground size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Admin Panel</p>
                    <p className="text-muted-foreground text-xs">
                      Manage users, FAQs, and content
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
