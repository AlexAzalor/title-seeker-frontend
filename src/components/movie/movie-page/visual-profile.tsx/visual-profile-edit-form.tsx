"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";

import {
  EditTitleVisualProfile,
  EditTitleVisualProfileType,
} from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";

import { TitleVisualProfileIn, TitleVisualProfileOut } from "@/orval_api/model";

import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { SliderFormField } from "@/components/my-custom-ui/form-ui-parts/slider-form-field";
import { FormWrapper } from "@/components/my-custom-ui/form-ui-parts/form-wrapper";
import { updateVisualRating } from "@/app/services/user-api";

type Props = {
  movieKey: string;
  visualProfileData: TitleVisualProfileOut;
};

export const VisualProfileEditForm = ({
  movieKey,
  visualProfileData,
}: Props) => {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    getValues,
  } = useForm({
    resolver: zodResolver(EditTitleVisualProfile),
    defaultValues: {
      criteria: visualProfileData.criteria,
    },
  });

  const {
    fields: criteriaFields,
    remove: removeCriterion,
    move,
  } = useFieldArray({
    control,
    name: "criteria",
  });

  const onSubmit = async (data: EditTitleVisualProfileType) => {
    if (data.criteria.length === 0 || !isDirty) {
      return;
    }

    const dataToSend: TitleVisualProfileIn = {
      category_key: visualProfileData.key,
      criteria: data.criteria,
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

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
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
              name={`criteria.${index}.key`}
              register={register}
              error={undefined}
              disabled
            />

            <SliderFormField
              step={1}
              max={5}
              name={`criteria.${index}.rating`}
              register={register}
              defaultValue={getValues}
              error={
                errors.criteria?.[index]?.rating &&
                errors.criteria[index].rating
              }
              removItem={() => removeCriterion(index)}
              moveUp={() => handleMoveUp(index)}
              moveDown={() => handleMoveDown(index)}
            />
          </motion.div>
        ))}

        {errors.criteria && errors.criteria.message && (
          <span className="text-sm text-red-500">
            {errors.criteria.message}
          </span>
        )}
      </div>
    </FormWrapper>
  );
};
