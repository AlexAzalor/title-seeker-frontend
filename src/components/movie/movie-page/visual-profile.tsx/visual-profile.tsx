"use client";

import { useLocale } from "next-intl";
import { Language, VisualProfileData } from "@/orval_api/model";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { Suspense, useState } from "react";
import { VisualProfileEditForm } from "./visual-profile-movie-edit-form";
import { getVisualProfileCategories } from "@/app/services/user-api";
import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import { VisualProfileChartMemo } from "./visual-profile-chart";
import dynamic from "next/dynamic";
const CustomModal = dynamic(() => import("../../../my-custom-ui/custom-modal"));

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
