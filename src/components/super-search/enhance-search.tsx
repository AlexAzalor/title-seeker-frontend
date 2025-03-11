"use client";

import { Fragment, useEffect, useMemo } from "react";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { EnhanceSearchScheme } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { GENRE, SUBGENRE } from "../genres";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { ACTION_TIME, KEYWORD, SPEC } from "../filter-fetch-wrapper";

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

export const EnhanceSearch = () => {
  const router = useRouter();

  const currentSearchParams = useSearchParams();
  const currentSelectedGenres = currentSearchParams.getAll(GENRE);
  const currentSelectedSubgenres = currentSearchParams.getAll(SUBGENRE);
  const currentSelectedSpecifications = currentSearchParams.getAll(SPEC);
  const currentSelectedKeywords = currentSearchParams.getAll(KEYWORD);
  const currentSelectedActionTimes = currentSearchParams.getAll(ACTION_TIME);

  const showForm = useMemo(() => {
    return (
      currentSelectedGenres.length > 0 ||
      currentSelectedSubgenres.length > 0 ||
      currentSelectedSpecifications.length > 0 ||
      currentSelectedKeywords.length > 0 ||
      currentSelectedActionTimes.length > 0
    );
  }, [
    currentSelectedGenres,
    currentSelectedSubgenres,
    currentSelectedSpecifications,
    currentSelectedKeywords,
    currentSelectedActionTimes,
  ]);

  const formatGenreData = useMemo(() => {
    return (
      currentSelectedGenres.map((genre) => ({
        name: extractWord(genre),
        percentage_match: extractValues(genre),
        type: GENRE,
      })) || []
    );
  }, [currentSelectedGenres]);

  const formatSubgenreData = useMemo(() => {
    return (
      currentSelectedSubgenres.map((subgenre) => ({
        name: extractWord(subgenre),
        percentage_match: extractValues(subgenre),
        type: SUBGENRE,
      })) || []
    );
  }, [currentSelectedSubgenres]);

  const formatSpecificationData = useMemo(() => {
    return (
      currentSelectedSpecifications.map((spec) => ({
        name: extractWord(spec),
        percentage_match: extractValues(spec),
        type: SPEC,
      })) || []
    );
  }, [currentSelectedSpecifications]);

  const formatKeywordData = useMemo(() => {
    return (
      currentSelectedKeywords.map((keyword) => ({
        name: extractWord(keyword),
        percentage_match: extractValues(keyword),
        type: KEYWORD,
      })) || []
    );
  }, [currentSelectedKeywords]);

  const formatActionTimeData = useMemo(() => {
    return (
      currentSelectedActionTimes.map((actionTime) => ({
        name: extractWord(actionTime),
        percentage_match: extractValues(actionTime),
        type: ACTION_TIME,
      })) || []
    );
  }, [currentSelectedActionTimes]);

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

  // Effect to update the form when query params change
  useEffect(() => {
    const itemsFromParams = currentSearchParams.getAll(GENRE);
    const itemsFromSubParams = currentSearchParams.getAll(SUBGENRE);
    const itemsFromSpecParams = currentSearchParams.getAll(SPEC);
    const itemsFormKeywords = currentSearchParams.getAll(KEYWORD);
    const itemsFormActionTimes = currentSearchParams.getAll(ACTION_TIME);

    const items =
      itemsFromParams.map((genre) => ({
        name: extractWord(genre),
        percentage_match: extractValues(genre),
        type: GENRE,
      })) || [];
    const itemsSubgenres =
      itemsFromSubParams.map((subgenre) => ({
        name: extractWord(subgenre),
        percentage_match: extractValues(subgenre),
        type: SUBGENRE,
      })) || [];
    const itemsSpec =
      itemsFromSpecParams.map((spec) => ({
        name: extractWord(spec),
        percentage_match: extractValues(spec),
        type: SPEC,
      })) || [];

    const itemsKeywords =
      itemsFormKeywords.map((keyword) => ({
        name: extractWord(keyword),
        percentage_match: extractValues(keyword),
        type: KEYWORD,
      })) || [];

    const itemsActionTimes =
      itemsFormActionTimes.map((actionTime) => ({
        name: extractWord(actionTime),
        percentage_match: extractValues(actionTime),
        type: ACTION_TIME,
      })) || [];

    try {
      if (Array.isArray(items)) {
        reset({
          genres: items,
          subgenres: itemsSubgenres,
          specifications: itemsSpec,
          keywords: itemsKeywords,
          action_times: itemsActionTimes,
        }); // Reset form with new values
      }
    } catch {
      console.error("Invalid JSON in query params");
    }
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

  const onSubmit = (data: {
    genres: { name: string; percentage_match: number[]; type: string }[];
    subgenres: { name: string; percentage_match: number[]; type: string }[];
    specifications: {
      name: string;
      percentage_match: number[];
      type: string;
    }[];
    keywords: { name: string; percentage_match: number[]; type: string }[];
    action_times: { name: string; percentage_match: number[]; type: string }[];
  }) => {
    console.log("isDirty", isDirty);
    console.log("FORM data", data);

    if (!isDirty) {
      return;
    }

    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );
    updatedSearchParams.delete(GENRE);
    updatedSearchParams.delete(SUBGENRE);
    updatedSearchParams.delete(SPEC);
    updatedSearchParams.delete(KEYWORD);
    updatedSearchParams.delete(ACTION_TIME);

    for (const genre of data.genres) {
      updatedSearchParams.append(
        GENRE,
        cleanString(genre.name) + `(${genre.percentage_match.toString()})`,
      );
      window.history.pushState(null, "", "?" + updatedSearchParams.toString());
    }

    for (const subgenre of data.subgenres) {
      updatedSearchParams.append(
        SUBGENRE,
        cleanString(subgenre.name) +
          `(${subgenre.percentage_match.toString()})`,
      );
      window.history.pushState(null, "", "?" + updatedSearchParams.toString());
    }
    for (const spec of data.specifications) {
      updatedSearchParams.append(
        SPEC,
        cleanString(spec.name) + `(${spec.percentage_match.toString()})`,
      );
      window.history.pushState(null, "", "?" + updatedSearchParams.toString());
    }
    for (const keyword of data.keywords) {
      updatedSearchParams.append(
        KEYWORD,
        cleanString(keyword.name) + `(${keyword.percentage_match.toString()})`,
      );
      window.history.pushState(null, "", "?" + updatedSearchParams.toString());
    }
    for (const actionTime of data.action_times) {
      updatedSearchParams.append(
        ACTION_TIME,
        cleanString(actionTime.name) +
          `(${actionTime.percentage_match.toString()})`,
      );
      window.history.pushState(null, "", "?" + updatedSearchParams.toString());
    }

    router.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  };

  return (
    <div className="mx-6 w-full">
      <h2>Enhance Search</h2>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {genresFields.map((field, index) => (
            <Fragment key={field.id}>
              <p>{field.name}</p>
              <Controller
                control={control}
                name={`genres.${index}.percentage_match`}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <span>{value.join(" - ")}</span>
                    <Slider
                      range
                      defaultValue={value}
                      onValueChange={onChange}
                      step={1}
                      max={100}
                      minStepsBetweenThumbs={10}
                    />
                    {error && (
                      <span className="text-sm text-red-500">
                        {error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </Fragment>
          ))}

          <Separator className="my-4" />

          {subgenresFields.map((field, index) => (
            <Fragment key={field.id}>
              <p>{field.name}</p>
              <Controller
                control={control}
                name={`subgenres.${index}.percentage_match`}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <span>{value.join(" - ")}</span>
                    <Slider
                      range
                      defaultValue={value}
                      onValueChange={onChange}
                      step={1}
                      max={100}
                      minStepsBetweenThumbs={10}
                    />
                    {error && (
                      <span className="text-sm text-red-500">
                        {error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </Fragment>
          ))}

          <Separator className="my-4" />

          {specificationsFields.map((field, index) => (
            <Fragment key={field.id}>
              <p>{field.name}</p>
              <Controller
                control={control}
                name={`specifications.${index}.percentage_match`}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <span>{value.join(" - ")}</span>
                    <Slider
                      range
                      defaultValue={value}
                      onValueChange={onChange}
                      step={1}
                      max={100}
                      minStepsBetweenThumbs={10}
                    />
                    {error && (
                      <span className="text-sm text-red-500">
                        {error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </Fragment>
          ))}

          <Separator className="my-4" />

          {keywordsFields.map((field, index) => (
            <Fragment key={field.id}>
              <p>{field.name}</p>
              <Controller
                control={control}
                name={`keywords.${index}.percentage_match`}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <span>{value.join(" - ")}</span>
                    <Slider
                      range
                      defaultValue={value}
                      onValueChange={onChange}
                      step={1}
                      max={100}
                      minStepsBetweenThumbs={10}
                    />
                    {error && (
                      <span className="text-sm text-red-500">
                        {error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </Fragment>
          ))}

          <Separator className="my-4" />

          {actionTimesFields.map((field, index) => (
            <Fragment key={field.id}>
              <p>{field.name}</p>
              <Controller
                control={control}
                name={`action_times.${index}.percentage_match`}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <span>{value.join(" - ")}</span>
                    <Slider
                      range
                      defaultValue={value}
                      onValueChange={onChange}
                      step={1}
                      max={100}
                      minStepsBetweenThumbs={10}
                    />
                    {error && (
                      <span className="text-sm text-red-500">
                        {error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </Fragment>
          ))}

          <Button type="submit" onClick={() => {}}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
};
