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
import { AddNewSpecification } from "../add-new-specification";
import { AddNewKeyword } from "../add-new-keyword";
import { AddNewActionTime } from "../add-new-action-time";
import { ItemsListSelector } from "../ui/items-list-selector";
import { FormButtons } from "../ui/form-buttons";

const ModalMovie = dynamic(() => import("./modal-movie"));

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

  const parsedData = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
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
      <div className="text-textOrange flex items-center gap-3 font-bold">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <h2>specifications</h2>
          {specificationFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`specifications.${index}.name`)} disabled />
              <input
                {...register(`specifications.${index}.percentage_match`)}
                placeholder="Percentage match"
              />

              {errors.specifications?.[index]?.percentage_match && (
                <p>{errors.specifications[index].percentage_match.message}</p>
              )}

              <button
                type="button"
                onClick={() => {
                  removeSpecification(index);
                }}
              >
                Remove Actor
              </button>
            </div>
          ))}

          {errors.specifications && errors.specifications.message && (
            <span className="text-sm text-red-500">
              {errors.specifications.message}
            </span>
          )}

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

          <h2>Keyword</h2>
          {keywordFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`keywords.${index}.name`)} disabled />
              <input
                {...register(`keywords.${index}.percentage_match`)}
                placeholder="Percentage match"
              />

              {errors.keywords?.[index]?.percentage_match && (
                <p>{errors.keywords[index].percentage_match.message}</p>
              )}

              <button
                type="button"
                onClick={() => {
                  removeKeyword(index);
                }}
              >
                Remove Actor
              </button>
            </div>
          ))}

          {errors.keywords && errors.keywords.message && (
            <span className="text-sm text-red-500">
              {errors.keywords.message}
            </span>
          )}

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

          <h2>Action Times</h2>
          {actionTimeFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`action_times.${index}.name`)} disabled />
              <input
                {...register(`action_times.${index}.percentage_match`)}
                placeholder="Percentage match"
              />

              {errors.action_times?.[index]?.percentage_match && (
                <p>{errors.action_times[index].percentage_match.message}</p>
              )}

              <button
                type="button"
                onClick={() => {
                  removeActionTimes(index);
                }}
              >
                Remove Actor
              </button>
            </div>
          ))}

          {errors.action_times && errors.action_times.message && (
            <span className="text-sm text-red-500">
              {errors.action_times.message}
            </span>
          )}

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
