import Code from "@gravity-ui/icons/Code";
import Puzzle from "@gravity-ui/icons/Puzzle";
import Terminal from "@gravity-ui/icons/Terminal";
import Wrench from "@gravity-ui/icons/Wrench";

import { type IconComponent } from "@/components/icons";
import { Section } from "@/components/ui/section";

const items: {
  icon: IconComponent;
  title: string;
  description: string;
}[] = [
  {
    icon: Puzzle,
    title: "Software Engineering",
    description:
      "Performant, modern, and well-crafted software designed to solve real problems without the bloat.",
  },
  {
    icon: Wrench,
    title: "Affordable Products",
    description:
      "High-quality, feature-rich tools and libraries offered at competitive prices.",
  },
  {
    icon: Code,
    title: "Web Development",
    description:
      "Clean, responsive, and performant websites built with modern frameworks and best-in-class tooling.",
  },
  {
    icon: Terminal,
    title: "Developer Tools",
    description:
      "Powerful resources, libraries, and tooling for the development community and beyond.",
  },
];

export function About() {
  return (
    <Section
      id="about"
      eyebrow="WHAT WE DO"
      title="Capabilities"
      description="We are a team of developers building high-quality, modern software and developer-focused solutions at affordable prices."
    >
      <ol className="divide-border border-border flex flex-col divide-y border-y">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <li
              className="group grid gap-2 py-6 md:grid-cols-[3rem_1fr_1.4fr] md:gap-8 md:py-8"
              key={item.title}
            >
              <span className="text-muted-foreground/60 hidden font-mono text-xs sm:block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-3">
                <Icon className="text-lime-dim dark:text-lime size-5 shrink-0" />
                <h3 className="text-base font-medium tracking-[-0.01em] transition-transform duration-200 group-hover:translate-x-0.5 sm:text-lg md:text-xl">
                  {item.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                {item.description}
              </p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
