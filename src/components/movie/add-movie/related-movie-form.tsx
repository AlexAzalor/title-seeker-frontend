import { use } from "react";
import { useForm } from "react-hook-form";
import { RelatedMovieField, RelatedMovieType } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { MovieFormContext } from "./movie-form-wizard";
import { FormField } from "../ui/form-field";

import {
  MovieFormData,
  RatingCriterion,
  RelatedMovie,
  UserRatingCriteria,
} from "@/orval_api/model";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FormButtons } from "../ui/form-buttons";
import { TypeSelector } from "./type-selector";

export type MovieKeyFields = Pick<
  MovieFormData,
  "base_movie_key" | "collection_order" | "relation_type"
>;

export type RatingDataOut = {
  rating: number;
  ratingCriterionType: RatingCriterion;
  ratingData: UserRatingCriteria;
};

export const RelatedMovieForm = () => {
  const { setMovieFormData, handleNext, clearForm, setSkipSteps } =
    use(MovieFormContext);

  const { data: parsedData } = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    unregister,
  } = useForm<RelatedMovieType>({
    resolver: zodResolver(RelatedMovieField),
    defaultValues: {
      base_movie_key: parsedData.base_movie_key || "",
      collection_order: parsedData.collection_order || undefined,
      relation_type: parsedData.relation_type || RelatedMovie.base,
    },
  });

  const handleFormData = (dataToSend: MovieKeyFields) => {
    setMovieFormData((prev) => ({
      ...prev,
      form_data: {
        ...prev.form_data,
        ...dataToSend,
      },
    }));

    localStorage.setItem(
      "new-movie-data",
      JSON.stringify({
        ...parsedData,
        ...dataToSend,
      }),
    );

    handleNext();
  };

  const onSubmit = async (data: RelatedMovieType) => {
    const dataToSend: MovieKeyFields = {
      ...data,
      relation_type: data.relation_type as RelatedMovie,
    };

    if (setSkipSteps) {
      setSkipSteps((prev) => prev.filter((step) => step !== 2));
    }

    handleFormData(dataToSend);
  };

  const skipStep = () => {
    unregister(["base_movie_key", "collection_order", "relation_type"]);

    const dataToSend: MovieKeyFields = {
      base_movie_key: undefined,
      collection_order: undefined,
      relation_type: undefined,
    };

    if (setSkipSteps) {
      setSkipSteps((prev) => [...prev, 2]);
    }

    handleFormData(dataToSend);
  };

  return (
    <div className="text-textOrange flex items-center justify-center gap-3 font-bold">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-2"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            type="text"
            label="Base movie key"
            name="base_movie_key"
            register={register}
            error={errors.base_movie_key}
            labelWidth={64}
          />

          <FormField
            type="text"
            label="Collection order"
            name="collection_order"
            register={register}
            error={errors.collection_order}
            labelWidth={52}
          />

          <TypeSelector
            name="relation_type"
            control={control}
            defaultValue={parsedData.relation_type as RelatedMovie}
            error={errors.relation_type}
          />
        </div>

        {!isSubmitting ? (
          <FormButtons handlePrev={clearForm} skipStep={skipStep} />
        ) : (
          <span className="loader"></span>
        )}
      </form>
    </div>
  );
};
