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

import {
  deleteActorRow,
  deleteDirectorRow,
  updateActor,
  updateDirector,
} from "@/app/(app)/services/admin-api";
import {
  PersonUpdateSchema,
  type PersonUpdateType,
} from "@/types/people-schema";
import { FilterEnum, type PersonFormWithID } from "@/orval_api/model";
import CustomModal from "@/components/my-custom-ui/custom-modal";
import { useModal } from "@/hooks/use-modal";
import Link from "next/link";

type Props = {
  filterItem: PersonFormWithID;
  type: FilterEnum;
};

function toInputDate(date: string | null | undefined): string {
  if (!date) return "";
  // "DD.MM.YYYY" → "YYYY-MM-DD"
  const parts = date.split(".");
  if (parts.length !== 3) return date.split("T")[0];
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export const TitlePeopleEditForm = ({ filterItem, type }: Props) => {
  const router = useRouter();
  const t = useTranslations("Form.personFields");

  const [moviesList, setMoviesList] = useState<{ key: string; name: string }[]>(
    [],
  );
  const [charactersList, setCharactersList] = useState<
    { key: string; name: string }[]
  >([]);

  const { isOpen, open, close } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitSuccessful },
    watch,
    reset,
  } = useForm<PersonUpdateType>({
    resolver: zodResolver(PersonUpdateSchema),
    defaultValues: {
      id: filterItem.id,
      key: filterItem.key,
      first_name_en: filterItem.first_name_en,
      first_name_uk: filterItem.first_name_uk,
      last_name_en: filterItem.last_name_en,
      last_name_uk: filterItem.last_name_uk,
      born: toInputDate(filterItem.born),
      died: toInputDate(filterItem.died ?? undefined),
      born_in_en: filterItem.born_in_en,
      born_in_uk: filterItem.born_in_uk,
    },
  });

  const watchFirstNameEn = watch("first_name_en");
  const watchLastNameEn = watch("last_name_en");

  useEffect(() => {
    reset(undefined, { keepValues: true, keepDirty: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmit = async (formData: PersonUpdateType) => {
    if (!isDirty) return;

    const updateFn =
      type === FilterEnum.director ? updateDirector : updateActor;
    const response = await updateFn({
      ...formData,
      died: formData.died || null,
      born: new Date(formData.born).toISOString().split("T")[0],
    });

    if (response.status === 200 || response.status === 204) {
      toast.success(response.message);
      router.refresh();
      return;
    }

    toast.error(`Error status: ${response.status}`);
  };

  const handleDelete = async () => {
    const deleteFn =
      type === FilterEnum.director ? deleteDirectorRow : deleteActorRow;
    const response = await deleteFn(filterItem.key);

    if (response.status === 400 && response.message) {
      setMoviesList((response.message as any).movies);
      if (Array.isArray((response.message as any).characters)) {
        setCharactersList((response.message as any).characters);
      }
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
        className="mb-6 flex flex-col items-center justify-between gap-8 font-bold"
      >
        <input type="hidden" {...register("id", { valueAsNumber: true })} />

        <FormField
          type="text"
          label={t("key")}
          name="key"
          register={register}
          error={errors.key}
          value={formatKey([watchFirstNameEn, watchLastNameEn])}
        />

        <FormField
          type="text"
          label={t("firstNameEn")}
          name="first_name_en"
          register={register}
          error={errors.first_name_en}
        />

        <FormField
          type="text"
          label={t("lastNameEn")}
          name="last_name_en"
          register={register}
          error={errors.last_name_en}
        />

        <FormField
          type="text"
          label={t("firstNameUk")}
          name="first_name_uk"
          register={register}
          error={errors.first_name_uk}
        />

        <FormField
          type="text"
          label={t("lastNameUk")}
          name="last_name_uk"
          register={register}
          error={errors.last_name_uk}
        />

        <FormField
          type="date"
          label={t("born")}
          name="born"
          register={register}
          error={errors.born}
        />

        <FormField
          type="date"
          label={t("died")}
          name="died"
          register={register}
          error={errors.died}
        />

        <FormField
          type="text"
          label={t("bornInEn")}
          name="born_in_en"
          register={register}
          error={errors.born_in_en}
        />

        <FormField
          type="text"
          label={t("bornInUk")}
          name="born_in_uk"
          register={register}
          error={errors.born_in_uk}
        />

        <div className="flex w-full items-center justify-center gap-4">
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
        </div>
      </form>

      <CustomModal isOpen={isOpen} onClose={close}>
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="base-neon-text text-main-ui-purple mb-3 text-3xl">
              Movies
            </h1>

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

          {!!charactersList.length && (
            <div className="flex flex-col items-center justify-center gap-4">
              <h1 className="base-neon-text text-main-ui-purple mb-3 text-3xl">
                Characters
              </h1>
              {charactersList.map((char) => (
                <Link
                  key={char.key}
                  className="text-center text-lg font-bold hover:underline"
                  href={`/super-search?page=1&character=${char.key}`}
                  target="_blank"
                >
                  {char.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </CustomModal>
    </>
  );
};
