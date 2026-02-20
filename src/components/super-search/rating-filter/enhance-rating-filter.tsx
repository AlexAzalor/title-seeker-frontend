"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ReadonlyURLSearchParams, useRouter } from "next/navigation";

import { manageSearchParameters } from "@/lib/utils";
import { RatingCriterion } from "@/orval_api/model";
import { Slider } from "../../ui/slider";
import { CriteriaEnum, RATING_MAX } from "@/components/movie/rating/utils";
import { RatingTypeSelector } from "@/components/movie/rating/rating-type-selector";
import { RatingButton } from "../rating-filter/rating-button";

type Props = {
  currentSearchParams: ReadonlyURLSearchParams;
  router: ReturnType<typeof useRouter>;
};

export const EnchancedRatingFilter = ({
  currentSearchParams,
  router,
}: Props) => {
  const tRating = useTranslations("Rating");

  const currentVisualEffects = currentSearchParams.get("visual_effects");
  const currentScareFactor = currentSearchParams.get("scare_factor");
  const currentHumor = currentSearchParams.get("humor");
  const currentActing = currentSearchParams.get("animation_cartoon");

  const currentValue =
    currentVisualEffects || currentScareFactor || currentHumor || currentActing;

  const [ratingFilterState, setRatingFilterState] = useState<{
    value: number[];
    maxScore: number;
  }>({
    value: [Number(currentValue) || 0],
    maxScore: RATING_MAX.visual_effects,
  });

  const [ratingType, setRatingType] = useState<CriteriaEnum>(
    CriteriaEnum.VISUAL_EFFECTS,
  );

  const handleSelectRatingType = (value: CriteriaEnum) => {
    manageSearchParameters(
      value,
      "0",
      undefined,
      currentSearchParams,
      router,
      undefined,
      ratingType,
    );

    setRatingType(value);
    setRatingFilterState({ value: [0], maxScore: RATING_MAX[value] });
  };

  const submitRatingFilter = () => {
    const v = `${ratingFilterState.value}`; // [7.24, 10] => "7.24,10"

    if (currentValue === v) {
      return;
    }

    manageSearchParameters(
      ratingType,
      v,
      undefined,
      currentSearchParams,
      router,
      undefined,
      ratingType,
    );
  };

  const items = useMemo(() => {
    return [
      {
        value: RatingCriterion.visual_effects,
        label: tRating("visual_effects.name"),
      },
      {
        value: RatingCriterion.scare_factor,
        label: tRating("scare_factor.name"),
      },
      { value: RatingCriterion.humor, label: tRating("humor.name") },
      {
        value: RatingCriterion.animation_cartoon,
        label: tRating("animation_cartoon.name"),
      },
    ];
  }, [tRating]);

  return (
    <>
      <RatingTypeSelector<CriteriaEnum>
        items={items}
        label={tRating("ratingType.name")}
        onValueChange={handleSelectRatingType}
        defaultValue={ratingType}
      />

      <div
        className="flex w-full items-center gap-4 pr-3"
        aria-label="rating-filter"
      >
        <Slider
          defaultValue={ratingFilterState.value}
          value={ratingFilterState.value}
          step={0.5}
          max={ratingFilterState.maxScore}
          min={0}
          minStepsBetweenThumbs={0.5}
          onValueChange={(value) =>
            setRatingFilterState({
              value: value,
              maxScore: RATING_MAX[ratingType],
            })
          }
        />

        <RatingButton
          onClick={submitRatingFilter}
          value={ratingFilterState.value?.join("-")}
        />
      </div>
    </>
  );
};
