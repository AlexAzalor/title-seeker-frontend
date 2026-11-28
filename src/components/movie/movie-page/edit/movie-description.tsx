"use client";

import {
  editMovieDescription,
  getMovieDescription,
} from "@/app/(app)/services/admin-api";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditMovieDescriptionShema,
  type EditMovieDescriptionType,
} from "@/types/movie-schema";
import { TextareaFormField } from "@/components/my-custom-ui/form-ui-parts/textarea-form-field";
import { Button } from "@/components/ui/button";

type Props = {
  movieKey: string;
  descriptionData: EditMovieDescriptionType;
  onSuccess?: () => void;
};

export async function loadMovieDescription(movieKey: string) {
  try {
    const res = await getMovieDescription(movieKey);
    if (res.status === 200 && res.data) return res.data;
    toast.error(res.message);
  } catch (error) {
    toast.error("An error occurred while fetching the movie description");
    console.error("Fetch movie description error:", error);
  }
  return null;
}

export const EditMovieDescription = ({
  movieKey,
  descriptionData,
  onSuccess,
}: Props) => {
  const t = useTranslations("Form.stepper.info");
  const edit = useTranslations("Form.movieEdit");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<EditMovieDescriptionType>({
    resolver: zodResolver(EditMovieDescriptionShema),
    defaultValues: {
      description_en: descriptionData.description_en || "",
      description_uk: descriptionData.description_uk || "",
    },
  });

  const [description_en, description_uk] = watch([
    "description_en",
    "description_uk",
  ]);

  const updateDescription = async (
    newDescriptionEN: string,
    newDescriptionUK: string,
  ) => {
    try {
      const res = await editMovieDescription(
        movieKey,
        newDescriptionEN,
        newDescriptionUK,
      );

      if (res.status === 200) {
        toast.success(res.message);
        onSuccess?.();
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(edit("descriptionSaveError"));
      console.error("Movie description update error:", error);
    }
  };
  const onSubmit = async (data: EditMovieDescriptionType) => {
    await updateDescription(data.description_en, data.description_uk);
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-center gap-2">
        <p className="base-neon-text text-2xl">{edit("editDescription")}</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-w-lg flex-col items-center gap-8"
      >
        <TextareaFormField
          label={t("descriptionEn")}
          aria-label={t("descriptionEn")}
          name="description_en"
          register={register}
          error={errors.description_en}
          currentLength={description_en.length}
        />

        <TextareaFormField
          label={t("descriptionUk")}
          aria-label={t("descriptionUk")}
          name="description_uk"
          register={register}
          error={errors.description_uk}
          currentLength={description_uk.length}
        />

        <Button type="submit" disabled={isSubmitting}>
          {edit("save")}
        </Button>
      </form>
    </>
  );
};
