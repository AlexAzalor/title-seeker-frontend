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
import { Language, TitleVisualProfileOut, UserRole } from "@/orval_api/model";
import { COLORS } from "@/lib/colors";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { Suspense } from "react";
import { CustomModal } from "@/components/my-custom-ui/custom-modal";
import { VisualProfileEditForm } from "./visual-profile-edit-form";

type Props = {
  radarData: TitleVisualProfileOut;
  userRole?: UserRole;
  movieKey: string;
};

export function VisualProfile({ movieKey, radarData, userRole }: Props) {
  const { isOpen, open, close } = useModal();

  const locale = useLocale();
  const lang = Language[locale as keyof typeof Language];

  const chartConfig = {
    count: {
      label: lang === Language.uk ? "Кількість" : "Count",
      color: COLORS.mainUiPurple,
    },
  } satisfies ChartConfig;

  const handleEdit = () => {
    open();
  };

  return (
    <>
      <Card className="mb-4 w-fit" aria-label="genre-radar-chart">
        <CardHeader className="items-center pb-0">
          {userRole === "owner" && (
            <Button variant="link" className="h-7 p-0" onClick={handleEdit}>
              Edit
            </Button>
          )}
          <CardTitle>{radarData.name}</CardTitle>
          <CardDescription>{radarData.description}</CardDescription>
        </CardHeader>
        <CardContent className="relative pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] w-full p-0 2xl:w-[400px]"
          >
            <RadarChart data={radarData.criteria}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent className="w-36" />}
              />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis domain={[0, 5]} hide />
              <PolarGrid />
              <Radar
                dataKey="rating"
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

      <Suspense>
        <CustomModal isOpen={isOpen} onClose={close}>
          <div className="mb-2 flex items-center justify-center gap-2">
            <p>Edit Visual Profile</p>
          </div>
          <VisualProfileEditForm
            movieKey={movieKey}
            visualProfileData={radarData}
          />
        </CustomModal>
      </Suspense>
    </>
  );
}
