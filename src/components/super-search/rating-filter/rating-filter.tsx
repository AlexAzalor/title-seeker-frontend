"use client";

import { TYPE_KEYS } from "@/components/movie/rating/utils";
import { Slider } from "@/components/ui/slider";
import { manageSearchParameters } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { RatingButton } from "./rating-button";
import { Gauge } from "lucide-react";

const getRatingValues = (value: string): number[] => {
  return value.split(",").map((e) => Number(e));
};

export const RatingFilter = () => {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const currentRatingValue = currentSearchParams.get("rating");

  const defaultValue = currentRatingValue
    ? getRatingValues(currentRatingValue)
    : [0, 0];

  const [value, setValue] = useState<number[]>(defaultValue);

  const submitRatingFilter = () => {
    if (value.every((e) => e === 0)) return;

    const v = `${value}`; // [7.24, 10] => "7.24,10"
    if (currentRatingValue === v) {
      return;
    }
    manageSearchParameters(
      "rating",
      v,
      currentRatingValue === v ? v : undefined,
      currentSearchParams,
      router,
      undefined,
      "rating",
      currentRatingValue === v ? TYPE_KEYS : undefined,
    );
  };

  return (
    <div
      className="flex w-full items-center gap-4 px-3"
      aria-label="rating-filter"
      // Adding data-vaul-no-drag to the slider's wrapper div tells vaul to ignore pointer/touch drag events originating from that element, so the slider can be dragged freely without the drawer intercepting and closing.
      data-vaul-no-drag
    >
      <Gauge size={30} className="hidden md:block" />

      <Slider
        defaultValue={value}
        value={value}
        range
        step={0.5}
        max={10}
        min={0}
        minStepsBetweenThumbs={1}
        onValueChange={(value) => setValue(value)}
      />

      <RatingButton onClick={submitRatingFilter} value={value?.join("–")} />
    </div>
  );
};
