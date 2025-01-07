"use client";

import { formatKey } from "@/lib/utils";
import {
  QuickMovieFormData,
  RatingCriterion,
  UserRatingCriteria,
} from "@/orval_api/model";
import { MovieFormField } from "./movie-form-field";
import { useForm } from "react-hook-form";
import { TypeMovieScheme } from "@/types/general";
import { zodResolver } from "@hookform/resolvers/zod";
import { MovieScheme } from "@/types/zod-scheme";
import { quicklyAddNewMovie } from "@/app/actions";
import { toast } from "sonner";
import { RateMovie } from "./rate-movie";
import { INITIAL_RATE } from "../rating/utils";
import { useRef, useState } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

export const QuicklyAddNewMovie = () => {
  const [ratingCriteria, setRatingCriteria] = useState<RatingCriterion>(
    RatingCriterion.basic,
  );

  const ratingRef = useRef<UserRatingCriteria & { rating: number }>({
    ...INITIAL_RATE,
    rating: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TypeMovieScheme>({
    resolver: zodResolver(MovieScheme),
    defaultValues: {
      key: "",
      title_en: "",
    },
  });
  const watchFields = watch(["title_en"]);

  const onSubmit = async (data: TypeMovieScheme) => {
    if (ratingRef.current.rating < 1) {
      toast.error("Rating must be more than 1");
      return;
    }

    const dataToSend: QuickMovieFormData = {
      ...data,
      rating: ratingRef.current.rating,
      rating_criterion_type: ratingCriteria,
      rating_criteria: ratingRef.current,
    };

    console.log("DATA to API: ", dataToSend);

    const response = await quicklyAddNewMovie(dataToSend);

    if (response.status === 201) {
      toast.success(response?.message);
    }

    if (response.status === 400) {
      toast.error(response?.message);
    }
  };

  return (
    <div className="text-textOrange flex items-center gap-3 font-bold">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="box-border h-max rounded-[20px] bg-animeprimary p-5">
          <div className="text-4xl font-semibold text-animeneutral-light">
            Add New Director
          </div>

          <MovieFormField
            type="text"
            label="Title EN"
            name="title_en"
            register={register}
            error={errors.title_en}
            labelWidth={64}
          />

          <MovieFormField
            type="text"
            label="Key"
            name="key"
            register={register}
            error={errors.key}
            labelWidth={52}
            value={formatKey(watchFields)}
          />

          <div className="grid gap-2">
            <Label htmlFor="rating-criteria">Rating Criteria</Label>
            <Select
              onValueChange={(value: RatingCriterion) => {
                setRatingCriteria(value);
              }}
              defaultValue={ratingCriteria}
            >
              <SelectTrigger id="rating-criteria">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={RatingCriterion.basic}>Basic</SelectItem>
                <SelectItem value={RatingCriterion.visual_effects}>
                  Visual Effects
                </SelectItem>
                <SelectItem value={RatingCriterion.scare_factor}>
                  Scary Factor
                </SelectItem>
                <SelectItem value={RatingCriterion.full}>Full</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <RateMovie
            criteriaType={ratingCriteria}
            ratingCriteria={{
              ...INITIAL_RATE,
              scare_factor:
                ratingCriteria === RatingCriterion.scare_factor ||
                ratingCriteria === RatingCriterion.full
                  ? 0.01
                  : undefined,
              visual_effects:
                ratingCriteria === RatingCriterion.visual_effects ||
                ratingCriteria === RatingCriterion.full
                  ? 0.01
                  : undefined,
            }}
            ratingRef={ratingRef}
          />

          {!isSubmitting ? (
            <Button
              type="submit"
              className="mt-7 h-12 w-full cursor-pointer rounded-xl border-0 text-center text-lg transition-all duration-200 hover:rounded-md"
            >
              Submit
            </Button>
          ) : (
            <div>Spinner</div>
          )}
        </div>
      </form>
    </div>
  );
};
