"use client";

import { defineChart, type DomChartDefinition } from "@tanstack/charts";
import {
  Chart,
  type ChartTooltipBodyRenderContext,
} from "@tanstack/charts/react/tooltip";
import { tooltip as chartTooltip } from "@tanstack/charts/tooltip";
import {
  createContext,
  useContext,
  useId,
  useMemo,
  type ComponentType,
  type HTMLAttributes,
  type ReactNode,
  type SVGProps,
} from "react";

import { cn } from "@/lib/utils";

/**
 * Chart config maps series keys to their presentation (label, color, icon).
 *
 * Colors can be theme-aware via `theme`, or static via `color`. Static colors
 * are injected as `--color-<key>` CSS variables scoped to the chart wrapper so
 * marks, legends, and tooltips can all reference them.
 */
export type ChartConfig = Record<
  string,
  {
    label?: ReactNode;
    color?: string;
    theme?: { light: string; dark: string };
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
  }
>;

const ChartContext = createContext<{ config: ChartConfig } | null>(null);

export function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

interface ChartContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Semantic chart id used to scope CSS variables. Defaults to a generated id. */
  id?: string;
  className?: string;
  config: ChartConfig;
  /** A TanStack Charts definition created with `defineChart({ ... })`. */
  definition: DomChartDefinition;
  height?: number;
  ariaLabel?: string;
  renderTooltipBody?: (context: ChartTooltipBodyRenderContext) => ReactNode;
}

/**
 * Renders a TanStack Charts definition and provides the `config` to all
 * chart subcomponents (tooltip, legend).
 */
export function ChartContainer({
  id,
  className,
  config,
  definition,
  height = 320,
  ariaLabel = "Chart",
  renderTooltipBody,
  ...props
}: ChartContainerProps) {
  const generatedId = useId();
  const chartId = id ?? `chart-${generatedId.replace(/:/g, "")}`;
  const chartContextValue = useMemo(() => ({ config }), [config]);

  return (
    <ChartContext.Provider value={chartContextValue}>
      <div
        data-chart={chartId}
        data-slot="chart"
        className={cn("flex w-full justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle config={config} id={chartId} />
        <Chart
          ariaLabel={ariaLabel}
          className="w-full"
          definition={definition}
          height={height}
          renderTooltipBody={renderTooltipBody}
        />
      </div>
    </ChartContext.Provider>
  );
}

/**
 * Injects `--color-<key>` CSS variables for each configured series color.
 */
export function ChartStyle({
  id,
  config,
}: {
  id: string;
  config: ChartConfig;
}) {
  const colorConfig = Object.entries(config).filter(
    ([, item]) => item.theme || item.color,
  );

  if (colorConfig.length === 0) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries({
          light: "",
          dark: ".dark",
        } as const)
          .map(([theme, prefix]) => {
            const selector = prefix
              ? `[data-chart="${id}"][data-theme="${theme}"]`
              : `[data-chart="${id}"]`;

            const variables = colorConfig
              .map(([key, item]) => {
                const color =
                  item.theme?.[
                    theme as keyof NonNullable<ChartConfig[string]["theme"]>
                  ] ?? item.color;
                return color ? `  --color-${key}: ${color};` : null;
              })
              .filter(Boolean)
              .join("\n");

            return `${selector} {\n${variables}\n}`;
          })
          .join("\n"),
      }}
    />
  );
}

/**
 * Tooltip extension builder for `defineChart({ tooltip: ... })`.
 *
 * @example
 * defineChart({
 *   data,
 *   marks,
 *   tooltip: ChartTooltip({ title: (d) => String(d.week) }),
 * })
 */
export const ChartTooltip = chartTooltip;

interface ChartTooltipContentProps {
  /** The tooltip body render context passed by the chart. */
  context: ChartTooltipBodyRenderContext;
  className?: string;
  indicator?: "dot" | "line" | "none";
  hideLabel?: boolean;
  labelFormatter?: (label: string) => ReactNode;
  valueFormatter?: (value: unknown) => string;
}

/**
 * Default themed tooltip body. Pass as `renderTooltipBody` to
 * `ChartContainer`.
 */
export function ChartTooltipContent({
  context,
  className,
  indicator = "dot",
  hideLabel = false,
  labelFormatter,
  valueFormatter,
}: ChartTooltipContentProps) {
  const { config } = useChart();
  const { points } = context;

  if (!points?.length) {
    return null;
  }

  const groupLabel = points[0]?.groupLabel ?? "";

  return (
    <div
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-lg border bg-background/95 p-3 text-xs shadow-xl backdrop-blur-sm",
        className,
      )}
    >
      {!hideLabel && (
        <div className="text-muted-foreground font-medium">
          {labelFormatter ? labelFormatter(groupLabel) : groupLabel}
        </div>
      )}
      <div className="grid gap-1.5">
        {points.map((point) => {
          const item = config[String(point.group)];
          const color =
            point.color ?? item?.color ?? `var(--color-${point.group})`;

          return (
            <div key={point.key} className="flex w-full items-center gap-1.5">
              {indicator === "dot" && (
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
              {indicator === "line" && (
                <span
                  aria-hidden="true"
                  className="h-1.5 w-4 shrink-0 rounded-xs"
                  style={{ backgroundColor: color }}
                />
              )}
              <span className="text-muted-foreground">
                {item?.label ?? String(point.group)}
              </span>
              <span className="ml-auto font-mono font-medium tabular-nums">
                {valueFormatter
                  ? valueFormatter(point.yValue)
                  : String(point.yValue)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Static legend driven by the chart config.
 */
export function ChartLegend({
  className,
  config,
}: {
  className?: string;
  config: ChartConfig;
}) {
  return <ChartLegendContent className={className} config={config} />;
}

export function ChartLegendContent({
  className,
  config,
}: {
  className?: string;
  config: ChartConfig;
}) {
  const entries = Object.entries(config);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-4 text-xs",
        className,
      )}
    >
      {entries.map(([key, item]) => {
        const Icon = item.icon;
        const color = item.theme?.light ?? item.color;

        return (
          <div key={key} className="flex items-center gap-1.5">
            {Icon ? (
              <Icon className="text-muted-foreground size-3.5" />
            ) : (
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: color ?? `var(--color-${key})`,
                }}
              />
            )}
            <span className="text-muted-foreground">{item.label ?? key}</span>
          </div>
        );
      })}
    </div>
  );
}

export { defineChart };
export type { DomChartDefinition };
