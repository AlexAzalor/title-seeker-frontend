"use client";

import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { VisualProfileSchema, VisualProfileType } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  TitleVisualProfileOut,
  VisualProfileData,
  VisualProfileIn,
} from "@/orval_api/model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { SliderFormField } from "@/components/my-custom-ui/form-ui-parts/slider-form-field";
import { FormWrapper } from "@/components/my-custom-ui/form-ui-parts/form-wrapper";
import { updateVisualRating } from "@/app/services/user-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  movieKey: string;
  visualProfileData: TitleVisualProfileOut;
  categories: VisualProfileData[];
};

export const VisualProfileEditForm = ({
  movieKey,
  visualProfileData,
  categories,
}: Props) => {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    getValues,
  } = useForm({
    resolver: zodResolver(VisualProfileSchema),
    defaultValues: {
      category_key: visualProfileData.key,
      category_criteria: visualProfileData.criteria,
    },
  });

  const {
    fields: criteriaFields,
    remove: removeCriterion,
    move,
    replace,
  } = useFieldArray({
    control,
    name: "category_criteria",
  });

  const onSubmit = async (data: VisualProfileType) => {
    if (data.category_criteria.length === 0 || !isDirty) {
      return;
    }

    const len = data.category_criteria.length;
    if (len < 6 || len > 6) {
      toast.error("There must be exactly 6 criteria!");
      return;
    }

    const dataToSend: VisualProfileIn = {
      category_key: data.category_key,
      criteria: data.category_criteria,
      movie_key: movieKey,
    };

    const res = await updateVisualRating(dataToSend);

    if (res === 200) {
      toast.success("Visual profile updated successfully");
      router.refresh();
    } else {
      toast.error("Failed to update visual profile");
      return;
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < criteriaFields.length - 1) {
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
    <FormWrapper onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
      <div className="relative flex w-full justify-center">
        <Controller
          control={control}
          name="category_key"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div className="mb-2 grid w-72 gap-2">
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
                      key={item.key}
                      value={item.key}
                      title={item.description}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {error && <div className="text-red-500">{error.message}</div>}
            </div>
          )}
        />

        <Link href="/user/visual-profile">
          <Button
            type="button"
            className="absolute top-0 right-0"
            variant="link"
          >
            Add new?
          </Button>
        </Link>
      </div>

      <div className="mb-5 flex w-full flex-col items-center gap-6">
        {criteriaFields.map((field, index) => (
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
              min={1}
              step={1}
              max={5}
              name={`category_criteria.${index}.rating`}
              register={register}
              defaultValue={getValues}
              error={
                errors.category_criteria?.[index]?.rating &&
                errors.category_criteria[index].rating
              }
              removItem={() => removeCriterion(index)}
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
    </FormWrapper>
  );
};
