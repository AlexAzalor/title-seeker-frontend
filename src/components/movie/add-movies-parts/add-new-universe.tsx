"use client";

import { useRouter } from "next/navigation";
import { useForm, UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";

import { createSharedUniverse } from "@/app/services/admin-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeGenreScheme } from "@/types/general";
import { formatKey } from "@/lib/utils";
import { GenreScheme, SharedUniverseType } from "@/types/zod-scheme";

import { GenreFormIn } from "@/orval_api/model";
import { FormWrapper } from "../ui/form-wrapper";
import { FormField } from "../ui/form-field";
import { TextareaFormField } from "../ui/textarea-form-field";

type Props = {
  setValue: UseFormSetValue<SharedUniverseType>;
};

export const AddNewUniverse = ({ setValue }: Props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TypeGenreScheme>({
    resolver: zodResolver(GenreScheme),
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
        label="Key"
        name="key"
        register={register}
        error={errors.key}
        value={formatKey(watchFields)}
      />

      <FormField
        type="text"
        label="Name En"
        name="name_en"
        register={register}
        error={errors.name_en}
      />

      <FormField
        type="text"
        label="Name Uk"
        name="name_uk"
        register={register}
        error={errors.name_uk}
      />

      <TextareaFormField
        label="Description En"
        name="description_en"
        register={register}
        error={errors.description_en}
      />

      <TextareaFormField
        label="Description Uk"
        name="description_uk"
        register={register}
        error={errors.description_uk}
      />
    </FormWrapper>
  );
};
