"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { EnhanceSearchScheme } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { GENRE, SUBGENRE } from "../genres";

import { ACTION_TIME, KEYWORD, SPEC } from "../filter-fetch-wrapper";
import { SearchFormValue, SearchValue } from "@/lib/utils";
import { EnhancedFormSlider } from "./enhance-form-slider";

export const cleanString = (str: string) => str.replace(/\(.*?\)/g, "");

export const DEFAULT_RANGE = [10, 100];
export const extractValues = (str: string): number[] => {
  const match = str.match(/\((.*?)\)/);

  if (match) {
    return match[1].split(",").map(Number);
  }

  return DEFAULT_RANGE;
};

export const extractWord = (str: string): string => {
  const match = str.match(/^[^\(]+/);
  return match ? match[0].trim() : "";
};

const formatSearchParams = (currentSearchParams: ReadonlyURLSearchParams) => {
  const currentSelectedGenres = currentSearchParams.getAll(GENRE);
  const currentSelectedSubgenres = currentSearchParams.getAll(SUBGENRE);
  const currentSelectedSpecifications = currentSearchParams.getAll(SPEC);
  const currentSelectedKeywords = currentSearchParams.getAll(KEYWORD);
  const currentSelectedActionTimes = currentSearchParams.getAll(ACTION_TIME);

  const showForm = () => {
    return (
      currentSelectedGenres.length > 0 ||
      currentSelectedSubgenres.length > 0 ||
      currentSelectedSpecifications.length > 0 ||
      currentSelectedKeywords.length > 0 ||
      currentSelectedActionTimes.length > 0
    );
  };

  const getData = (params: string[]) => {
    return params.map((param) => ({
      name: extractWord(param),
      percentage_match: extractValues(param),
    }));
  };

  return {
    formatGenreData: getData(currentSelectedGenres),
    formatSubgenreData: getData(currentSelectedSubgenres),
    formatSpecificationData: getData(currentSelectedSpecifications),
    formatKeywordData: getData(currentSelectedKeywords),
    formatActionTimeData: getData(currentSelectedActionTimes),
    showForm: showForm(),
  };
};

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

    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );

    const keysList = [GENRE, SUBGENRE, SPEC, KEYWORD, ACTION_TIME];

    for (const item of keysList) {
      updatedSearchParams.delete(item);
    }

    function getData(data: SearchValue[], key: string) {
      const itemsList = data.map(
        (item) =>
          `${cleanString(item.name)}(${item.percentage_match.toString()})`,
      );

      for (const item of itemsList) {
        updatedSearchParams.append(key, item);
        window.history.pushState(
          null,
          "",
          "?" + updatedSearchParams.toString(),
        );
      }
    }

    getData(data.genres, GENRE);
    getData(data.subgenres, SUBGENRE);
    getData(data.specifications, SPEC);
    getData(data.keywords, KEYWORD);
    getData(data.action_times, ACTION_TIME);

    // To refresh the page with the new search parameters
    router.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  };

  return (
    <div className="mx-6 w-full">
      <h2>Enhance Search</h2>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <EnhancedFormSlider
            name="genres"
            control={control}
            itemsList={genresFields}
          />

          <EnhancedFormSlider
            name="subgenres"
            control={control}
            itemsList={subgenresFields}
          />

          <EnhancedFormSlider
            name="specifications"
            control={control}
            itemsList={specificationsFields}
          />

          <EnhancedFormSlider
            name="keywords"
            control={control}
            itemsList={keywordsFields}
          />

          <EnhancedFormSlider
            name="action_times"
            control={control}
            itemsList={actionTimesFields}
          />

          <Button type="submit">Submit</Button>
        </form>
      )}
    </div>
  );
};
