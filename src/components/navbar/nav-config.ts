import LogoGithub from "@gravity-ui/icons/LogoGithub";

import { DiscordIcon } from "@/components/icons/discord";
import { authClient } from "@/lib/auth-client";

// ---------------------------------------------------------------------------
// Product categories (mega-menu)
// ---------------------------------------------------------------------------

export interface ProductCategory {
  label: string;
  href: string;
  description: string;
}

export const productCategories: ProductCategory[] = [
  {
    label: "Minecraft Plugins",
    href: "/products?category=minecraft-plugins",
    description: "Server plugins and modifications",
  },
  {
    label: "IDE Extensions",
    href: "/products?category=ide-extensions",
    description: "VS Code, IntelliJ, and more",
  },
  {
    label: "Libraries",
    href: "/products?category=libraries",
    description: "Premium code libraries",
  },
  {
    label: "CLI Tools",
    href: "/products?category=cli-tools",
    description: "Command-line utilities",
  },
  {
    label: "GUI Applications",
    href: "/products?category=gui-applications",
    description: "Desktop applications",
  },
];

// ---------------------------------------------------------------------------
// Navigation items (mega-menu aware)
// ---------------------------------------------------------------------------

export const navItems = [
  { label: "Products", href: "/products", hasMegaMenu: true },
  { label: "FAQ", href: "/faq" },
] as const;

// ---------------------------------------------------------------------------
// External links (opened in a new tab)
// ---------------------------------------------------------------------------

export const externalLinks = [
  { label: "Store", href: "https://store.vomlabs.com" },
  { label: "Status", href: "https://status.vomlabs.com" },
] as const;

// ---------------------------------------------------------------------------
// Internal routes (rendered with the router Link)
// ---------------------------------------------------------------------------

export const navLinks = [
  { label: "Products", to: "/products" },
  { label: "FAQ", to: "/faq" },
] as const;

// ---------------------------------------------------------------------------
// Social / community links (shown in the mobile drawer)
// ---------------------------------------------------------------------------

export const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/VOMLabs",
    icon: LogoGithub,
  },
  {
    label: "Discord",
    href: "https://discord.vomlabs.com",
    icon: DiscordIcon,
  },
] as const;

// ---------------------------------------------------------------------------
// Auth labels
// ---------------------------------------------------------------------------

export const authLabels = {
  signIn: "Sign In",
  signOut: "Sign Out",
  dashboard: "Dashboard",
  account: "Account",
} as const;

/** Shape of the auth session consumed by the navbar components. */
export type NavSession = ReturnType<typeof authClient.useSession>["data"];

// ---------------------------------------------------------------------------
// Footer navigation
// ---------------------------------------------------------------------------

export const footerNavigation = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "FAQ", to: "/faq" },
] as const;

export const footerLegalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/tos" },
  { label: "Terms of Use", to: "/terms" },
  { label: "Cookie Policy", to: "/cookies" },
] as const;

export const footerProductLinks = [
  { label: "Minecraft Plugins", href: "/products?category=minecraft-plugins" },
  { label: "IDE Extensions", href: "/products?category=ide-extensions" },
  { label: "Libraries", href: "/products?category=libraries" },
  { label: "CLI Tools", href: "/products?category=cli-tools" },
  { label: "GUI Applications", href: "/products?category=gui-applications" },
  { label: "Documentation", href: "https://docs.vomlabs.com" },
] as const;
