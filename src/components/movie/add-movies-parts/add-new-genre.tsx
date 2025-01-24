"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeGenreScheme } from "@/types/general";
import { GenreScheme } from "@/types/zod-scheme";
import { useRouter } from "next/navigation";
import { addNewGenre } from "@/app/actions";
import { toast } from "sonner";
import { BodyAPICreateGenre } from "@/orval_api/model";
import { formatKey } from "@/lib/utils";
import { FormWrapper } from "../ui/form-wrapper";
import { FormField } from "../ui/form-field";
import { TextareaFormField } from "../ui/textarea-form-field";

type Props = {
  appendGenre: any;
};

export const AddNewGenre = ({ appendGenre }: Props) => {
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
  const router = useRouter();

  const watchFields = watch(["name_en"]);

  const onSubmit = async (data: TypeGenreScheme) => {
    const dataToSend: BodyAPICreateGenre = {
      ...data,
    };

    const response = await addNewGenre(dataToSend);

    if (response.status === 201) {
      toast.success(response?.message);
      appendGenre(response.newGenre);
      // clear form
    }

    if (response.status === 400) {
      toast.error(response?.message);
    }
    router.refresh();
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
        label="name_uk"
        name="name_uk"
        register={register}
        error={errors.name_uk}
      />

      <FormField
        type="text"
        label="name_en"
        name="name_en"
        register={register}
        error={errors.name_en}
      />

      <TextareaFormField
        label="description_uk"
        name="description_uk"
        register={register}
        error={errors.description_uk}
      />

      <TextareaFormField
        label="description_en"
        name="description_en"
        register={register}
        error={errors.description_en}
      />
    </FormWrapper>
  );
};
