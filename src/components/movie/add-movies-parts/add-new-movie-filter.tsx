"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UseFieldArrayAppend, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeGenreScheme } from "@/types/general";

import type { MovieFilterType } from "../add-movie/movie-filter-form";
import { GenreScheme, MovieFilterListType } from "@/types/zod-scheme";
import { MovieFilterFormIn, MovieFilterFormOut } from "@/orval_api/model";
import { formatKey } from "@/lib/utils";
import { FormWrapper } from "../ui/form-wrapper";
import { FormField } from "../ui/form-field";
import { TextareaFormField } from "../ui/textarea-form-field";

type Props<T extends MovieFilterType> = {
  appendItem: UseFieldArrayAppend<MovieFilterListType, T>;
  fetchApi: (formData: MovieFilterFormIn) => Promise<{
    status?: number;
    message?: string;
    newItem?: MovieFilterFormOut;
  }>;
};

export const AddNewMovieFilter = ({
  appendItem,
  fetchApi,
}: Props<MovieFilterType>) => {
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

  const onSubmit = async (formData: TypeGenreScheme) => {
    const response = await fetchApi(formData);

    if (response.status === 201 && response.newItem) {
      appendItem({
        ...response.newItem,
        percentage_match: 0,
      });

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
