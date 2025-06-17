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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Language, VisualProfileCriterionData } from "@/orval_api/model";
import { COLORS } from "@/lib/colors";

type Props = {
  criteria: VisualProfileCriterionData[];
  lang: Language;
};

export const VisualProfileChart = ({ criteria, lang }: Props) => {
  const chartConfig = {
    rating: {
      label: lang === Language.uk ? "Бал" : "Rating",
      color: COLORS.mainUiPurple,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[364px] w-full p-0 2xl:w-full"
    >
      <RadarChart data={criteria}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent className="w-36" />}
        />

        <PolarAngleAxis
          dataKey="name"
          className="text-sm"
          tick={{ fill: COLORS.lightGray, fontSize: 16, width: 140 }}
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
