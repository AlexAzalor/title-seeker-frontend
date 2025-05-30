"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VisualProfileCreate,
  VisualProfileCreateType,
  VisualProfileFieldType,
} from "@/types/zod-scheme";

import { formatKey } from "@/lib/utils";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { TextareaFormField } from "@/components/my-custom-ui/form-ui-parts/textarea-form-field";
import { createVisualProfileCategory } from "@/app/services/admin/visual-profile-apis";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VisualProfileFormIn } from "@/orval_api/model";

type Props = {
  category: VisualProfileFormIn;
  oldCriterionKey?: string;
  onCreateCategory?: (formData: VisualProfileFieldType) => Promise<void>;
  newCategoryKey?: string;
};

export const VisualProfileCreateForm = ({ category }: Props) => {
  const router = useRouter();
  const t = useTranslations("Form.itemFields");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm<Omit<VisualProfileCreateType, "uuid">>({
    resolver: zodResolver(VisualProfileCreate),
    defaultValues: {
      ...category,
    },
  });

  const watchFields = watch([
    "name_en",
    `criteria.${0}.name_en`,
    `criteria.${1}.name_en`,
    `criteria.${2}.name_en`,
    `criteria.${3}.name_en`,
    `criteria.${4}.name_en`,
  ]);

  const { fields: criteriaFields } = useFieldArray({
    control,
    name: "criteria",
  });

  const onSubmit = async (formData: VisualProfileFormIn) => {
    if (!isDirty) {
      return;
    }

    const response = await createVisualProfileCategory(formData);

    if (response.status === 201) {
      toast.success(response?.message);
      reset();
      router.refresh();
      return;
    }

    toast.error(`Error status: ${response.status}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="font-bold">
      <h3>Category</h3>

      <div className="flex items-center justify-between gap-3 font-bold">
        <FormField
          type="text"
          label={t("key")}
          name="key"
          register={register}
          error={errors.key}
          value={formatKey([watchFields[0]])}
        />

        <FormField
          type="text"
          label={t("nameEn")}
          name="name_en"
          register={register}
          error={errors.name_en}
        />

        <FormField
          type="text"
          label={t("nameUk")}
          name="name_uk"
          register={register}
          error={errors.name_uk}
        />

        <TextareaFormField
          label={t("descriptionEn")}
          name="description_en"
          register={register}
          error={errors.description_en}
          autoResize={false}
        />

        <TextareaFormField
          label={t("descriptionUk")}
          name="description_uk"
          register={register}
          error={errors.description_uk}
          autoResize={false}
        />
      </div>

      <Separator className="my-4" />
      <h3>Criteria</h3>
      <div>
        {criteriaFields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center justify-between gap-3 font-bold"
          >
            <FormField
              type="text"
              label={t("key")}
              // name="key"
              name={`criteria.${index}.key`}
              register={register}
              error={errors.key}
              value={formatKey([watchFields[index + 1]])}
              disabled
            />

            <FormField
              type="text"
              label={t("nameEn")}
              name={`criteria.${index}.name_en`}
              register={register}
              error={errors.name_en}
            />

            <FormField
              type="text"
              label={t("nameUk")}
              name={`criteria.${index}.name_uk`}
              register={register}
              error={errors.name_uk}
            />

            <TextareaFormField
              label={t("descriptionEn")}
              name={`criteria.${index}.description_en`}
              register={register}
              error={errors.description_en}
              autoResize={false}
            />

            <TextareaFormField
              label={t("descriptionUk")}
              name={`criteria.${index}.description_uk`}
              register={register}
              error={errors.description_uk}
              autoResize={false}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button
          disabled={!isDirty}
          onClick={() => reset()}
          type="button"
          variant="link"
          className=""
        >
          Reset form
        </Button>

        <Button
          disabled={!isDirty}
          type="submit"
          className="bg-main-ui-purple hover:bg-dark-blue dark:bg-main-ui-purple dark:text-white-dark dark:hover:bg-main-ui-purple/80 h-12 w-[164px] cursor-pointer rounded-2xl border-0 text-center text-lg transition-all duration-200"
        >
          Save
        </Button>
      </div>
    </form>
  );
};
