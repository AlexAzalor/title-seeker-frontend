"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

import { rateMovie, updateRateMovie } from "@/app/services/user-api";
import { toast } from "sonner";
import {
  BaseRatingCriteria,
  MovieOutUserRatingCriteria,
  RatingCriterion,
  UserRateMovieIn,
} from "@/orval_api/model";
import { RateMovie } from "../rating/rate-movie";
import { RatingDataOut } from "../add-movie/key-fields-form";

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
        toast.success("Rating UPDATED");
      } catch {
        toast.error("Error occured");
      }
    } else {
      try {
        await rateMovie(userRatingInput);
        toast.success("Rating ADDED");
      } catch {
        toast.error("Error occured");
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
