import { use, useRef } from "react";
import { useForm } from "react-hook-form";
import { MovieScheme } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatKey } from "@/lib/utils";
import { MovieSchemeType } from "@/types/general";
import { MovieFormContext } from "./movie-form-wizard";
import { FormField } from "../ui/form-field";

import {
  MovieFormData,
  MoviePreCreateDataTemporaryMovie,
  RatingCriterion,
  UserRatingCriteria,
} from "@/orval_api/model";
import { INITIAL_RATE } from "@/components/movie/rating/utils";
import { RateMovie } from "../rating/rate-movie";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FormButtons } from "../ui/form-buttons";

type MovieKeyFields = Pick<
  MovieFormData,
  | "key"
  | "title_en"
  | "title_uk"
  | "rating"
  | "rating_criteria"
  | "rating_criterion_type"
>;

export type RatingDataOut = {
  rating: number;
  ratingCriterionType: RatingCriterion;
  ratingData: UserRatingCriteria;
};

type Props = {
  temporaryMovie?: MoviePreCreateDataTemporaryMovie;
};

export const KeyFieldsForm = ({ temporaryMovie }: Props) => {
  const { setMovieFormData, handleNext, clearForm } = use(MovieFormContext);

  const { data: parsedData } = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const ratingData =
    temporaryMovie?.rating_criteria ||
    parsedData.rating_criteria ||
    INITIAL_RATE;

  const ratingRef = useRef<RatingDataOut>({
    ratingData,
    ratingCriterionType:
      temporaryMovie?.rating_criterion_type || RatingCriterion.basic,
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
      rating_criterion_type: ratingRef.current.ratingCriterionType,
      rating_criteria: ratingRef.current.ratingData,
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

  return (
    <div className="text-textOrange flex items-center justify-center gap-3 font-bold">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-2"
      >
        <div className="grid grid-cols-2 gap-10">
          <FormField
            type="text"
            label="Title EN"
            name="title_en"
            register={register}
            error={errors.title_en}
            labelWidth={64}
          />

          <FormField
            type="text"
            label="Key"
            name="key"
            register={register}
            error={errors.key}
            labelWidth={52}
            value={formatKey(watchFields)}
          />

          <FormField
            type="text"
            label="Title UK"
            name="title_uk"
            register={register}
            error={errors.title_uk}
            labelWidth={64}
          />

          <FormField
            type="file"
            label="Title EN"
            name="file"
            register={register}
            error={errors.file}
            labelWidth={64}
          />
        </div>

        <RateMovie
          ratingRef={ratingRef}
          temporaryMovie={temporaryMovie}
          parsedData={parsedData}
        />

        {!isSubmitting ? (
          <FormButtons handlePrev={clearForm} isFirstStep />
        ) : (
          <span className="loader"></span>
        )}
      </form>
    </div>
  );
};
