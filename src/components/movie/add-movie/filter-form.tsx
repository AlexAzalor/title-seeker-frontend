"use client";

import { Suspense, use, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocalStorage } from "@/hooks/use-local-storage";

import {
  createActionTime,
  createKeyword,
  createSpecification,
} from "@/app/services/admin-api";
import { MovieFormContext } from "./utils";
import { InfoIcon } from "lucide-react";
import { MovieFilterList, MovieFilterListType } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";

import { MovieFormData, FilterItemOut } from "@/orval_api/model";
import { AddNewMovieFilter } from "./connected-parts/add-new-movie-filter";
import { ItemsSelector } from "../../my-custom-ui/items-list-selector";
import { FormButtons } from "@/components/my-custom-ui/form-ui-parts/form-buttons";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { SliderFormField } from "@/components/my-custom-ui/form-ui-parts/slider-form-field";
import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import { ResponsiveWrapper } from "../../my-custom-ui/responsive-wrapper";

const ModalMovie = dynamic(() => import("../../my-custom-ui/modal-window"));

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
    resolver: zodResolver(MovieFilterList),
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

  const onSubmit = (data: MovieFilterListType) => {
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
                onOpenModal={() => setOpenSpecificationFormModal(true)}
                onSelect={(currentValue, key) => {
                  if (
                    !specificationFields.find(
                      (specificationPrev) => specificationPrev.key === key,
                    )
                  ) {
                    appendSpecification({
                      name: currentValue,
                      percentage_match: 0,
                      key: key,
                    });
                  } else {
                    removeSpecification(
                      specificationFields.findIndex(
                        (specificationPrev) => specificationPrev.key === key,
                      ),
                    );
                  }
                }}
                checkIconStyle={specificationFields.map((field) => field.key)}
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
                  onClickButton={() => removeSpecification(index)}
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
              <h1 className="text-main-ui-purple">Keyword</h1>
              <TooltipWrapper content={tFilters("keyword.description")}>
                <InfoIcon className="h-4 w-4" />
              </TooltipWrapper>
            </div>

            <ResponsiveWrapper
              title={`${t("menuSelect")} ${tFilters("keyword.name")}`}
            >
              <ItemsSelector
                items={keywords}
                onOpenModal={() => setOpenKeywordFormModal(true)}
                onSelect={(currentValue, key) => {
                  if (
                    !keywordFields.find(
                      (keywordPrev) => keywordPrev.key === key,
                    )
                  ) {
                    appendKeyword({
                      name: currentValue,
                      percentage_match: 0,
                      key: key,
                    });
                  } else {
                    removeKeyword(
                      keywordFields.findIndex(
                        (keywordPrev) => keywordPrev.key === key,
                      ),
                    );
                  }
                }}
                checkIconStyle={keywordFields.map((field) => field.key)}
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
                  onClickButton={() => removeKeyword(index)}
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
              <h1 className="text-main-ui-purple">Action Times</h1>
              <TooltipWrapper content={tFilters("action_time.description")}>
                <InfoIcon className="h-4 w-4" />
              </TooltipWrapper>
            </div>

            <ResponsiveWrapper
              title={`${t("menuSelect")} ${tFilters("action_time.name")}`}
            >
              <ItemsSelector
                items={actionTimes}
                onOpenModal={() => setOpenActionTimeFormModal(true)}
                onSelect={(currentValue, key) => {
                  if (
                    !actionTimeFields.find(
                      (actionTimePrev) => actionTimePrev.key === key,
                    )
                  ) {
                    appendActionTime({
                      name: currentValue,
                      percentage_match: 0,
                      key: key,
                    });
                  } else {
                    removeActionTimes(
                      actionTimeFields.findIndex(
                        (actionTimePrev) => actionTimePrev.key === key,
                      ),
                    );
                  }
                }}
                checkIconStyle={keywordFields.map((field) => field.key)}
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
                  onClickButton={() => removeActionTimes(index)}
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

      <Suspense>
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
      </Suspense>
    </>
  );
};
