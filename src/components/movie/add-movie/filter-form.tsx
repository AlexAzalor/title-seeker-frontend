"use client";

import { use, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { MovieFormContext } from "@/components/movie/add-movie/utils";

import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { FormButtons } from "@/components/my-custom-ui/form-ui-parts/form-buttons";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { SliderFormField } from "@/components/my-custom-ui/form-ui-parts/slider-form-field";
import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import { AddNewMovieFilter } from "@/components/movie/add-movie/connected-parts/add-new-movie-filter";

import {
  TitleFilterList,
  type TitleFilterListType,
} from "@/types/genre-filter-schema";
import {
  createActionTime,
  createKeyword,
  createSpecification,
} from "@/app/services/admin-api";

import type { MovieFormData, FilterItemOut } from "@/orval_api/model";

const ModalMovie = dynamic(
  () => import("@/components/my-custom-ui/modal-window"),
  {
    ssr: false,
  },
);

type Props = {
  specifications: FilterItemOut[];
  keywords: FilterItemOut[];
  actionTimes: FilterItemOut[];
};

export type MovieFilterType = "specifications" | "keywords" | "action_times";

export type MovieFilterFileds = Pick<MovieFormData, MovieFilterType>;

export const FilterForm = ({
  specifications,
  keywords,
  actionTimes,
}: Props) => {
  const t = useTranslations("Form");
  const tFilters = useTranslations("Filters");

  const { setMovieFormData, handleNext, handlePrev } = use(MovieFormContext);

  const [openSpecificationFormModal, setOpenSpecificationFormModal] =
    useState(false);
  const [openKeywordFormModal, setOpenKeywordFormModal] = useState(false);
  const [openActionTimeFormModal, setOpenActionTimeFormModal] = useState(false);

  const { data: parsedData } = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(TitleFilterList),
    defaultValues: {
      specifications: parsedData.specifications || [],
      keywords: parsedData.keywords || [],
      action_times: parsedData.action_times || [],
    },
  });

  const {
    fields: specificationFields,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    control,
    name: "keywords",
  });

  const {
    fields: actionTimeFields,
    append: appendActionTime,
    remove: removeActionTimes,
  } = useFieldArray({
    control,
    name: "action_times",
  });

  const onSubmit = (data: TitleFilterListType) => {
    const dataToApi: MovieFilterFileds = {
      specifications: data.specifications,
      keywords: data.keywords,
      action_times: data.action_times,
    };

    setMovieFormData((prev) => ({
      ...prev,
      form_data: {
        ...parsedData,
        ...dataToApi,
      },
    }));

    localStorage.setItem(
      "new-movie-data",
      JSON.stringify({
        ...parsedData,
        ...dataToApi,
      }),
    );

    handleNext();
  };

  const handleSelectSpec = useCallback(
    ({ name, key }: FilterItemOut) => {
      const isNoSpec = !specificationFields.find(
        (specPrev) => specPrev.key === key,
      );

      if (isNoSpec) {
        appendSpecification({
          key,
          name,
          percentage_match: 0,
        });
      } else {
        removeSpecification(
          specificationFields.findIndex(
            (specificationPrev) => specificationPrev.key === key,
          ),
        );
      }
    },
    [appendSpecification, removeSpecification, specificationFields],
  );

  const handleSelectKeyword = useCallback(
    ({ name, key }: FilterItemOut) => {
      const isNoKeyword = !keywordFields.find(
        (keywordPrev) => keywordPrev.key === key,
      );

      if (isNoKeyword) {
        appendKeyword({
          key,
          name,
          percentage_match: 0,
        });
      } else {
        removeKeyword(
          keywordFields.findIndex((keywordPrev) => keywordPrev.key === key),
        );
      }
    },
    [appendKeyword, keywordFields, removeKeyword],
  );

  const handleSelectActionTime = useCallback(
    ({ name, key }: FilterItemOut) => {
      const isNoActionTime = !actionTimeFields.find(
        (actionTimePrev) => actionTimePrev.key === key,
      );

      if (isNoActionTime) {
        appendActionTime({
          key,
          name,
          percentage_match: 0,
        });
      } else {
        removeActionTimes(
          actionTimeFields.findIndex(
            (actionTimePrev) => actionTimePrev.key === key,
          ),
        );
      }
    },
    [actionTimeFields, appendActionTime, removeActionTimes],
  );

  const handleOpenSpecModal = () => setOpenSpecificationFormModal(true);
  const handleOpenKeywordModal = () => setOpenKeywordFormModal(true);
  const handleOpenActionTimeModal = () => setOpenActionTimeFormModal(true);

  const selectedSpecKeys = specificationFields.map((field) => field.key);
  const selectedKeywordKeys = keywordFields.map((field) => field.key);
  const selectedActionTimeKeys = actionTimeFields.map((field) => field.key);

  return (
    <>
      <div className="flex items-center justify-center gap-3 font-bold">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="mb-5 flex w-full flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <h1 className="text-main-ui-purple">
                {tFilters("specification.name")}
              </h1>
              <TooltipWrapper content={tFilters("specification.description")}>
                <InfoIcon className="h-4 w-4" />
              </TooltipWrapper>
            </div>

            <ResponsiveWrapper
              title={`${t("menuSelect")} ${tFilters("specification.name")}`}
            >
              <ItemsSelector
                items={specifications}
                onOpenModal={handleOpenSpecModal}
                onSelect={handleSelectSpec}
                checkIconStyle={selectedSpecKeys}
              />
            </ResponsiveWrapper>

            {specificationFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-4">
                <FormField
                  type="text"
                  name={`specifications.${index}.name`}
                  register={register}
                  error={undefined}
                  disabled
                />

                <SliderFormField
                  name={`specifications.${index}.percentage_match`}
                  register={register}
                  defaultValue={getValues}
                  error={
                    errors.specifications?.[index]?.percentage_match &&
                    errors.specifications[index].percentage_match
                  }
                  removItem={() => removeSpecification(index)}
                />
              </div>
            ))}

            {errors.specifications && errors.specifications.message && (
              <span className="text-sm text-red-500">
                {errors.specifications.message}
              </span>
            )}
          </div>

          <div className="mb-5 flex w-full flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <h1 className="text-main-ui-purple">
                {tFilters("keyword.name")}
              </h1>
              <TooltipWrapper content={tFilters("keyword.description")}>
                <InfoIcon className="h-4 w-4" />
              </TooltipWrapper>
            </div>

            <ResponsiveWrapper
              title={`${t("menuSelect")} ${tFilters("keyword.name")}`}
            >
              <ItemsSelector
                items={keywords}
                onOpenModal={handleOpenKeywordModal}
                onSelect={handleSelectKeyword}
                checkIconStyle={selectedKeywordKeys}
              />
            </ResponsiveWrapper>

            {keywordFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-4">
                <FormField
                  type="text"
                  name={`keywords.${index}.name`}
                  register={register}
                  error={undefined}
                  disabled
                />

                <SliderFormField
                  name={`keywords.${index}.percentage_match`}
                  register={register}
                  defaultValue={getValues}
                  error={
                    errors.keywords?.[index]?.percentage_match &&
                    errors.keywords[index].percentage_match
                  }
                  removItem={() => removeKeyword(index)}
                />
              </div>
            ))}

            {errors.keywords && errors.keywords.message && (
              <span className="text-sm text-red-500">
                {errors.keywords.message}
              </span>
            )}
          </div>

          <div className="mb-5 flex w-full flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <h1 className="text-main-ui-purple">
                {tFilters("action_time.name")}
              </h1>
              <TooltipWrapper content={tFilters("action_time.description")}>
                <InfoIcon className="h-4 w-4" />
              </TooltipWrapper>
            </div>

            <ResponsiveWrapper
              title={`${t("menuSelect")} ${tFilters("action_time.name")}`}
            >
              <ItemsSelector
                items={actionTimes}
                onOpenModal={handleOpenActionTimeModal}
                onSelect={handleSelectActionTime}
                checkIconStyle={selectedActionTimeKeys}
              />
            </ResponsiveWrapper>

            {actionTimeFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-4">
                <FormField
                  type="text"
                  name={`action_times.${index}.name`}
                  register={register}
                  error={undefined}
                  disabled
                />

                <SliderFormField
                  name={`action_times.${index}.percentage_match`}
                  register={register}
                  defaultValue={getValues}
                  error={
                    errors.action_times?.[index]?.percentage_match &&
                    errors.action_times[index].percentage_match
                  }
                  removItem={() => removeActionTimes(index)}
                />
              </div>
            ))}

            {errors.action_times && errors.action_times.message && (
              <span className="text-sm text-red-500">
                {errors.action_times.message}
              </span>
            )}
          </div>
          <FormButtons handlePrev={handlePrev} />
        </form>
      </div>

      {openSpecificationFormModal && (
        <ModalMovie
          title={t("stepper.filters.addNewSpec")}
          open={openSpecificationFormModal}
          setOpen={setOpenSpecificationFormModal}
        >
          <AddNewMovieFilter
            appendItem={appendSpecification}
            fetchApi={createSpecification}
          />
        </ModalMovie>
      )}

      {openKeywordFormModal && (
        <ModalMovie
          title={t("stepper.filters.addNewKeyword")}
          open={openKeywordFormModal}
          setOpen={setOpenKeywordFormModal}
        >
          <AddNewMovieFilter
            appendItem={appendKeyword}
            fetchApi={createKeyword}
          />
        </ModalMovie>
      )}

      {openActionTimeFormModal && (
        <ModalMovie
          title={t("stepper.filters.addNewActionTime")}
          open={openActionTimeFormModal}
          setOpen={setOpenActionTimeFormModal}
        >
          <AddNewMovieFilter
            appendItem={appendActionTime}
            fetchApi={createActionTime}
          />
        </ModalMovie>
      )}
    </>
  );
};
