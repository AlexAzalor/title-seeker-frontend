"use client";

import { useLocale } from "next-intl";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GenreChartDataOut, Language } from "@/orval_api/model";

type Props = {
  radarData: GenreChartDataOut[];
};

export function GenreRadarChart({ radarData }: Props) {
  const locale = useLocale();
  const lang = Language[locale as keyof typeof Language];

  const chartConfig = {
    count: {
      label: lang === Language.uk ? "Кількість" : "Count",
      color: "#4a3aff",
    },
  } satisfies ChartConfig;

  return (
    <Card className="mb-4 w-fit">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 8 most popular movie genres</CardTitle>
        <CardDescription>
          Shows how many movies with these genres you have rated.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative pb-0">
        <ChartContainer
          isEmpty={radarData.length < 3}
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full p-0 2xl:w-[400px]"
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
