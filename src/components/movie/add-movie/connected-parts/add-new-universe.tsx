"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm, type UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { formatKey } from "@/lib/utils";

import { FormWrapper } from "@/components/my-custom-ui/form-ui-parts/form-wrapper";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { TextareaFormField } from "@/components/my-custom-ui/form-ui-parts/textarea-form-field";

import { createSharedUniverse } from "@/app/(app)/services/admin-api";

import { EntityFormSchema, type EntityFormType } from "@/types/general";
import type { SharedUniverseType } from "@/types/movie-schema";
import type { GenreFormIn } from "@/orval_api/model";

type Props = {
  setValue: UseFormSetValue<SharedUniverseType>;
};

export const AddNewUniverse = ({ setValue }: Props) => {
  const router = useRouter();
  const t = useTranslations("Form.itemFields");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<EntityFormType>({
    resolver: zodResolver(EntityFormSchema),
    defaultValues: {
      key: "",
      name_en: "",
    },
  });

  const watchFields = watch(["name_en"]);

  const onSubmit = async (formData: GenreFormIn) => {
    const response = await createSharedUniverse(formData);

    if (response.status === 201 && response.newItem) {
      setValue("shared_universe_key", response.newItem!.key);

      toast.success(response?.message);
      router.refresh();
      return;
    }

    if (response.status === 400) {
      toast.error(response?.message);
      return;
    }

    toast.error(`Error status: ${response.status}`);
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
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
    </FormWrapper>
  );
};
