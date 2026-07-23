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
  deleteCharacterRow,
  updateCharacter,
} from "@/app/(app)/services/admin-api";
import {
  CharacterUpdateSchema,
  type CharacterUpdateType,
} from "@/types/people-schema";
import { type CharacterFormFieldsOut } from "@/orval_api/model";
import CustomModal from "@/components/my-custom-ui/custom-modal";
import Link from "next/link";
import { useModal } from "@/hooks/use-modal";

type Props = {
  filterItem: CharacterFormFieldsOut;
};

export const TitleCharacterEditForm = ({ filterItem }: Props) => {
  const router = useRouter();
  const t = useTranslations("Form.itemFields");

  const { isOpen, open, close } = useModal();

  const [moviesList, setMoviesList] = useState<{ key: string; name: string }[]>(
    [],
  );
  const [actorsList, setActorsList] = useState<{ key: string; name: string }[]>(
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitSuccessful },
    watch,
    reset,
  } = useForm<CharacterUpdateType>({
    resolver: zodResolver(CharacterUpdateSchema),
    defaultValues: {
      id: filterItem.id,
      key: filterItem.key,
      name_en: filterItem.name_en,
      name_uk: filterItem.name_uk,
    },
  });

  const watchNameEn = watch("name_en");

  useEffect(() => {
    reset(undefined, { keepValues: true, keepDirty: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmit = async (formData: CharacterUpdateType) => {
    if (!isDirty) return;

    const response = await updateCharacter(formData);

    if (response.status === 200 || response.status === 204) {
      toast.success(response.message);
      router.refresh();
      return;
    }

    toast.error(`Error status: ${response.status}`);
  };

  const handleDelete = async () => {
    const response = await deleteCharacterRow(filterItem.key);

    if (response.status === 400 && response.message) {
      setMoviesList((response.message as any).movies);
      setActorsList((response.message as any).actors);
      open();
      return;
    }

    if (response.status === 204 && typeof response.message === "string") {
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
        className="mb-6 flex flex-col items-center justify-between gap-8 font-bold lg:flex-row lg:gap-4"
      >
        <input type="hidden" {...register("id", { valueAsNumber: true })} />

        <FormField
          type="text"
          label={t("key")}
          name="key"
          register={register}
          error={errors.key}
          value={formatKey([watchNameEn])}
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

          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="base-neon-text text-main-ui-purple mb-3 text-3xl">
              Actors
            </h1>
            {actorsList.map((actor) => (
              <Link
                key={actor.key}
                className="text-center text-lg font-bold hover:underline"
                href={`/super-search?page=1&actor=${actor.key}`}
                target="_blank"
              >
                {actor.name}
              </Link>
            ))}
          </div>
        </div>
      </CustomModal>
    </>
  );
};
