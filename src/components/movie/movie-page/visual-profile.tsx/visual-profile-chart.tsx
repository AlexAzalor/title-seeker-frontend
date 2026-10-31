"use client";

import { memo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Language, type VisualProfileCriterionData } from "@/orval_api/model";
import { COLORS } from "@/lib/colors";
import { cn } from "@/lib/utils";

type Props = {
  criteria: Pick<VisualProfileCriterionData, "name" | "rating">[];
  lang: Language;
  compact?: boolean;
};

export const VisualProfileChart = ({ criteria, lang, compact }: Props) => {
  const chartConfig = {
    rating: {
      label: lang === Language.uk ? "Бал" : "Rating",
      color: COLORS.mainUiPurple,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        "mx-auto aspect-square w-full p-0 2xl:w-full",
        compact ? "max-h-[260px]" : "max-h-[364px]",
      )}
    >
      <RadarChart data={criteria}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent className="w-36" />}
        />

        <PolarAngleAxis
          dataKey="name"
          className="text-sm"
          tick={{
            fill: COLORS.lightGray,
            fontSize: compact ? 12 : 16,
            width: compact ? 90 : 140,
          }}
        />
        <PolarRadiusAxis domain={[0, 5]} axisLine={false} tick={false} />
        <PolarGrid />
        <Radar
          dataKey="rating"
          fill="var(--color-rating)"
          fillOpacity={0.6}
          dot={{
            r: 4,
            fillOpacity: 1,
          }}
        />
      </RadarChart>
    </ChartContainer>
  );
};

export const VisualProfileChartMemo = memo(VisualProfileChart);
