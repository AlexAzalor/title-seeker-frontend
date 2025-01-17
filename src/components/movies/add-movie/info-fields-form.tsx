import { HTMLInputTypeAttribute, use } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FieldError, useForm, UseFormRegister } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MovieInfoScheme } from "@/types/zod-scheme";
import type { MovieFormData } from "@/orval_api/model";
import { MovieFormContext } from "./movie-form-wizard";
import { MovieFormField } from "../movie-form-field";
import { FormButtons } from "../ui/form-buttons";
import { TextareaFormField } from "../textarea-form-field";
import { cleanNumberValue } from "@/lib/utils";

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

export type MovieFormFieldProps = {
  type: HTMLInputTypeAttribute;
  name: MovieInfoFieldNames;
  register: UseFormRegister<MovieInfoSchemeType>;
  error: FieldError | undefined;
  labelWidth?: number;
  label: string;
  value?: string;
};

export const InfoFieldsForm = () => {
  const { setMovieFormData, handleNext, handlePrev } = use(MovieFormContext);

  const parsedData = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
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
      budget: parsedData.budget || undefined,
      domestic_gross: parsedData.domestic_gross || undefined,
      worldwide_gross: parsedData.worldwide_gross || undefined,
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
        className="flex w-full flex-col items-center gap-2"
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
          <MovieFormField
            type="date"
            label="Release date"
            name="release_date"
            register={register}
            error={errors.release_date}
            labelWidth={64}
          />
          {parsedData && (
            <div className="text-[#6F6C90]">
              {parsedData.release_date || ""}
            </div>
          )}
        </div>

        <div className="grid grid-flow-row grid-cols-2 gap-4">
          <MovieFormField
            type="text"
            label="Location EN"
            name="location_en"
            register={register}
            error={errors.location_en}
            labelWidth={64}
          />

          <MovieFormField
            type="text"
            label="Location UK"
            name="location_uk"
            register={register}
            error={errors.location_uk}
            labelWidth={64}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* show formated value of this inputs */}
          <MovieFormField
            type="text"
            label="Duration"
            name="duration"
            register={register}
            error={errors.duration}
            labelWidth={64}
          />

          <MovieFormField
            type="text"
            label="Budget"
            name="budget"
            register={register}
            error={errors.budget}
            value={cleanNumberValue(budget)}
            labelWidth={64}
          />

          <MovieFormField
            type="text"
            label="Domestic gross"
            name="domestic_gross"
            register={register}
            error={errors.domestic_gross}
            value={cleanNumberValue(domesticGross)}
          />

          <MovieFormField
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
