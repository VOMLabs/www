"use client";

import CircleQuestion from "@gravity-ui/icons/CircleQuestion";
import LinkIcon from "@gravity-ui/icons/Link";

import { Link } from "@/components/link";

import { externalLinks, navItems } from "./nav-config";
import { NavMegaMenu } from "./NavMegaMenu";

const linkClassName =
  "text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[15px] font-medium transition-[color,transform] duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/** Maps internal nav labels to icons. */
const internalIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  FAQ: CircleQuestion,
};

/**
 * Desktop (lg+) centered primary links: mega-menu for Products,
 * followed by internal FAQ router links and external Store/Status anchors.
 */
export function NavDesktop() {
  return (
    <div className="hidden items-center gap-1 lg:flex">
      <NavMegaMenu />
      {navItems
        .filter(
          (item): item is (typeof navItems)[number] & { href: string } =>
            !("hasMegaMenu" in item),
        )
        .map((item) => {
          const Icon = internalIcons[item.label];
          return (
            <Link
              className={linkClassName}
              key={item.href}
              to={item.href as never}
            >
              {Icon && <Icon className="size-4" />}
              {item.label}
            </Link>
          );
        })}
      {externalLinks.map((link) => (
        <a
          className={linkClassName}
          href={link.href}
          key={link.label}
          rel="noopener noreferrer"
          target="_blank"
        >
          {link.label}
          <LinkIcon className="size-3.5 opacity-50" />
        </a>
      ))}
    </div>
  );
}
