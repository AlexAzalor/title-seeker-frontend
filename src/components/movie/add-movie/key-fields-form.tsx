import { use, useRef } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { MovieSchema, type MovieSchemaType } from "@/types/movie-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { MovieFormContext } from "@/components/movie/add-movie/utils";
import { toast } from "sonner";
import { formatKey } from "@/lib/utils";

import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { FormButtons } from "@/components/my-custom-ui/form-ui-parts/form-buttons";
import { Spinner } from "@/components/my-custom-ui/spinner";
import { INITIAL_RATE } from "@/components/movie/rating/utils";
import { RateMovie } from "@/components/movie/rating/rate-movie";
import { useLocalStorage } from "@/hooks/use-local-storage";

import {
  type MovieFormData,
  type MoviePreCreateDataQuickMovie,
  RatingCriterion,
  type BaseRatingCriteria,
} from "@/orval_api/model";

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
  ratingData: BaseRatingCriteria;
};

type Props = {
  quickMovie?: MoviePreCreateDataQuickMovie;
};

export const KeyFieldsForm = ({ quickMovie }: Props) => {
  const t = useTranslations("Form.stepper.titleRate");

  const { setMovieFormData, handleNext, clearForm } = use(MovieFormContext);

  const { data: parsedData } = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const ratingData =
    quickMovie?.rating_criteria || parsedData.rating_criteria || INITIAL_RATE;

  const ratingRef = useRef<RatingDataOut>({
    ratingData,
    ratingCriterionType:
      quickMovie?.rating_criterion_type ||
      parsedData.rating_criterion_type ||
      RatingCriterion.basic,
    rating: quickMovie?.rating || parsedData.rating || 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<MovieSchemaType>({
    resolver: zodResolver(MovieSchema),
    defaultValues: {
      key: quickMovie?.key || parsedData.key || "",
      title_en: quickMovie?.title_en || parsedData.title_en || "",
      title_uk: parsedData.title_uk || "",
    },
  });
  const watchFields = watch(["title_en"]);

  const onSubmit = async (data: MovieSchemaType) => {
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
            label={t("titleEn")}
            name="title_en"
            register={register}
            error={errors.title_en}
          />

          <FormField
            type="text"
            label={t("key")}
            name="key"
            register={register}
            error={errors.key}
            value={formatKey(watchFields)}
          />

          <FormField
            type="text"
            label={t("titleUk")}
            name="title_uk"
            register={register}
            error={errors.title_uk}
          />

          <FormField
            type="file"
            label={t("poster")}
            name="file"
            register={register}
            error={errors.file}
          />
        </div>

        <RateMovie
          ratingRef={ratingRef}
          quickMovie={quickMovie}
          parsedData={parsedData}
        />

        {!isSubmitting ? (
          <FormButtons handlePrev={clearForm} isFirstStep />
        ) : (
          <Spinner />
        )}
      </form>
    </div>
  );
};
