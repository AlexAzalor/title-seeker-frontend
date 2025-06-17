"use client";

import { useRef } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import type { Session } from "next-auth";
import { checkIfAdmin } from "@/middleware";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatKey } from "@/lib/utils";

import { quicklyAddNewMovie } from "@/app/services/admin-api";
import {
  QuickMovieFormData,
  RatingCriterion,
  BaseRatingCriteria,
} from "@/orval_api/model";
import { FormField } from "../my-custom-ui/form-ui-parts/form-field";
import { QuickMovieSchema, QuickMovieType } from "@/types/movie-schema";
import { RateMovie } from "./rating/rate-movie";
import { RatingDataOut } from "./add-movie/key-fields-form";
import { FormWrapper } from "../my-custom-ui/form-ui-parts/form-wrapper";

export const QuicklyAddNewMovie = () => {
  const t = useTranslations("Form.quickMovie");
  const { data: sessionData, update } = useSession();

  const ratingRef = useRef<RatingDataOut>({
    ratingData: {} as BaseRatingCriteria,
    ratingCriterionType: RatingCriterion.basic,
    rating: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<QuickMovieType>({
    resolver: zodResolver(QuickMovieSchema),
    defaultValues: {
      key: "",
      title_en: "",
    },
  });
  const watchFields = watch(["title_en"]);

  const onSubmit = async (data: QuickMovieType) => {
    if (ratingRef.current.rating < 1) {
      toast.error("Rating must be more than 1");
      return;
    }

    const dataToSend: QuickMovieFormData = {
      ...data,
      rating: ratingRef.current.rating,
      rating_criterion_type: ratingRef.current.ratingCriterionType,
      rating_criteria: ratingRef.current.ratingData,
    };

    const response = await quicklyAddNewMovie(dataToSend);

    if (response.status === 201) {
      toast.success(response?.message);

      if (sessionData && checkIfAdmin(sessionData.user.role)) {
        await update({
          user: {
            ...sessionData.user,
            new_movies_to_add_count:
              sessionData.user.new_movies_to_add_count + 1,
          },
        } as Session);
      }
    }

    if (response.status === 400) {
      toast.error(response?.message);
      throw new Error(response?.message);
    }
    if (response.status === 409) {
      toast.error(response?.message);
      throw new Error(response?.message);
    }
  };

  return (
    <FormWrapper
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      buttonTitle="Submit"
    >
      {/* For Vitest */}
      <span aria-label="quick-add-new-movie" className="sr-only"></span>
      <FormField
        type="text"
        label={t("movieTitleEn")}
        name="title_en"
        register={register}
        error={errors.title_en}
      />

      <FormField
        type="text"
        label={t("key")}
        name="key"
        register={register}
        error={errors.key}
        value={formatKey(watchFields)}
      />

      <RateMovie ratingRef={ratingRef} />
    </FormWrapper>
  );
};
