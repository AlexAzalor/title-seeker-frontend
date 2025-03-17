"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import { EnhanceSearchScheme } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";

import { GENRE, SUBGENRE } from "../genres";

import { ACTION_TIME, KEYWORD, SPEC } from "../filter-fetch-wrapper";
import {
  cleanString,
  extractValues,
  extractWord,
  formatSearchParams,
  SearchFormValue,
  SearchValue,
} from "@/lib/utils";
import { EnhancedFormSlider } from "./enhance-form-slider";

export const EnhanceSearch = () => {
  const router = useRouter();

  const currentSearchParams = useSearchParams();
  const {
    formatGenreData,
    formatSubgenreData,
    formatSpecificationData,
    formatKeywordData,
    formatActionTimeData,
    showForm,
  } = formatSearchParams(currentSearchParams);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(EnhanceSearchScheme),
    defaultValues: {
      genres: formatGenreData,
      subgenres: formatSubgenreData,
      specifications: formatSpecificationData,
      keywords: formatKeywordData,
      action_times: formatActionTimeData,
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
      genres: getItems(GENRE),
      subgenres: getItems(SUBGENRE),
      specifications: getItems(SPEC),
      keywords: getItems(KEYWORD),
      action_times: getItems(ACTION_TIME),
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

    const keysList = [GENRE, SUBGENRE, SPEC, KEYWORD, ACTION_TIME];

    // First we delete all the search parameters because they are dynamic and then we add the old and updated ones
    for (const key of keysList) {
      urlSearchParams.delete(key);
    }

    function constructSearchQuery(data: SearchValue[], key: string) {
      const itemsList = data.map(
        (item) =>
          // action(10,100)
          `${cleanString(item.name)}(${item.percentage_match.toString()})`,
      );

      for (const item of itemsList) {
        urlSearchParams.append(key, item);
        window.history.pushState(null, "", "?" + urlSearchParams.toString());
      }
    }

    constructSearchQuery(data.genres, GENRE);
    constructSearchQuery(data.subgenres, SUBGENRE);
    constructSearchQuery(data.specifications, SPEC);
    constructSearchQuery(data.keywords, KEYWORD);
    constructSearchQuery(data.action_times, ACTION_TIME);

    // To refresh the page with the new search parameters
    router.replace("/super-search" + "?" + urlSearchParams.toString(), {
      scroll: false,
    });
  };

  return (
    <div className="overflow-auto pr-2 lg:mx-6 lg:w-full">
      <h2 className="hidden lg:block">Enhance Search</h2>

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

          <button
            className="mt-5 w-full rounded-2xl bg-[#4A3AFF] p-2 text-white transition-colors duration-200 hover:bg-[#342BBB] dark:bg-[#4A3AFF]"
            type="submit"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};
