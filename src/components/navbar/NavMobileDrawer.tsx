"use client";

import CircleQuestion from "@gravity-ui/icons/CircleQuestion";
import House from "@gravity-ui/icons/House";
import Person from "@gravity-ui/icons/Person";
import ShoppingBag from "@gravity-ui/icons/ShoppingBag";
import { useRouterState } from "@tanstack/react-router";

import { Link } from "@/components/link";
import { cn } from "@/lib/utils";

import { authLabels, type NavSession } from "./nav-config";
import { signOutUser } from "./nav-utils";

const tabs = [
  { label: "Home", to: "/", icon: House },
  { label: "Products", to: "/products", icon: ShoppingBag },
  { label: "FAQ", to: "/faq", icon: CircleQuestion },
] as const;

/**
 * Fixed bottom tab bar for mobile (<lg). Hidden on desktop.
 * Replaces the slide-out drawer with always-visible touch-friendly navigation.
 */
export function NavMobileDrawer({
  open: _open,
  onOpenChange: _onOpenChange,
  session,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: NavSession;
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <nav
      aria-label="Mobile navigation"
      className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur-md lg:hidden"
    >
      <ul className="flex items-stretch justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.to ||
            (tab.to !== "/" && pathname.startsWith(tab.to));
          const Icon = tab.icon;
          return (
            <li key={tab.to}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-w-[48px] flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-[10px] font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                to={tab.to}
              >
                <Icon className="size-5" />
                {tab.label}
              </Link>
            </li>
          );
        })}
        <li>
          {session ? (
            <button
              className="text-muted-foreground hover:text-foreground flex min-w-[48px] flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-[10px] font-medium transition-colors"
              onClick={() => void signOutUser()}
              type="button"
            >
              <Person className="size-5" />
              {authLabels.signOut}
            </button>
          ) : (
            <Link
              className="text-muted-foreground hover:text-foreground flex min-w-[48px] flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-[10px] font-medium transition-colors"
              to="/login"
            >
              <Person className="size-5" />
              {authLabels.signIn}
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
