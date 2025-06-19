"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { SliderFormField } from "@/components/my-custom-ui/form-ui-parts/slider-form-field";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import { FormWrapper } from "@/components/my-custom-ui/form-ui-parts/form-wrapper";
import { AddNewMovieFilter } from "@/components/movie/add-movie/connected-parts/add-new-movie-filter";

import {
  editMovieSpecifications,
  createActionTime,
  createKeyword,
  createSpecification,
  editMovieActionTimes,
  editMovieKeywords,
} from "@/app/services/admin-api";

import { FilterEnum, type FilterItemOut } from "@/orval_api/model";
import {
  type FilterListType,
  TitleFilterListOnlySpec,
} from "@/types/genre-filter-schema";
import { zodResolver } from "@hookform/resolvers/zod";

const ModalMovie = dynamic(
  () => import("@/components/my-custom-ui/modal-window"),
  {
    ssr: false,
  },
);

type Props = {
  movieKey: string;
  filterItems: FilterItemOut[];
  selectedFilterItems: FilterItemOut[];
  filterType: string;
};

export type MovieFilterType = "specifications" | "keywords" | "action_times";

export const FilterEditForm = ({
  movieKey,
  filterItems,
  selectedFilterItems,
  filterType,
}: Props) => {
  const t = useTranslations("Filters");
  const router = useRouter();
  const [openFilterFormModal, setOpenFilterFormModal] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    getValues,
  } = useForm({
    resolver: zodResolver(TitleFilterListOnlySpec),
    defaultValues: {
      specifications: selectedFilterItems,
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

  const onSubmit = async (data: FilterListType) => {
    if (data.specifications.length === 0 || !isDirty) {
      return;
    }

    if (filterType === FilterEnum.specification) {
      const res = await editMovieSpecifications(movieKey, data.specifications);

      if (res.status === 200) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
        return;
      }
    }
    if (filterType === FilterEnum.keyword) {
      const res = await editMovieKeywords(movieKey, data.specifications);

      if (res.status === 200) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
        return;
      }
    }
    if (filterType === FilterEnum.action_time) {
      const res = await editMovieActionTimes(movieKey, data.specifications);

      if (res.status === 200) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
        return;
      }
    }

    router.refresh();
  };

  return (
    <>
      <FormWrapper
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
      >
        <div className="mb-5 flex w-full flex-col items-center gap-6">
          <ResponsiveWrapper title={t("addNewItem")}>
            <ItemsSelector
              items={filterItems}
              onOpenModal={() => setOpenFilterFormModal(true)}
              onSelect={(currentValue, key, item) => {
                if (
                  !specificationFields.find(
                    (specificationPrev) => specificationPrev.key === key,
                  )
                ) {
                  appendSpecification({
                    name: currentValue,
                    percentage_match: 0,
                    key: key,
                    description: item.description,
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
      </FormWrapper>

      {openFilterFormModal && (
        <ModalMovie
          title="Filter"
          open={openFilterFormModal}
          setOpen={setOpenFilterFormModal}
        >
          <AddNewMovieFilter
            appendItem={appendSpecification}
            fetchApi={
              filterType === FilterEnum.specification
                ? createSpecification
                : filterType === FilterEnum.keyword
                  ? createKeyword
                  : createActionTime
            }
          />
        </ModalMovie>
      )}
    </>
  );
};
