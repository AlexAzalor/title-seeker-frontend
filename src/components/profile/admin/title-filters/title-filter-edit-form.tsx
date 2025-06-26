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

import { updateFilterItem, updateGenre } from "@/app/services/admin-api";
import {
  type VisualProfileFieldType,
  VisualProfileUpdateSchema,
} from "@/types/visual-profile-schema";
import { FilterEnum, type FilterFieldsWithUUID } from "@/orval_api/model";

type Props = {
  filterItem: FilterFieldsWithUUID;
  type: FilterEnum;
};

export const TitleFilterEditForm = ({ filterItem, type }: Props) => {
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
      ...filterItem,
    },
  });

  const watchFields = watch(["name_en"]);

  // Need to correctly handle dirty state
  useEffect(() => {
    reset(
      {
        ...filterItem,
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

    if (type === FilterEnum.genre || type === FilterEnum.subgenre) {
      const response = await updateGenre(formData, type);

      if (response.status === 204) {
        toast.success(response.message);
        router.refresh();
        return;
      }

      toast.error(`Error status: ${response.status}`);
      return;
    }

    const response = await updateFilterItem(formData, type);

    if (response.status === 204) {
      toast.success(response.message);
      router.refresh();
      return;
    }

    toast.error(`Error status: ${response.status}`);
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
      />

      <TextareaFormField
        label={t("descriptionUk")}
        name="description_uk"
        register={register}
        error={errors.description_uk}
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
