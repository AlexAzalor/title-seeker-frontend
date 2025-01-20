"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { rateMovie, updateRateMovie } from "@/app/actions";
import { toast } from "sonner";
import {
  MovieOut,
  MovieOutUserRating,
  RatingCriterion,
  UserRateMovieIn,
  UserRatingCriteria,
} from "@/orval_api/model";
import { RateMovie } from "../rate-movie";
import { RatingDataOut } from "../add-movie/key-fields-form";

type Props = {
  data: MovieOut;
  ratingData?: MovieOutUserRating;
};
export const MovieRateBox = ({ data, ratingData }: Props) => {
  const router = useRouter();
  const ratingRef = useRef<RatingDataOut>({
    ratingData: ratingData || ({} as UserRatingCriteria),
    ratingCriterionType: RatingCriterion.basic,
    rating: 0,
  });

  const submitRating = async (data: UserRateMovieIn) => {
    if (!!ratingData) {
      try {
        await updateRateMovie(data);
        toast.success("Rating UPDATED");
      } catch {
        toast.error("Error occured");
      }
    } else {
      try {
        await rateMovie(data);
        toast.success("Rating ADDED");
      } catch {
        toast.error("Error occured");
      }
    }

    router.refresh();
  };

  return (
    <div>
      <RateMovie
        ratingRef={ratingRef}
        movieRateData={data.user_rating}
        type={data.rating_criterion}
        onRateSubmit={submitRating}
        movieKey={data.key}
      />

      {data.ratings?.map((rating) => (
        <div key={rating.uuid}>
          <div>{rating.rating}</div>
          <div>{rating.comment}</div>
        </div>
      ))}
    </div>
  );
};
