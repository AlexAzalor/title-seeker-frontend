"use client";

import { useLocale, useTranslations } from "next-intl";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { COLORS } from "@/lib/colors";
import { type GenreChartDataOut, Language } from "@/orval_api/model";

type Props = {
  radarData: GenreChartDataOut[];
};

export function GenreRadarChart({ radarData }: Props) {
  const t = useTranslations("Charts");

  const locale = useLocale();
  const lang = Language[locale as keyof typeof Language];

  const chartConfig = {
    count: {
      label: lang === Language.uk ? "Кількість" : "Count",
      color: COLORS.mainUiPurple,
    },
  } satisfies ChartConfig;

  return (
    <Card className="mb-4 w-fit" aria-label="genre-radar-chart">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("genresTitle")}</CardTitle>
        <CardDescription>{t("genresSubtext")}</CardDescription>
      </CardHeader>
      <CardContent className="relative pb-0">
        <ChartContainer
          isEmpty={radarData.length < 3}
          config={chartConfig}
          className="mx-auto aspect-square max-h-62 w-full p-0 2xl:w-100"
          emptyState={t("noStats")}
        >
          <RadarChart data={radarData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="w-36" />}
            />
            <PolarAngleAxis dataKey="name" />
            <PolarGrid />
            <Radar
              dataKey="count"
              fill="var(--color-count)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
