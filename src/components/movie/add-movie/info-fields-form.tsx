import { use } from "react";
import { useTranslations } from "next-intl";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MovieFormContext } from "@/components/movie/add-movie/utils";
import { cleanNumberValue, formatDate } from "@/lib/utils";

import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { FormButtons } from "@/components/my-custom-ui/form-ui-parts/form-buttons";
import { TextareaFormField } from "@/components/my-custom-ui/form-ui-parts/textarea-form-field";

import { MovieInfoSchema } from "@/types/movie-schema";
import type { MovieFormData } from "@/orval_api/model";
import { MIN_MOVIE_DESCR_LENGTH } from "@/lib/constants";

export type MovieInfoFieldNames = Pick<
  MovieFormData,
  | "description_en"
  | "description_uk"
  | "duration"
  | "budget"
  | "domestic_gross"
  | "worldwide_gross"
  | "location_en"
  | "location_uk"
  | "release_date"
>;

export type MovieInfoSchemeType = z.infer<typeof MovieInfoSchema>;

export const InfoFieldsForm = () => {
  const t = useTranslations("Form.stepper.info");

  const { setMovieFormData, handleNext, handlePrev } = use(MovieFormContext);

  const { data: parsedData } = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MovieInfoSchemeType>({
    resolver: zodResolver(MovieInfoSchema),
    defaultValues: {
      description_en: parsedData.description_en || "",
      description_uk: parsedData.description_uk || "",
      release_date: parsedData.release_date || undefined,
      duration: parsedData.duration || undefined,
      budget: parsedData.budget || 0,
      domestic_gross: parsedData.domestic_gross || undefined,
      worldwide_gross: parsedData.worldwide_gross || undefined,
      location_en: parsedData.location_en || "",
      location_uk: parsedData.location_uk || "",
    },
  });

  const [
    budget,
    domesticGross,
    worldwide_gross,
    description_en,
    description_uk,
  ] = watch([
    "budget",
    "domestic_gross",
    "worldwide_gross",
    "description_en",
    "description_uk",
  ]);

  const onSubmit = (data: MovieInfoSchemeType) => {
    const dataToSend: MovieInfoFieldNames = {
      ...data,
      domestic_gross: data.domestic_gross ? Number(data.domestic_gross) : 0,
      worldwide_gross: data.worldwide_gross ? Number(data.worldwide_gross) : 0,
      budget: data.budget ? Number(data.budget) : 0,
    };

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

  return (
    <div className="text-textOrange flex items-center justify-center gap-3 font-bold">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-8"
      >
        <TextareaFormField
          label={t("descriptionEn")}
          name="description_en"
          register={register}
          error={errors.description_en}
          currentLength={description_en.length}
        />

        <TextareaFormField
          label={t("descriptionUk")}
          name="description_uk"
          register={register}
          error={errors.description_uk}
          currentLength={description_uk.length}
        />

        <div>
          <FormField
            type="date"
            label={t("date")}
            name="release_date"
            register={register}
            error={errors.release_date}
          />
          {parsedData.release_date && (
            <div className="text-gray-purple">
              {formatDate(parsedData.release_date) || ""}
            </div>
          )}
        </div>

        <div className="grid grid-flow-row grid-cols-2 items-center gap-8">
          <FormField
            type="text"
            label={t("locationEn")}
            name="location_en"
            register={register}
            error={errors.location_en}
          />

          <FormField
            type="text"
            label={t("locationUk")}
            name="location_uk"
            register={register}
            error={errors.location_uk}
          />
        </div>

        <div className="grid grid-cols-2 items-center gap-10">
          <FormField
            type="text"
            label={t("duration")}
            name="duration"
            register={register}
            error={errors.duration}
          />

          <FormField
            type="text"
            label={t("budget")}
            name="budget"
            register={register}
            error={errors.budget}
            value={budget ? cleanNumberValue(budget).toString() : undefined}
          />

          <FormField
            type="text"
            label={t("domesticGross")}
            name="domestic_gross"
            register={register}
            error={errors.domestic_gross}
            value={
              domesticGross
                ? cleanNumberValue(domesticGross).toString()
                : undefined
            }
            minLength={MIN_MOVIE_DESCR_LENGTH}
          />

          <FormField
            type="text"
            label={t("worldwideGross")}
            name="worldwide_gross"
            register={register}
            error={errors.worldwide_gross}
            value={
              worldwide_gross
                ? cleanNumberValue(worldwide_gross).toString()
                : undefined
            }
            minLength={MIN_MOVIE_DESCR_LENGTH}
          />
        </div>
        <FormButtons handlePrev={handlePrev} />
      </form>
    </div>
  );
};
