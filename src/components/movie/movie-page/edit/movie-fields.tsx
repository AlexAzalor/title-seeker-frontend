"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  editMovieDetails,
  editMovieTitle,
  getMovieEditFields,
} from "@/app/(app)/services/admin-api";
import {
  EditMovieDetailsSchema,
  EditMovieTitleSchema,
  type EditMovieDetailsType,
  type EditMovieTitleType,
} from "@/types/movie-schema";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import CustomModal from "@/components/my-custom-ui/custom-modal";
import { Button } from "@/components/ui/button";

type EditFields = NonNullable<
  Awaited<ReturnType<typeof getMovieEditFields>>["data"]
>;

export function parseMovieDuration(value: string): number | undefined {
  const text = value.trim();
  if (/^\d+$/.test(text)) return Number(text);
  const match = text.match(/^(\d+)\s*h(?:\s*(\d+)\s*m)?$/i);
  if (!match) return undefined;
  const minutes = Number(match[2] ?? 0);
  if (minutes >= 60) return undefined;
  return Number(match[1]) * 60 + minutes;
}

export function MovieFieldsEditor({
  movieKey,
  kind,
}: {
  movieKey: string;
  kind: "title" | "details";
}) {
  const t = useTranslations("Form.movieEdit");
  const [data, setData] = useState<EditFields | null>(null);
  const [loading, setLoading] = useState(false);

  const loadFields = async () => {
    setLoading(true);
    try {
      const result = await getMovieEditFields(movieKey);
      if (result.status === 200 && result.data) {
        setData(result.data);
      } else {
        toast.error(result.message || "Failed to load movie details");
      }
    } catch (error) {
      console.error("Failed to load movie edit fields:", error);
      toast.error("Failed to load movie details");
    } finally {
      setLoading(false);
    }
  };

  const label = kind === "title" ? t("editTitle") : t("editDetails");

  return (
    <>
      <Button
        variant="link"
        className="h-7 p-0"
        onClick={loadFields}
        disabled={loading}
      >
        {label}
      </Button>
      {data && (
        <CustomModal isOpen onClose={() => setData(null)}>
          <h2 className="base-neon-text mb-6 text-center text-2xl">{label}</h2>
          {kind === "title" ? (
            <TitleForm
              movieKey={movieKey}
              data={data}
              onClose={() => setData(null)}
            />
          ) : (
            <DetailsForm
              movieKey={movieKey}
              data={data}
              onClose={() => setData(null)}
            />
          )}
        </CustomModal>
      )}
    </>
  );
}

type FormProps = {
  movieKey: string;
  data: EditFields;
  onClose: () => void;
};

function TitleForm({ movieKey, data, onClose }: FormProps) {
  const t = useTranslations("Form.stepper.titleRate");
  const edit = useTranslations("Form.movieEdit");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditMovieTitleType>({
    resolver: zodResolver(EditMovieTitleSchema),
    defaultValues: { title_en: data.title_en, title_uk: data.title_uk },
  });

  const onSubmit = async (values: EditMovieTitleType) => {
    try {
      const result = await editMovieTitle({ movie_key: movieKey, ...values });
      if (result.status !== 200) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Failed to update movie title:", error);
      toast.error("Failed to update movie title");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full min-w-64 flex-col items-center gap-8"
    >
      <FormField
        type="text"
        label={t("titleEn")}
        aria-label={t("titleEn")}
        name="title_en"
        register={register}
        error={errors.title_en}
      />
      <FormField
        type="text"
        label={t("titleUk")}
        aria-label={t("titleUk")}
        name="title_uk"
        register={register}
        error={errors.title_uk}
      />
      <Button type="submit" disabled={isSubmitting}>
        {edit("save")}
      </Button>
    </form>
  );
}

function DetailsForm({ movieKey, data, onClose }: FormProps) {
  const t = useTranslations("Form.stepper.info");
  const edit = useTranslations("Form.movieEdit");
  const router = useRouter();
  const duration = parseMovieDuration(data.duration);
  const originalDate = data.release_date.slice(0, 10);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditMovieDetailsType>({
    resolver: zodResolver(EditMovieDetailsSchema),
    defaultValues: {
      release_date: originalDate,
      duration,
      location_en: data.location_en,
      location_uk: data.location_uk,
    },
  });

  const onSubmit = async (values: EditMovieDetailsType) => {
    try {
      const result = await editMovieDetails({
        movie_key: movieKey,
        ...values,
        release_date:
          values.release_date === originalDate
            ? new Date(data.release_date).toISOString()
            : new Date(`${values.release_date}T00:00:00.000Z`).toISOString(),
      });
      if (result.status !== 200) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Failed to update movie details:", error);
      toast.error("Failed to update movie details");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full min-w-64 flex-col items-center gap-8"
    >
      <FormField
        type="date"
        label={t("date")}
        aria-label={t("date")}
        name="release_date"
        register={register}
        error={errors.release_date}
      />
      <FormField
        type="number"
        min="1"
        step="1"
        label={t("duration")}
        aria-label={t("duration")}
        name="duration"
        register={register}
        error={errors.duration}
      />
      {duration === undefined && (
        <p role="status">
          {edit("durationUnavailable", { duration: data.duration })}
        </p>
      )}
      <FormField
        type="text"
        label={t("locationEn")}
        aria-label={t("locationEn")}
        name="location_en"
        register={register}
        error={errors.location_en}
      />
      <FormField
        type="text"
        label={t("locationUk")}
        aria-label={t("locationUk")}
        name="location_uk"
        register={register}
        error={errors.location_uk}
      />
      <Button type="submit" disabled={isSubmitting}>
        {edit("save")}
      </Button>
    </form>
  );
}
