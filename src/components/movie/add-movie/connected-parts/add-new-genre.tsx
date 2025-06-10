"use client";

import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { TypeGenreScheme } from "@/types/general";
import { GenreScheme, GenreSchemeListType } from "@/types/zod-scheme";
import { GenreFormIn, GenreFormOut } from "@/orval_api/model";
import { formatKey } from "@/lib/utils";
import { FormWrapper } from "@/components/my-custom-ui/form-ui-parts/form-wrapper";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { TextareaFormField } from "@/components/my-custom-ui/form-ui-parts/textarea-form-field";
import { GenreType } from "../../add-movie/genre-fields-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props<T extends GenreType> = {
  type: GenreType;
  appendItem: UseFieldArrayAppend<GenreSchemeListType, T>;
  fetchApi: (formData: GenreFormIn) => Promise<{
    status?: number;
    message?: string;
    newItem?: GenreFormOut;
  }>;
  genresList?: FieldArrayWithId<GenreSchemeListType, "genres">[];
  setSubgenres?: Dispatch<SetStateAction<GenreFormOut[]>>;
};

// NOTE: This component is used for both genres and subgenres. Is it fine?
export const AddNewGenre = ({
  appendItem,
  type,
  genresList,
  setSubgenres,
  fetchApi,
}: Props<GenreType>) => {
  const router = useRouter();
  const t = useTranslations("Form.itemFields");

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

  const onSubmit = async (data: TypeGenreScheme) => {
    const dataToSend: GenreFormIn = {
      ...data,
    };

    const response = await fetchApi(dataToSend);

    if (response.status === 201 && response.newItem) {
      const newGenre = {
        ...response.newItem,
        percentage_match: 0,
      };

      if (type === "subgenres" && setSubgenres) {
        setSubgenres((prev) =>
          response.newItem ? [...prev, response.newItem] : prev,
        );
      }

      appendItem(newGenre);

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
      {type === "subgenres" && (
        <div className="flex flex-col gap-2">
          {!!genresList &&
            genresList.map((genre) => (
              <Label key={genre.key} className="flex items-center gap-2">
                <Input
                  className="h-5 w-5"
                  type="radio"
                  value={genre.key}
                  {...register("parent_genre_key")}
                />
                <span>{genre.name}</span>
              </Label>
            ))}

          <span>
            {errors.parent_genre_key && (
              <div className="error-message absolute rounded-md px-2 text-sm">
                {errors.parent_genre_key.message}
              </div>
            )}
          </span>
        </div>
      )}

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
