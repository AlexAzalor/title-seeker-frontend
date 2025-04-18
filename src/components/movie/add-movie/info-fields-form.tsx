import { use } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useForm } from "react-hook-form";
import { MovieFormContext } from "./utils";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MovieInfoScheme } from "@/types/zod-scheme";
import type { MovieFormData } from "@/orval_api/model";
import { FormField } from "../ui/form-field";
import { FormButtons } from "../ui/form-buttons";
import { TextareaFormField } from "../ui/textarea-form-field";
import { cleanNumberValue, formatDate } from "@/lib/utils";

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

export type MovieInfoSchemeType = z.infer<typeof MovieInfoScheme>;

export const InfoFieldsForm = () => {
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
    // getFieldState,
    // getFieldState("budget").isDirty
  } = useForm<MovieInfoSchemeType>({
    resolver: zodResolver(MovieInfoScheme),
    defaultValues: {
      description_en: parsedData.description_en || "",
      description_uk: parsedData.description_uk || "",
      release_date: parsedData.release_date || undefined,
      duration: parsedData.duration || undefined,
      budget: parsedData.budget || 0,
      domestic_gross: parsedData.domestic_gross || 0,
      worldwide_gross: parsedData.worldwide_gross || 0,
      location_en: parsedData.location_en || "",
      location_uk: parsedData.location_uk || "",
    },
  });

  const [budget, domesticGross, worldwide_gross] = watch([
    "budget",
    "domestic_gross",
    "worldwide_gross",
  ]);

  const onSubmit = (data: MovieInfoSchemeType) => {
    const dataToSend: MovieInfoFieldNames = {
      ...data,
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
          label="Description EN"
          name="description_en"
          register={register}
          error={errors.description_en}
        />

        <TextareaFormField
          label="Description UK"
          name="description_uk"
          register={register}
          error={errors.description_uk}
        />

        <div>
          <FormField
            type="date"
            label="Release date"
            name="release_date"
            register={register}
            error={errors.release_date}
            labelWidth={64}
          />
          {parsedData.release_date && (
            <div className="text-[#6F6C90]">
              {formatDate(parsedData.release_date) || ""}
            </div>
          )}
        </div>

        <div className="grid grid-flow-row grid-cols-2 items-center gap-8">
          <FormField
            type="text"
            label="Location EN"
            name="location_en"
            register={register}
            error={errors.location_en}
            labelWidth={64}
          />

          <FormField
            type="text"
            label="Location UK"
            name="location_uk"
            register={register}
            error={errors.location_uk}
            labelWidth={64}
          />
        </div>

        <div className="grid grid-cols-2 items-center gap-10">
          {/* show formated value of this inputs */}
          <FormField
            type="text"
            label="Duration"
            name="duration"
            register={register}
            error={errors.duration}
            labelWidth={64}
          />

          <FormField
            type="text"
            label="Budget"
            name="budget"
            register={register}
            error={errors.budget}
            value={cleanNumberValue(budget)}
            labelWidth={64}
          />

          <FormField
            type="text"
            label="Domestic gross"
            name="domestic_gross"
            register={register}
            error={errors.domestic_gross}
            value={cleanNumberValue(domesticGross)}
          />

          <FormField
            type="text"
            label="Worldwide gross"
            name="worldwide_gross"
            register={register}
            error={errors.worldwide_gross}
            value={cleanNumberValue(worldwide_gross)}
          />
        </div>
        <FormButtons handlePrev={handlePrev} />
      </form>
    </div>
  );
};
