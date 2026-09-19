import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { blogPosts, faqs, products, users } from "../lib/db/schema.js";
import { env } from "../lib/env.js";

const connectionString = env.DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client);

const faqData = [
  {
    question: "Can I contribute to VOMLabs projects?",
    answer:
      "Absolutely! Most of our projects are open source and we welcome contributions of all skill levels. Join our Discord to get started.",
  },
  {
    question: "Can I use VOMLabs tools for commercial projects?",
    answer:
      "Yes, most of our tools are open source and free to use for both personal and commercial projects under the respective project licenses.",
  },
  {
    question: "Do you collect any telemetry?",
    answer:
      "Yes — anonymously. Our Minecraft plugins use FastStats (faststats.dev) to collect anonymous usage statistics such as plugin version and server platform, so we can understand adoption and improve our software. No personal data is collected, and the telemetry can be disabled in each plugin's configuration.",
  },
  {
    question: "How often do you release updates?",
    answer:
      "We release updates regularly, with major versions following semantic versioning. Security patches and bug fixes are shipped as needed.",
  },
  {
    question: "How do I get VOMLabs software?",
    answer:
      "All our software is available on GitHub. You can download releases, build from source, or use our pre-built Docker images.",
  },
  {
    question: "How do I migrate from other tools?",
    answer:
      "We provide migration guides and documentation to help you transition smoothly from other tools to VOMLabs software.",
  },
  {
    question: "What programming languages does VOMLabs use?",
    answer:
      "We primarily use Rust, Java, TypeScript, and C++ across our projects, chosen for performance, safety, and developer experience.",
  },
  {
    question: "Are VOMLabs projects free to use?",
    answer:
      "Yes, all of our open-source projects are completely free to use. Some advanced features may be available for enterprise users.",
  },
  {
    question: "How do I report a bug?",
    answer:
      "Report bugs by opening an issue on the relevant GitHub repository. Include detailed steps to reproduce and your environment information.",
  },
  {
    question: "Does VOMLabs have a Discord server?",
    answer:
      "Yes! Join our community Discord at discord.vomlabs.com to chat with developers, get support, and stay updated on new releases.",
  },
  {
    question: "Can I request a new feature?",
    answer:
      "Feature requests are welcome. Open a GitHub discussion or suggestion in our Discord. We review all community feedback regularly.",
  },
  {
    question: "What is the license for VOMLabs projects?",
    answer:
      "Most of our projects are licensed under the MIT or Apache 2.0 license. Check the LICENSE file in each repository for specifics.",
  },
  {
    question: "How do I build VOMLabs projects from source?",
    answer:
      "Clone the repository and follow the build instructions in the README. Each project includes detailed setup steps for development.",
  },
  {
    question: "Does VOMLabs offer paid support?",
    answer:
      "We offer enterprise support plans for organizations that need guaranteed response times and dedicated assistance.",
  },
  {
    question: "What Minecraft versions do your plugins support?",
    answer:
      "Our plugins target the latest Minecraft versions with backward compatibility. Check each project's README for specific version support.",
  },
  {
    question: "How do I install a VOMLabs plugin?",
    answer:
      "Download the JAR from GitHub Releases, place it in your server's plugins folder, and restart. Configuration files are generated on first run.",
  },
  {
    question: "Can I use VOMLabs mods on a vanilla server?",
    answer:
      "Most of our mods require Fabric or NeoForge. Check the mod's documentation for specific loader and version requirements.",
  },
  {
    question: "How do I get started with VOMLabs APIs?",
    answer:
      "Visit docs.vomlabs.com for comprehensive API documentation, including quickstart guides, examples, and reference materials.",
  },
  {
    question: "Do you accept pull requests?",
    answer:
      "Yes, we welcome pull requests! Please read our contributing guidelines and ensure your code follows our style conventions.",
  },
  {
    question: "What is the roadmap for VOMLabs?",
    answer:
      "Our roadmap is publicly available on GitHub. We prioritize features based on community feedback and our long-term vision.",
  },
  {
    question: "How do I join the VOMLabs team?",
    answer:
      "We're always looking for talented developers. Join our Discord to connect with the team and learn about open positions.",
  },
  {
    question: "What hosting providers do your tools support?",
    answer:
      "Our tools work with any hosting provider. We provide Docker images for easy deployment and support popular cloud platforms.",
  },
  {
    question: "How do I configure VOMLabs software?",
    answer:
      "Configuration is done through YAML or TOML files. We provide detailed documentation for every configuration option available.",
  },
  {
    question: "Is there a VOMLabs API client library?",
    answer:
      "Yes, we provide client libraries for TypeScript and Rust. They are available on npm and crates.io respectively.",
  },
  {
    question: "How do I stay updated on VOMLabs news?",
    answer:
      "Follow us on GitHub, join our Discord, and check our blog for announcements about new releases and major updates.",
  },
];

