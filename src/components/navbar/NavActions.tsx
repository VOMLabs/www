"use client";

import ArrowRightFromLine from "@gravity-ui/icons/ArrowRightFromLine";
import Gear from "@gravity-ui/icons/Gear";
import House from "@gravity-ui/icons/House";
import Person from "@gravity-ui/icons/Person";

import { Link } from "@/components/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { authLabels, type NavSession } from "./nav-config";
import { signOutUser } from "./nav-utils";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Right-side desktop actions: avatar dropdown when signed in,
 * Sign In link otherwise, always with the theme toggle.
 */
export function NavActions({ session }: { session: NavSession }) {
  if (!session) {
    return (
      <Link
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200"
        to="/login"
      >
        {authLabels.signIn}
      </Link>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              aria-label={`${authLabels.account}: ${session.user.name}`}
              className="hover:ring-foreground/20 focus-visible:ring-ring/50 rounded-full transition-shadow outline-none hover:ring-2 focus-visible:ring-2 focus-visible:ring-offset-2"
              type="button"
            >
              <Avatar size="sm">
                {session.user.image ? (
                  <AvatarImage src={session.user.image} />
                ) : (
                  <AvatarFallback>
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                )}
              </Avatar>
            </button>
          }
        />
        <DropdownMenuContent align="end" className="w-64 p-1.5" sideOffset={10}>
          {/* Profile header */}
          <DropdownMenuGroup className="mb-1">
            <Link
              className="hover:bg-muted flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
              to="/dashboard"
            >
              <Avatar size="sm">
                {session.user.image ? (
                  <AvatarImage src={session.user.image} />
                ) : (
                  <AvatarFallback>
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="text-foreground truncate text-sm font-medium">
                  {session.user.name}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {session.user.email}
                </span>
              </div>
            </Link>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Navigation */}
          <DropdownMenuGroup className="my-1">
            <DropdownMenuItem render={<Link to="/dashboard" />}>
              <House className="size-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link to="/settings" />}>
              <Gear className="size-4" />
              Settings
            </DropdownMenuItem>
            {session.user.role === "admin" && (
              <DropdownMenuItem render={<Link to="/admin" />}>
                <Person className="size-4" />
                {authLabels.dashboard}
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Sign out */}
          <DropdownMenuGroup className="mt-1">
            <DropdownMenuItem
              onClick={() => {
                void signOutUser();
              }}
              variant="destructive"
            >
              <ArrowRightFromLine className="size-4" />
              {authLabels.signOut}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ThemeToggle />
    </>
  );
}
