import ArrowUp from "@gravity-ui/icons/ArrowUp";

import { Link } from "@/components/link";
import { Logo } from "@/components/logo";
import {
  footerNavigation,
  footerLegalLinks,
  footerProductLinks,
  socialLinks,
} from "@/components/navbar/nav-config";
import { NewsletterSignup } from "@/components/newsletter-signup";

export function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-6 py-12 sm:py-16">
        {/* Newsletter + Brand */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <Link className="flex items-center gap-2.5" to="/">
              <Logo className="size-6" />
              <span className="text-sm font-bold">VOMLabs</span>
            </Link>
            <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">
              Privacy-first developer tools, plugins, and open-source software
              for a safer, faster web.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, ...social }) => (
                <a
                  aria-label={social.label}
                  className="border-border text-muted-foreground hover:text-foreground inline-flex size-8 items-center justify-center rounded-lg border transition-colors"
                  href={social.href}
                  key={social.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-muted-foreground font-mono text-xs tracking-[0.15em] uppercase">
              Stay Updated
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Get the latest updates on new products and releases.
            </p>
            <NewsletterSignup />
          </div>
        </div>

        {/* Link Grid */}
        <div className="border-border grid grid-cols-2 gap-8 border-t pt-8 sm:grid-cols-3">
          <div className="space-y-4">
            <h2 className="text-muted-foreground font-mono text-xs tracking-[0.15em] uppercase">
              Navigation
            </h2>
            <ul className="space-y-2">
              {footerNavigation.map((link) => (
                <li key={link.label}>
                  <Link
                    className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-muted-foreground font-mono text-xs tracking-[0.15em] uppercase">
              Products
            </h2>
            <ul className="space-y-2">
              {footerProductLinks.map((link) => (
                <li key={link.label}>
                  <a
                    className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-muted-foreground font-mono text-xs tracking-[0.15em] uppercase">
              Legal
            </h2>
            <ul className="space-y-2">
              {footerLegalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-border mt-8 flex items-center justify-between border-t pt-6 sm:mt-10">
          <p className="text-muted-foreground text-xs">
            &copy; {year} VOMLabs. All Rights Reserved.
          </p>
          <button
            aria-label="Back to top"
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={scrollToTop}
            type="button"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