const productData = [
  {
    name: "LazyDesktop",
    slug: "lazydesktop",
    tagline: "The KDE-native GitHub Desktop alternative",
    description:
      "LazyDesktop is a KDE-native GitHub Desktop alternative with a Qt UI and a Rust backend. It brings fast, native, privacy-respecting GitHub workflows straight to your Linux desktop.",
    githubUrl: null,
    homepageUrl: null,
    featured: true,
  },
];

const authorData = {
  id: "seed-author-vomlabs",
  name: "VOMLabs Team",
  email: "hello@vomlabs.com",
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const helloWorldPost = {
  slug: "hello-world",
  title: "Hello, World: Vite 8, Rolldown, and pnpm",
  excerpt:
    "A quick tour of the modern build stack powering VOMLabs — Vite 8, Rolldown, and pnpm.",
  content: `Welcome to the first post on the VOMLabs blog. Today we're taking a quick look at the modern JavaScript build stack powering this very site: **Vite 8**, **Rolldown**, and **pnpm**.

## The Stack

This website is built with TanStack Start, styled with Tailwind CSS v4, and tooled end-to-end with pnpm:

- **pnpm** is the package manager — fast, disk-efficient installs backed by a content-addressable store.
- **Vitest** runs the unit tests with the same \`describe\`/\`it\`/\`expect\` API.
- **Vite 8** is the bundler, now powered by **Rolldown**, the Rust-based port of Rollup.
- **Tailwind CSS v4** compiles styles at build time with lightning-fast CSS.

## Code Blocks

Everything in the toolchain runs on plain Node scripts now:

\`\`\`bash
pnpm run dev      # start the dev server
pnpm test         # run tests with vitest
pnpm run db:seed  # seed the database (plain TS via tsx)
\`\`\`

And a quick TypeScript example:

\`\`\`ts
import { describe, expect, it } from "vitest";

describe("tooling", () => {
  it("runs on Node", () => {
    expect(typeof process).toBe("object");
  });
});
\`\`\`

## Callouts

> **Tip:** \`tsx\` runs TypeScript scripts directly, so no separate compile step is needed for \`db:seed\`.

> **Note:** Vitest is a drop-in replacement for \`bun:test\` for plain unit tests — same \`describe\`/\`it\`/\`expect\` API.

## Why It Matters

Fast, reproducible installs. One lockfile for the whole team. That's the whole pitch.

Stay tuned for more posts about what we're building at VOMLabs.`,
};

async function main() {
  try {
    console.log("Seeding FAQs...");
    await db.delete(faqs);
    await db.insert(faqs).values(faqData);
    console.log(`Successfully seeded ${faqData.length} FAQs.`);

    console.log("Seeding Products...");
    await db.delete(products);
    await db.insert(products).values(productData);
    console.log(`Successfully seeded ${productData.length} products.`);

    console.log("Seeding blog author...");
    await db
      .insert(users)
      .values(authorData)
      .onConflictDoNothing({ target: users.id });
    console.log(`Author "${authorData.name}" ready (${authorData.id}).`);

    console.log("Seeding blog posts...");
    await db.delete(blogPosts).where(eq(blogPosts.slug, helloWorldPost.slug));
    await db.insert(blogPosts).values({
      ...helloWorldPost,
      authorId: authorData.id,
      published: true,
    });
    console.log(`Seeded post "${helloWorldPost.title}".`);

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed data:", error);
    process.exit(1);
  }
}

main();
