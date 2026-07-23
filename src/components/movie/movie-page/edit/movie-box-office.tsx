"use client";

import { editMovieBoxOffice } from "@/app/(app)/services/admin-api";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditMovieBoxOfficeShema,
  type EditMovieBoxOfficeType,
} from "@/types/movie-schema";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { cleanNumberValue, parseNumberValue } from "@/lib/utils";

type Props = {
  movieKey: string;
  boxOfficeData: {
    budget: string;
    domesticGross?: string;
    worldwideGross?: string;
  };
};

export const EditMovieBoxOffice = ({ movieKey, boxOfficeData }: Props) => {
  const t = useTranslations("Form.stepper.info");
  const router = useRouter();

  const { domesticGross, worldwideGross } = boxOfficeData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EditMovieBoxOfficeType>({
    resolver: zodResolver(EditMovieBoxOfficeShema),
    defaultValues: {
      budget: parseNumberValue(boxOfficeData.budget) ?? 0,
      domestic_gross: parseNumberValue(domesticGross),
      worldwide_gross: parseNumberValue(worldwideGross),
    },
  });

  const [budgetForm, domestic_gross, worldwide_gross] = watch([
    "budget",
    "domestic_gross",
    "worldwide_gross",
  ]);

  const updateBoxOffice = async (
    budget: number,
    domesticGross?: number,
    worldwideGross?: number,
  ) => {
    try {
      const res = await editMovieBoxOffice(
        movieKey,
        budget,
        domesticGross,
        worldwideGross,
      );

      if (res.status === 200) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating Box Office");
      console.error("Filter update error:", error);
    }
  };
  const onSubmit = (data: EditMovieBoxOfficeType) => {
    updateBoxOffice(data.budget, data.domestic_gross, data.worldwide_gross);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-8"
      >
        <FormField
          type="text"
          label={t("budget")}
          name="budget"
          register={register}
          error={errors.budget}
          value={cleanNumberValue(budgetForm)}
        />

        <FormField
          type="text"
          label={t("domesticGross")}
          name="domestic_gross"
          register={register}
          error={errors.domestic_gross}
          value={
            domestic_gross
              ? cleanNumberValue(domestic_gross).toString()
              : undefined
          }
        />

        <FormField
          type="text"
          label={t("worldwideGross")}
          name="worldwide_gross"
          register={register}
          error={errors.worldwide_gross}
          value={
            worldwide_gross
              ? cleanNumberValue(worldwide_gross).toString()
              : undefined
          }
        />

        <Button type="submit">Submit</Button>
      </form>
    </>
  );
};
