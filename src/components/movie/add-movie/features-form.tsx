import { Suspense, use, useState } from "react";
import dynamic from "next/dynamic";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { MovieFeatureList } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ActionTimeOut,
  KeywordOut,
  MovieFormData,
  SpecificationOut,
} from "@/orval_api/model";
import { MovieFormContext } from "./movie-form-wizard";
import { AddNewSpecification } from "../add-movies-parts/add-new-specification";
import { AddNewKeyword } from "../add-movies-parts/add-new-keyword";
import { AddNewActionTime } from "../add-movies-parts/add-new-action-time";
import { ItemsListSelector } from "../ui/items-list-selector";
import { FormButtons } from "../ui/form-buttons";
import { FormField } from "../ui/form-field";
import { SliderFormField } from "../ui/slider-form-field";
import { TooltipWrapper } from "@/components/custom/tooltip-wrapper";
import { InfoIcon } from "lucide-react";
import { movieComponents } from "@/lib/constants";

const ModalMovie = dynamic(() => import("../ui/modal-movie"));

type Props = {
  specifications: SpecificationOut[];
  keywords: KeywordOut[];
  actionTimes: ActionTimeOut[];
};

export type MovieInfoFieldNames = Pick<
  MovieFormData,
  "specifications" | "keywords" | "action_times"
>;

export type FeatureSchemeType = z.infer<typeof MovieFeatureList>;

export const FeaturesForm = ({
  specifications,
  keywords,
  actionTimes,
}: Props) => {
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
    resolver: zodResolver(MovieFeatureList),
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

  const onSubmit = (data: FeatureSchemeType) => {
    const dataToSend: MovieInfoFieldNames = {
      specifications: data.specifications,
      keywords: data.keywords,
      action_times: data.action_times,
    };

    setMovieFormData((prev) => ({
      ...prev,
      form_data: {
        ...parsedData,
        ...dataToSend,
      },
    }));

    localStorage.setItem(
      "new-movie-data",
      JSON.stringify({
        ...parsedData,
        ...dataToSend,
      }),
    );

    handleNext();
  };

  return (
    <>
      <div className="text-textOrange flex items-center justify-center gap-3 font-bold">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="mb-5 flex w-full flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-[#4035E6]">Specifications</h1>
              <TooltipWrapper content={movieComponents.specification}>
                <InfoIcon className="h-4 w-4" />
              </TooltipWrapper>
            </div>

            <ItemsListSelector
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
              checkIconStyle={specificationFields}
            />
            {specificationFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-4">
                <FormField
                  type="text"
                  label="Name"
                  name={`specifications.${index}.name`}
                  register={register}
                  error={undefined}
                  labelWidth={64}
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

          <div className="mb-5 flex w-full flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-[#4035E6]">Keyword</h1>
              <TooltipWrapper content={movieComponents.keyword}>
                <InfoIcon className="h-4 w-4" />
              </TooltipWrapper>
            </div>
            <ItemsListSelector
              items={keywords}
              onOpenModal={() => setOpenKeywordFormModal(true)}
              onSelect={(currentValue, key) => {
                if (
                  !keywordFields.find((keywordPrev) => keywordPrev.key === key)
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
              checkIconStyle={keywordFields}
            />
            {keywordFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-4">
                <FormField
                  type="text"
                  label="Name"
                  name={`keywords.${index}.name`}
                  register={register}
                  error={undefined}
                  labelWidth={64}
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

          <div className="mb-5 flex w-full flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-[#4035E6]">Action Times</h1>
              <TooltipWrapper content={movieComponents.actionTime}>
                <InfoIcon className="h-4 w-4" />
              </TooltipWrapper>
            </div>
            <ItemsListSelector
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
              checkIconStyle={keywordFields}
            />
            {actionTimeFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-4">
                <FormField
                  type="text"
                  label="Name"
                  name={`action_times.${index}.name`}
                  register={register}
                  error={undefined}
                  labelWidth={64}
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
          title="Specification"
          open={openSpecificationFormModal}
          setOpen={setOpenSpecificationFormModal}
        >
          <AddNewSpecification appendSpecification={appendSpecification} />
        </ModalMovie>

        <ModalMovie
          title="Keyword"
          open={openKeywordFormModal}
          setOpen={setOpenKeywordFormModal}
        >
          <AddNewKeyword appendKeyword={appendKeyword} />
        </ModalMovie>

        <ModalMovie
          title="Action Time"
          open={openActionTimeFormModal}
          setOpen={setOpenActionTimeFormModal}
        >
          <AddNewActionTime appendActionTime={appendActionTime} />
        </ModalMovie>
      </Suspense>
    </>
  );
};
