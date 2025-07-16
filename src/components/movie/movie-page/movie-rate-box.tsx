"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { RateMovie } from "@/components/movie/rating/rate-movie";

import { rateMovie, updateRateMovie } from "@/app/(app)/services/user-api";
import {
  type BaseRatingCriteria,
  type MovieOutUserRatingCriteria,
  RatingCriterion,
  type UserRateMovieIn,
} from "@/orval_api/model";
import type { RatingDataOut } from "@/components/movie/add-movie/key-fields-form";

type Props = {
  movieKey: string;
  ratingType: RatingCriterion;
  isAdmin: boolean;
  isUserRated: boolean;
  userRatingData?: MovieOutUserRatingCriteria;
  overallRatingCriteria: BaseRatingCriteria;
};
export const MovieRateBox = ({
  movieKey,
  isAdmin,
  userRatingData,
  isUserRated,
  overallRatingCriteria,
  ratingType,
}: Props) => {
  const t = useTranslations("Rating");
  const router = useRouter();
  const ratingRef = useRef<RatingDataOut>({
    ratingData: userRatingData || ({} as BaseRatingCriteria),
    ratingCriterionType: RatingCriterion.basic,
    rating: 0,
  });

  const submitRating = async (userRatingInput: UserRateMovieIn) => {
    if (isUserRated || isAdmin) {
      try {
        await updateRateMovie(userRatingInput);
        toast.success(t("ratingUpdated"));
      } catch {
        toast.error("Error updating rating");
        return;
      }
    } else {
      try {
        await rateMovie(userRatingInput);
        toast.success(t("ratingAdded"));
      } catch {
        toast.error("Error adding rating");
        return;
      }
    }

    router.refresh();
  };

  return (
    <RateMovie
      movieKey={movieKey}
      ratingRef={ratingRef}
      movieRateData={userRatingData || overallRatingCriteria}
      type={ratingType}
      onRateSubmit={submitRating}
    />
  );
};
