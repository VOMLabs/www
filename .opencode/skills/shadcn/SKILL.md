---
name: shadcn
description: Look up shadcn/ui component APIs, installation commands, variant patterns, and customization guides via Context7. Use when working with shadcn components, adding new components, or customizing existing ones.
---

# shadcn/ui Skill

## Overview

This skill retrieves current shadcn/ui documentation via Context7 for component lookup, installation, and customization.

## Workflow

### Step 1: Find the Library

```bash
curl -s "https://context7.com/api/v2/libs/search?libraryName=shadcn&query=COMPONENT_NAME" | jq '.results[0]'
```

### Step 2: Fetch Documentation

```bash
curl -s "https://context7.com/api/v2/context?libraryId=LIBRARY_ID&query=TOPIC&type=txt"
```

## Common Queries

| Topic | Query |
|-------|-------|
| Add component | `npx shadcn@latest add COMPONENT` |
| Button variants | `button cva variants customization` |
| Dialog setup | `dialog modal dialogcontent` |
| Theme tokens | `css variables theme tokens` |
| Custom component | `custom component composition pattern` |

## Quick Reference

```bash
# Add a component
npx shadcn@latest add button
npx shadcn@latest add dialog card input

# Add all components
npx shadcn@latest add --all

# Dry run (preview)
npx shadcn@latest add --dry-run
```

## Customization Pattern

```tsx
// Always accept className, always use cn()
export function MyComponent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("base-styles", className)} {...props}>
      {/* compose primitives */}
    </div>
  )
}
```

## Key Principles

- Components are **copied** into your project — you own the code
- Use CVA (`class-variance-authority`) for variant-based styling
- Use `cn()` from `@/lib/utils` for className merging
- Components expose `data-slot` for CSS selector targeting
- Never modify primitives directly — compose them in wrapper components

## Official Docs

- https://ui.shadcn.com/docs
- https://ui.shadcn.com/docs/components
