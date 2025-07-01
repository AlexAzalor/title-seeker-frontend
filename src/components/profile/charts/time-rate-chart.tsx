"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLocale, useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language, type TimeRateMovieOut } from "@/orval_api/model";

const MIN = 5;

const formatDateForChart = (
  value: string,
  title: string,
  locale: keyof typeof Language,
) => {
  const date = new Date(value);

  // For example: "Apr 7, 13:25"
  const dateStr = date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });

  const timeStr = date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    // 24-hour format; set to true if you want AM/PM
    hour12: locale === Language.uk ? false : true,
  });

  return `${dateStr}, ${timeStr}, ${title}`;
};

const chartConfig = {
  rating: {
    label: "Movie",
    color: "var(--chart-1)",
  },
  // Second graph
  // mobile: {
  //   label: "Mobile",
  //   color: "var(--chart-2)",
  // },
} satisfies ChartConfig;

type Props = {
  moviesTimeRateData: TimeRateMovieOut[];
};

export function TimeRateChart({ moviesTimeRateData }: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const t = useTranslations("Charts");

  const locale = useLocale() as keyof typeof Language;
  const [moviesCount, setMoviesCount] = useState("30");

  const num = Number(moviesCount);

  const movies = moviesTimeRateData.length < MIN ? [] : moviesTimeRateData;

  return (
    <Card aria-label="time-rate-chart">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{t("timeChart")}</CardTitle>

          <CardDescription>{t("timeChartSubtext")}</CardDescription>
        </div>

        <Select value={moviesCount} onValueChange={setMoviesCount}>
          <SelectTrigger
            className="w-44 rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 30 movies" />
          </SelectTrigger>

          <SelectContent className="rounded-xl">
            <SelectItem value="30" className="rounded-lg">
              {t("last30")}
            </SelectItem>
            <SelectItem value="20" className="rounded-lg">
              {t("last20")}
            </SelectItem>
            <SelectItem value="10" className="rounded-lg">
              {t("last10")}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="relative px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          isEmpty={moviesTimeRateData.length < MIN}
          config={chartConfig}
          className="aspect-auto h-75 w-full"
          emptyState={t("noStats")}
        >
          <AreaChart data={movies.slice(-num)}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0072f5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0072f5" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            {/* set of lines, can change color */}
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="created_at"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString(locale, {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            {!isMobile && (
              <YAxis domain={[0, 10]} tickCount={10} includeHidden />
            )}

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    return formatDateForChart(
                      value,
                      payload[0].payload.movie_title,
                      locale,
                    );
                  }}
                  indicator="dot"
                />
              }
            />
            {/* Second graph */}
            {/* <Area
              dataKey="mobile"
              type="linear"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            /> */}
            <Area
              className=""
              dataKey="rating"
              // type="bump"
              // type="monotone"
              type="linear"
              fill="url(#fillDesktop)"
              stroke="#0072f5"
              stackId="a"
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
