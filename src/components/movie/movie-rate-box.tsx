"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { rateMovie, updateRateMovie } from "@/app/actions";
import { toast } from "sonner";
import {
  MovieOutUserRatingCriterion,
  RatingCriterion,
  UserRateMovieIn,
  UserRatingCriteria,
} from "@/orval_api/model";
import { RateMovie } from "./rating/rate-movie";
import { RatingDataOut } from "./add-movie/key-fields-form";

type Props = {
  movieKey: string;
  ratingType: RatingCriterion;
  isOwner: boolean;
  isUserRated: boolean;
  userRatingData?: MovieOutUserRatingCriterion;
  overallRatingCriteria: UserRatingCriteria;
};
export const MovieRateBox = ({
  movieKey,
  isOwner,
  userRatingData,
  isUserRated,
  overallRatingCriteria,
  ratingType,
}: Props) => {
  const router = useRouter();
  const ratingRef = useRef<RatingDataOut>({
    ratingData: userRatingData || ({} as UserRatingCriteria),
    ratingCriterionType: RatingCriterion.basic,
    rating: 0,
  });

  const submitRating = async (userRatingInput: UserRateMovieIn) => {
    if (isUserRated || isOwner) {
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
