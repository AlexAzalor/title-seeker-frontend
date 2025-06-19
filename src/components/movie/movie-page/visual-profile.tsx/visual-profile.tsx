"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { useModal } from "@/hooks/use-modal";

import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import { VisualProfileEditForm } from "@/components/movie/movie-page/visual-profile.tsx/visual-profile-movie-edit-form";
import { VisualProfileChartMemo } from "@/components/movie/movie-page/visual-profile.tsx/visual-profile-chart";

import { getVisualProfileCategories } from "@/app/services/user-api";
import { Language, type VisualProfileData } from "@/orval_api/model";

const CustomModal = dynamic(
  () => import("@/components/my-custom-ui/custom-modal"),
  { ssr: false },
);

type Props = {
  radarData: VisualProfileData;
  isOwner?: boolean;
  movieKey: string;
};

export function VisualProfile({ movieKey, radarData, isOwner }: Props) {
  const { isOpen, open, close } = useModal();
  const [categories, setCategories] = useState<VisualProfileData[]>([]);

  const locale = useLocale();
  const lang = Language[locale as keyof typeof Language];

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

      <VisualProfileChartMemo criteria={radarData.criteria} lang={lang} />

      {isOpen && (
        <CustomModal isOpen={isOpen} onClose={close}>
          <VisualProfileEditForm
            movieKey={movieKey}
            visualProfileData={radarData}
            categories={categories}
          />
        </CustomModal>
      )}
    </>
  );
}
