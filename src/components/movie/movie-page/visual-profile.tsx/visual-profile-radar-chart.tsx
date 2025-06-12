"use client";

import { useLocale } from "next-intl";
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
import {
  Language,
  TitleVisualProfileOut,
  VisualProfileData,
} from "@/orval_api/model";
import { COLORS } from "@/lib/colors";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { Suspense, useState } from "react";
import { CustomModal } from "@/components/my-custom-ui/custom-modal";
import { VisualProfileEditForm } from "./visual-profile-movie-edit-form";
import { getVisualProfileCategories } from "@/app/services/user-api";
import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";

type Props = {
  radarData: TitleVisualProfileOut;
  isOwner?: boolean;
  movieKey: string;
};

export function VisualProfileRadarChart({
  movieKey,
  radarData,
  isOwner,
}: Props) {
  const { isOpen, open, close } = useModal();
  const [categories, setCategories] = useState<VisualProfileData[]>([]);

  const locale = useLocale();
  const lang = Language[locale as keyof typeof Language];

  const chartConfig = {
    rating: {
      label: lang === Language.uk ? "Бал" : "Rating",
      color: COLORS.mainUiPurple,
    },
  } satisfies ChartConfig;

  const geCategories = async () => {
    const res = await getVisualProfileCategories(lang);

    if (Array.isArray(res)) {
      setCategories(res);
    }
  };

  const handleEdit = () => {
    open();
    geCategories();
  };

  return (
    <>
      <div className="relative text-center">
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-gray-purple text-xl font-semibold tracking-tight">
            {radarData.name}
          </h3>
          <TooltipWrapper content={radarData.description} className="w-100" />
        </div>

        {isOwner && (
          <Button
            variant="link"
            className="absolute top-0 right-0"
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}
      </div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[364px] w-full p-0 2xl:w-full"
      >
        <RadarChart data={radarData.criteria}>
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

      <Suspense>
        <CustomModal isOpen={isOpen} onClose={close}>
          <VisualProfileEditForm
            movieKey={movieKey}
            visualProfileData={radarData}
            categories={categories}
          />
        </CustomModal>
      </Suspense>
    </>
  );
}
