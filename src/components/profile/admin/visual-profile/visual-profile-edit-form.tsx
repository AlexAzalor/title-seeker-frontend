"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatKey } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { TextareaFormField } from "@/components/my-custom-ui/form-ui-parts/textarea-form-field";

import {
  editVisualProfileCategory,
  editVisualProfileCriterion,
} from "@/app/(app)/services/admin/visual-profile-apis";
import {
  type VisualProfileFieldType,
  VisualProfileUpdateSchema,
} from "@/types/visual-profile-schema";
import type { VisualProfileFieldWithUUID } from "@/orval_api/model";

type Props = {
  criterion: VisualProfileFieldWithUUID;
  type: "category" | "criterion";
};

export const VisualProfileEditForm = ({ criterion, type }: Props) => {
  const router = useRouter();
  const t = useTranslations("Form.itemFields");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitSuccessful },
    watch,
    reset,
  } = useForm<VisualProfileFieldType>({
    resolver: zodResolver(VisualProfileUpdateSchema),
    defaultValues: {
      ...criterion,
    },
  });

  const watchFields = watch(["name_en"]);

  // Need to correctly handle dirty state
  useEffect(() => {
    reset(
      {
        ...criterion,
        key: formatKey(watchFields),
      },
      { keepValues: true, keepDirty: false },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmit = async (formData: VisualProfileFieldType) => {
    if (!isDirty) {
      return;
    }

    if (type === "category" && formData.uuid) {
      const response = await editVisualProfileCategory(formData);

      if (response.status === 200) {
        toast.success(response?.message);
        router.refresh();
        return;
      }

      toast.error(`Error status: ${response.status} - ${response.message}`);
    }

    if (type === "criterion") {
      const response = await editVisualProfileCriterion(formData);

      if (response.status === 200) {
        toast.success(response?.message);
        router.refresh();
        return;
      }

      toast.error(`Error status: ${response.status} - ${response.message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-between gap-6 font-bold lg:flex-row lg:gap-3"
    >
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
        label={t("nameEn")}
        name="name_en"
        register={register}
        error={errors.name_en}
        disabled={criterion.key === "impact"}
      />

      <FormField
        type="text"
        label={t("nameUk")}
        name="name_uk"
        register={register}
        error={errors.name_uk}
        disabled={criterion.key === "impact"}
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

      <Button
        disabled={!isDirty}
        type="submit"
        className="bg-main-ui-purple hover:bg-dark-blue dark:bg-main-ui-purple dark:text-white-dark dark:hover:bg-main-ui-purple/80 mt-7 h-12 w-41 cursor-pointer rounded-2xl border-0 text-center text-lg transition-all duration-200"
      >
        Save
      </Button>
    </form>
  );
};
