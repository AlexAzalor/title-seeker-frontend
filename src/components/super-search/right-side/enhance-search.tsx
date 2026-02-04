"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  extractValues,
  extractWord,
  formatSearchParams,
  type SearchFormValue,
  type SearchValue,
} from "@/lib/utils";
import { EnhancedFormSlider } from "@/components/super-search/right-side/enhance-form-slider";
import { FilterEnum } from "@/orval_api/model";
import {
  EnhanceSearchSchema,
  type EnhanceSearchSchemaType,
} from "@/types/search-params-schema";
import { Slider } from "../../ui/slider";
import { MAX_LIMIT, MIN_LIMIT } from "@/lib/constants";

export const parseDurationString = (
  str: string | undefined,
): number[] | undefined => {
  if (!str) return undefined;
  return str.split(",").map((val) => Number(val.trim()));
};

export const EnhanceSearch = () => {
  const router = useRouter();
  const t = useTranslations("SuperSearch");

  const currentSearchParams = useSearchParams();
  const {
    formatGenreData,
    formatSubgenreData,
    formatSpecificationData,
    formatKeywordData,
    formatActionTimeData,
    duration,
    showForm,
  } = formatSearchParams(currentSearchParams);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<EnhanceSearchSchemaType>({
    resolver: zodResolver(EnhanceSearchSchema),
    defaultValues: {
      genres: formatGenreData,
      subgenres: formatSubgenreData,
      specifications: formatSpecificationData,
      keywords: formatKeywordData,
      action_times: formatActionTimeData,
      duration: duration as number[],
    },
  });

  // Need to apply new form sliders when the search parameters change
  useEffect(() => {
    const getItems = (key: string) => {
      const paramsItemsList = currentSearchParams.getAll(key);

      const items = paramsItemsList.map((item) => ({
        name: extractWord(item),
        percentage_match: extractValues(item),
      }));

      return items;
    };

    reset({
      genres: getItems(FilterEnum.genre),
      subgenres: getItems(FilterEnum.subgenre),
      specifications: getItems(FilterEnum.specification),
      keywords: getItems(FilterEnum.keyword),
      action_times: getItems(FilterEnum.action_time),
      duration: parseDurationString(
        currentSearchParams.get("duration") ?? undefined,
      ) as number[],
    }); // Reset form with new values
  }, [currentSearchParams, reset]);

  const { fields: genresFields } = useFieldArray({
    control,
    name: "genres",
  });

  const { fields: subgenresFields } = useFieldArray({
    control,
    name: "subgenres",
  });

  const { fields: specificationsFields } = useFieldArray({
    control,
    name: "specifications",
  });

  const { fields: keywordsFields } = useFieldArray({
    control,
    name: "keywords",
  });

  const { fields: actionTimesFields } = useFieldArray({
    control,
    name: "action_times",
  });

  const onSubmit = (data: SearchFormValue) => {
    if (!isDirty) {
      return;
    }

    const urlSearchParams = new URLSearchParams(currentSearchParams.toString());

    // Go to the first page
    urlSearchParams.set("page", "1");

    const keysList = [
      FilterEnum.genre,
      FilterEnum.subgenre,
      FilterEnum.specification,
      FilterEnum.keyword,
      FilterEnum.action_time,
    ];

    // First we delete all the search parameters because they are dynamic and then we add the old and updated ones
    for (const key of keysList) {
      urlSearchParams.delete(key);
    }

    function constructSearchQuery(data: SearchValue[], key: string) {
      const itemsList = data.map(
        (item) =>
          // action(10,100)
          `${item.name}(${item.percentage_match.toString()})`,
      );

      for (const item of itemsList) {
        urlSearchParams.append(key, item);
        window.history.pushState(null, "", "?" + urlSearchParams.toString());
      }
    }

    constructSearchQuery(data.genres, FilterEnum.genre);
    constructSearchQuery(data.subgenres, FilterEnum.subgenre);
    constructSearchQuery(data.specifications, FilterEnum.specification);
    constructSearchQuery(data.keywords, FilterEnum.keyword);
    constructSearchQuery(data.action_times, FilterEnum.action_time);

    // Handle duration separately as it's an array, convert to string for URL
    urlSearchParams.delete("duration");
    if (data.duration && data.duration.length === 2) {
      const durationStr = data.duration.join(",");
      urlSearchParams.set("duration", durationStr);
    }

    // To refresh the page with the new search parameters
    router.replace("/super-search" + "?" + urlSearchParams.toString(), {
      scroll: false,
    });

    toast.info(t("applied"));
  };

  return (
    <div
      className="custom-scrollbar overflow-y-auto pr-2 lg:mx-6 lg:w-full"
      aria-label="enhance-search"
    >
      <h2 className="mt-4 mb-2 hidden lg:block">{t("enhance")}</h2>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {!!genresFields.length && (
            <EnhancedFormSlider
              name="genres"
              control={control}
              itemsList={genresFields}
            />
          )}

          {!!subgenresFields.length && (
            <EnhancedFormSlider
              name="subgenres"
              control={control}
              itemsList={subgenresFields}
            />
          )}

          {!!specificationsFields.length && (
            <EnhancedFormSlider
              name="specifications"
              control={control}
              itemsList={specificationsFields}
            />
          )}

          {!!keywordsFields.length && (
            <EnhancedFormSlider
              name="keywords"
              control={control}
              itemsList={keywordsFields}
            />
          )}

          {!!actionTimesFields.length && (
            <EnhancedFormSlider
              name="action_times"
              control={control}
              itemsList={actionTimesFields}
            />
          )}

          {!!duration && (
            <Controller
              control={control}
              name="duration"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <>
                    <p className="font-bold">{t("duration")}</p>
                    <span>{value?.join(" - ")}</span>
                    <Slider
                      range
                      defaultValue={value}
                      value={value}
                      onValueChange={onChange}
                      max={MAX_LIMIT}
                      min={MIN_LIMIT}
                      minStepsBetweenThumbs={1}
                    />
                    {error && (
                      <span className="text-danger text-sm">
                        {error.message}
                      </span>
                    )}
                  </>
                );
              }}
            />
          )}

          <button
            className="bg-main-ui-purple dark:bg-main-ui-purple hover:bg-dark-blue dark:hover:bg-main-ui-purple/70 mt-5 w-full rounded-2xl p-2 text-white transition-colors duration-200"
            type="submit"
          >
            {t("apply")}
          </button>
        </form>
      )}
    </div>
  );
};
