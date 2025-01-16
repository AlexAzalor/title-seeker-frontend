"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeGenreScheme } from "@/types/general";
import { GenreScheme } from "@/types/zod-scheme";
import { useRouter } from "next/navigation";
import { addNewActionTime } from "@/app/actions";
import { toast } from "sonner";
import { BodyAPICreateGenre } from "@/orval_api/model";
import { formatKey } from "@/lib/utils";
import { FormWrapper } from "./ui/form-wrapper";
import { MovieFormField } from "./movie-form-field";
import { TextareaFormField } from "./textarea-form-field";

type Props = {
  appendActionTime: any;
  actionTimesRef?: any;
};

export const AddNewActionTime = ({ appendActionTime }: Props) => {
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

    const response = await addNewActionTime(dataToSend);

    if (response.status === 201) {
      toast.success(response?.message);
      appendActionTime(response.newGenre);
      // clear form
    }

    if (response.status === 400) {
      toast.error(response?.message);
    }
    router.refresh();
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)} isSubmitting={isSubmitting}>
      <MovieFormField
        type="text"
        label="Key"
        name="key"
        register={register}
        error={errors.key}
        value={formatKey(watchFields)}
      />

      <MovieFormField
        type="text"
        label="name_uk"
        name="name_uk"
        register={register}
        error={errors.name_uk}
      />

      <MovieFormField
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
