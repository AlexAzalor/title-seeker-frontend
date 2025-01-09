import { HTMLInputTypeAttribute, use } from "react";
import { MovieFormContext } from "./movie-form-wizard";
import { FieldError, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MovieInfoScheme } from "@/types/zod-scheme";
import { Button } from "@/components/ui/button";
import { MovieFormField } from "../movie-form-field";

import { MovieFormData } from "@/orval_api/model";
import { z } from "zod";

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
  const { setMovieFormData, handleNext } = use(MovieFormContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MovieInfoSchemeType>({
    resolver: zodResolver(MovieInfoScheme),
  });

  const onSubmit = async (data: MovieInfoSchemeType) => {
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

    handleNext();
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
            label="Description EN"
            name="description_en"
            register={register}
            error={errors.description_en}
            labelWidth={64}
          />

          <MovieFormField
            type="text"
            label="Description UK"
            name="description_uk"
            register={register}
            error={errors.description_uk}
            labelWidth={64}
          />

          <MovieFormField
            type="date"
            label="Release date"
            name="release_date"
            register={register}
            error={errors.release_date}
            labelWidth={64}
          />
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
            labelWidth={64}
          />
          <MovieFormField
            type="text"
            label="Domestic gross"
            name="domestic_gross"
            register={register}
            error={errors.domestic_gross}
            labelWidth={64}
          />
          <MovieFormField
            type="text"
            label="Worldwide gross"
            name="worldwide_gross"
            register={register}
            error={errors.worldwide_gross}
            labelWidth={64}
          />
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
