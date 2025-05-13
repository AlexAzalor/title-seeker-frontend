import { use } from "react";
import { Controller, useForm } from "react-hook-form";
import { RelatedMovieField, RelatedMovieType } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { MovieFormContext } from "./utils";

import {
  MovieFormData,
  MovieOutShort,
  RatingCriterion,
  RelatedMovie,
  UserRatingCriteria,
} from "@/orval_api/model";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { FormButtons } from "@/components/my-custom-ui/form-ui-parts/form-buttons";
import { TypeSelector } from "./type-selector";
import { ResponsiveWrapper } from "../../my-custom-ui/responsive-wrapper";
import { ItemsSelector } from "../../my-custom-ui/items-list-selector";
import { Spinner } from "@/components/my-custom-ui/spinner";

export type MovieKeyFields = Pick<
  MovieFormData,
  "base_movie_key" | "collection_order" | "relation_type"
>;

export type RatingDataOut = {
  rating: number;
  ratingCriterionType: RatingCriterion;
  ratingData: UserRatingCriteria;
};

type Props = {
  baseMovies: MovieOutShort[];
};

export const RelatedMovieForm = ({ baseMovies }: Props) => {
  const { setMovieFormData, handleNext, handlePrev, setSkipSteps } =
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
      setSkipSteps((prev) => prev.filter((step) => step !== 3));
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
      setSkipSteps((prev) => [...prev, 3]);
    }

    handleFormData(dataToSend);
  };

  return (
    <div className="text-textOrange flex items-center justify-center gap-3 font-bold">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-2"
      >
        <div className="grid grid-cols-2 items-center gap-5">
          <Controller
            control={control}
            name="base_movie_key"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div className="relative">
                <ResponsiveWrapper
                  title={
                    baseMovies
                      .find((e) => e.key === value)
                      ?.name.slice(0, 20) || "Base movie"
                  }
                >
                  <ItemsSelector
                    items={baseMovies}
                    onOpenModal={() => {}}
                    onSelect={(value, key) => onChange(key)}
                    checkIconStyle={[value]}
                    emptyText="If no movie in the list - Skip"
                  />
                </ResponsiveWrapper>

                {error && (
                  <div className="absolute text-red-500">{error.message}</div>
                )}
              </div>
            )}
          />

          <FormField
            type="text"
            label="Collection order"
            name="collection_order"
            register={register}
            error={errors.collection_order}
          />

          <TypeSelector
            name="relation_type"
            control={control}
            defaultValue={parsedData.relation_type as RelatedMovie}
            error={errors.relation_type}
          />
        </div>

        {!isSubmitting ? (
          <FormButtons handlePrev={handlePrev} skipStep={skipStep} />
        ) : (
          <Spinner />
        )}
      </form>
    </div>
  );
};
