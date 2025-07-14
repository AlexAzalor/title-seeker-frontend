import { use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MovieFormContext } from "@/components/movie/add-movie/utils";

import type { MovieFormData, VisualProfileData } from "@/orval_api/model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormButtons } from "@/components/my-custom-ui/form-ui-parts/form-buttons";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { SliderFormField } from "@/components/my-custom-ui/form-ui-parts/slider-form-field";

import {
  VisualProfileSchema,
  type VisualProfileType,
} from "@/types/visual-profile-schema";

type Props = {
  categories: VisualProfileData[];
};

export type MovieInfoFieldNames = Pick<
  MovieFormData,
  "category_key" | "category_criteria"
>;

export const VisualProfileMovieForm = ({ categories }: Props) => {
  const t = useTranslations("Form.stepper.visualProfile");
  const tVisualProfile = useTranslations("Rating");

  const { setMovieFormData, handleNext, handlePrev } = use(MovieFormContext);

  const { data: parsedData } = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(VisualProfileSchema),
    defaultValues: {
      category_key: parsedData.category_key || "",
      category_criteria: parsedData.category_criteria || [],
    },
  });

  const {
    fields: criterionFields,
    move,
    replace,
  } = useFieldArray({
    control,
    name: "category_criteria",
  });

  const onSubmit = (data: VisualProfileType) => {
    const len = data.category_criteria.length;

    if (len < 6 || len > 6) {
      toast.error("There must be exactly 6 criteria!");
      return;
    }

    const dataToSend: MovieInfoFieldNames = {
      category_criteria: data.category_criteria,
      category_key: data.category_key,
    };

    setMovieFormData((prev) => ({
      ...prev,
      form_data: {
        ...prev.form_data,
        ...dataToSend,
      },
    }));

    try {
      localStorage.setItem(
        "new-movie-data",
        JSON.stringify({
          ...parsedData,
          ...dataToSend,
        }),
      );

      handleNext();
    } catch (error) {
      console.error("Error saving data to local storage", error);
      toast.error("Error saving data to local storage");
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < criterionFields.length - 1) {
      move(index, index + 1);
    }
  };

  const selectCategory = (key: string) => {
    const category = categories.find((e) => e.key === key);

    if (category) {
      replace(category.criteria);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-3 font-bold">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="mb-5 flex w-full flex-col items-center gap-6">
            <h1 className="text-main-ui-purple">{t("name")}</h1>

            <div className="w-200">
              <p className="mb-1 font-semibold">
                {tVisualProfile("visualProfile.description")}
              </p>
              <p className="font-semibold">
                {tVisualProfile("visualProfile.shape")}
              </p>
            </div>

            <div className="relative flex w-full justify-center">
              <Controller
                control={control}
                name="category_key"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <div className="mb-4 grid w-72 gap-2">
                    <Select
                      onValueChange={(key) => {
                        selectCategory(key);
                        onChange(key);
                      }}
                      defaultValue={value}
                    >
                      <SelectTrigger id="rating-criteria">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((item) => (
                          <SelectItem
                            title={item.description}
                            key={item.key}
                            value={item.key}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {error && (
                      <div className="text-red-500">{error.message}</div>
                    )}
                  </div>
                )}
              />
              <Link href="/account/admin/visual-profile" target="_blank">
                <Button type="button" className="top-0 right-0" variant="link">
                  {t("addNew")}
                </Button>
              </Link>
            </div>

            <div className="mb-5 flex w-full flex-col items-center gap-6">
              {criterionFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <FormField
                    type="text"
                    title={field.name + " - " + field.description}
                    name={`category_criteria.${index}.name`}
                    register={register}
                    error={undefined}
                    disabled
                  />

                  <SliderFormField
                    name={`category_criteria.${index}.rating`}
                    step={1}
                    min={1}
                    max={5}
                    register={register}
                    defaultValue={getValues}
                    error={
                      errors.category_criteria?.[index]?.rating &&
                      errors.category_criteria[index].rating
                    }
                    moveUp={() => handleMoveUp(index)}
                    moveDown={() => handleMoveDown(index)}
                  />
                </motion.div>
              ))}

              {errors.category_criteria && errors.category_criteria.message && (
                <span className="text-sm text-red-500">
                  {errors.category_criteria.message}
                </span>
              )}
            </div>
          </div>

          <FormButtons handlePrev={handlePrev} />
        </form>
      </div>
    </>
  );
};
