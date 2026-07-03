"use client";

import { useEffect, useState } from "react";
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
  deleteFilterItem,
  updateFilterItem,
  updateGenre,
} from "@/app/(app)/services/admin-api";
import {
  type VisualProfileFieldType,
  VisualProfileUpdateSchema,
} from "@/types/visual-profile-schema";
import { FilterEnum, type FilterFieldsWithUUID } from "@/orval_api/model";
import CustomModal from "@/components/my-custom-ui/custom-modal";
import { useModal } from "@/hooks/use-modal";
import Link from "next/link";

type Props = {
  filterItem: FilterFieldsWithUUID;
  type: FilterEnum;
};

export const TitleFilterEditForm = ({ filterItem, type }: Props) => {
  const router = useRouter();
  const t = useTranslations("Form.itemFields");
  const { isOpen, open, close } = useModal();
  const [moviesList, setMoviesList] = useState<{ key: string; name: string }[]>(
    [],
  );

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

  const handleDelete = async () => {
    const response = await deleteFilterItem(filterItem.key, type);

    if (response.status === 400 && Array.isArray(response.message)) {
      setMoviesList(response.message);
      open();
      return;
    }

    if (response.status === 204 && typeof response.message === "string") {
      // Modal?
      toast.success(response.message);
      router.refresh();
      return;
    }

    toast.error(`Error status: ${response.status}`);
  };

  return (
    <>
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
          autoResize={false}
        />

        <TextareaFormField
          label={t("descriptionUk")}
          name="description_uk"
          register={register}
          error={errors.description_uk}
          autoResize={false}
        />

        {type === "action_time" && (
          <FormField
            type="text"
            label={t("order")}
            name="order"
            register={register}
            error={errors.order}
          />
        )}

        <Button
          disabled={!isDirty}
          type="submit"
          className="bg-main-ui-purple hover:bg-dark-blue dark:bg-main-ui-purple dark:text-white-dark dark:hover:bg-main-ui-purple/80 h-12 w-41 cursor-pointer rounded-2xl border-0 text-center text-lg transition-all duration-200"
        >
          Save
        </Button>

        <Button
          onDoubleClick={handleDelete}
          variant="destructive"
          type="button"
          className="cursor-pointer border-0 text-center text-lg"
        >
          Delete
        </Button>
      </form>

      <CustomModal isOpen={isOpen} onClose={close}>
        <div className="flex flex-col items-center justify-center gap-4">
          {moviesList.map((movie) => (
            <Link
              key={movie.key}
              className="text-center text-lg font-bold hover:underline"
              href={`/movies/${movie.key}`}
              target="_blank"
            >
              {movie.name}
            </Link>
          ))}
        </div>
      </CustomModal>
    </>
  );
};
