import ArrowUpRight from "@gravity-ui/icons/ArrowUpRight";
import { createFileRoute } from "@tanstack/react-router";
import { parseAsString, useQueryState } from "nuqs";

import { getProducts } from "@/lib/db/functions";
import { cn } from "@/lib/utils";

const categories = [
  { id: "minecraft-plugins", label: "Minecraft Plugins" },
  { id: "ide-extensions", label: "IDE Extensions" },
  { id: "libraries", label: "Libraries" },
  { id: "cli-tools", label: "CLI Tools" },
  { id: "gui-applications", label: "GUI Applications" },
] as const;

type CategoryId = (typeof categories)[number]["id"];

/** Products that should never be linked. */
const NO_LINK_PRODUCTS = new Set(["LazyDesktop"]);

export const Route = createFileRoute("/products")({
  loader: async () => {
    const { products } = await getProducts();
    return { products };
  },
  component: ProductsPage,
});

function ProductsPage() {
  const { products } = Route.useLoaderData();
  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withDefault("minecraft-plugins"),
  );

  const activeCategory = categories.some((c) => c.id === category)
    ? (category as CategoryId)
    : "minecraft-plugins";

  const filtered = products.filter((p) => {
    const tag = p.tagline?.toLowerCase() ?? "";
    const name = p.name?.toLowerCase() ?? "";
    const desc = p.description?.toLowerCase() ?? "";

    switch (activeCategory) {
      case "minecraft-plugins":
        return (
          tag.includes("minecraft") ||
          tag.includes("plugin") ||
          name.includes("minecraft") ||
          desc.includes("minecraft")
        );
      case "ide-extensions":
        return (
          tag.includes("ide") ||
          tag.includes("extension") ||
          tag.includes("vscode") ||
          tag.includes("intellij") ||
          desc.includes("ide")
        );
      case "libraries":
        return (
          tag.includes("library") ||
          tag.includes("lib") ||
          desc.includes("library")
        );
      case "cli-tools":
        return (
          tag.includes("cli") ||
          tag.includes("command") ||
          desc.includes("command-line")
        );
      case "gui-applications":
        return (
          tag.includes("gui") ||
          tag.includes("app") ||
          tag.includes("desktop") ||
          desc.includes("desktop")
        );
      default:
        return true;
    }
  });

  return (
    <main className="border-border border-t">
      <div className="container-editorial py-16 md:py-24">
        <header className="mb-12 flex max-w-3xl flex-col gap-4 md:mb-16">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            Store
          </p>
          <h1 className="display">Products</h1>
          <p className="lead max-w-2xl">
            Open-source software built by VOMLabs.
          </p>
        </header>

        {/* Category tabs */}
        <nav
          aria-label="Product categories"
          className="mb-10 flex flex-wrap gap-2"
        >
          {categories.map((cat) => (
            <button
              aria-pressed={cat.id === activeCategory}
              className={cn(
                "rounded-full border px-4 py-1 text-sm font-medium transition-colors",
                cat.id === activeCategory
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Product list */}
        <div className="divide-border border-border flex flex-col divide-y border-y">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-sm">
                No products in this category yet.
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Check back soon — we&apos;re always building new tools.
              </p>
            </div>
          ) : (
            filtered.map((product) => {
              const isNoLink = NO_LINK_PRODUCTS.has(product.name);
              const linkHref = !isNoLink
                ? (product.homepageUrl ?? product.githubUrl ?? null)
                : null;
              const isExternal = linkHref?.startsWith("http");

              const content = (
                <>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="text-lg font-medium tracking-[-0.01em] md:text-xl">
                        {product.name}
                      </h2>
                      <span className="text-muted-foreground font-mono text-xs tracking-[0.08em] uppercase">
                        {product.tagline}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  {linkHref && (
                    <span className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm underline-offset-4 group-hover:underline">
                      {isExternal ? "Visit" : "Learn more"}
                      <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:-translate-y-0" />
                    </span>
                  )}
                </>
              );

              const rowClasses =
                "grid gap-3 py-8 md:grid-cols-[1fr_auto] md:items-baseline md:gap-10";

              if (linkHref && isExternal) {
                return (
                  <a
                    className={cn(rowClasses, "group transition-colors")}
                    href={linkHref}
                    key={product.id}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {content}
                  </a>
                );
              }

              if (linkHref) {
                return (
                  <a
                    className={cn(rowClasses, "group transition-colors")}
                    href={linkHref}
                    key={product.id}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <article className={rowClasses} key={product.id}>
                  {content}
                </article>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
