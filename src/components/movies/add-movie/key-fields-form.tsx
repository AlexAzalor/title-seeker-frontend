import { use, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MovieScheme } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatKey } from "@/lib/utils";
import { MovieSchemeType } from "@/types/general";
import { MovieFormContext } from "./movie-form-wizard";
import { Button } from "@/components/ui/button";
import { MovieFormField } from "../movie-form-field";

import {
  MovieFormData,
  MoviePreCreateDataTemporaryMovie,
  RatingCriterion,
  UserRatingCriteria,
} from "@/orval_api/model";
import { INITIAL_RATE } from "@/components/rating/utils";
import { RateMovie } from "../rate-movie";
import { toast } from "sonner";
import { RatingTypeSelector } from "../ui/rating-type-selector";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type MovieKeyFields = Pick<
  MovieFormData,
  | "key"
  | "title_en"
  | "title_uk"
  | "rating"
  | "rating_criteria"
  | "rating_criterion_type"
>;

type Props = {
  temporaryMovie?: MoviePreCreateDataTemporaryMovie;
};

export const KeyFieldsForm = ({ temporaryMovie }: Props) => {
  const { setMovieFormData, handleNext } = use(MovieFormContext);

  const parsedData = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const [ratingCriteria, setRatingCriteria] = useState<RatingCriterion>(
    temporaryMovie?.rating_criterion_type ||
      parsedData.rating_criterion_type ||
      RatingCriterion.basic,
  );

  const ratingData =
    temporaryMovie?.rating_criteria ||
    parsedData.rating_criteria ||
    INITIAL_RATE;
  const ratingRef = useRef<UserRatingCriteria & { rating: number }>({
    ...ratingData,
    rating: temporaryMovie?.rating || parsedData.rating || 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<MovieSchemeType>({
    resolver: zodResolver(MovieScheme),
    defaultValues: {
      key: temporaryMovie?.key || parsedData.key || "",
      title_en: temporaryMovie?.title_en || parsedData.title_en || "",
      title_uk: parsedData.title_uk || "",
    },
  });
  const watchFields = watch(["title_en"]);

  const onSubmit = async (data: MovieSchemeType) => {
    if (ratingRef.current.rating < 1) {
      toast.error("Rating must be more than 1");
      return;
    }

    const { file, ...restData } = data;

    const dataToSend: MovieKeyFields = {
      ...restData,
      rating: ratingRef.current.rating,
      rating_criterion_type: ratingCriteria,
      rating_criteria: ratingRef.current,
    };

    setMovieFormData((prev) => ({
      ...prev,
      form_data: {
        ...prev.form_data,
        ...dataToSend,
      },
      file: file[0],
    }));

    // Check key for uniqueness
    // Check immidiatly with debounce or on submit?

    localStorage.setItem(
      "new-movie-data",
      JSON.stringify({
        ...parsedData,
        ...dataToSend,
      }),
    );

    handleNext();
  };

  const handleSelectRatingType = (value: RatingCriterion) => {
    setRatingCriteria(value);
  };

  return (
    <div className="text-textOrange flex items-center gap-3 font-bold">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="box-border h-max rounded-[20px] bg-animeprimary p-5">
          <div className="text-4xl font-semibold text-animeneutral-light">
            <h1>Key Fields Form</h1>
          </div>

          <MovieFormField
            type="text"
            label="Key"
            name="key"
            register={register}
            error={errors.key}
            labelWidth={52}
            value={formatKey(watchFields)}
          />

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
            label="Title UK"
            name="title_uk"
            register={register}
            error={errors.title_uk}
            labelWidth={64}
          />

          <MovieFormField
            type="file"
            label="Title EN"
            name="file"
            register={register}
            error={errors.file}
            labelWidth={64}
          />

          <RatingTypeSelector
            onValueChange={handleSelectRatingType}
            defaultValue={ratingCriteria}
          />

          <RateMovie
            criteriaType={ratingCriteria}
            ratingCriteria={
              temporaryMovie?.rating_criteria ||
              parsedData.rating_criteria || {
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
              }
            }
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
