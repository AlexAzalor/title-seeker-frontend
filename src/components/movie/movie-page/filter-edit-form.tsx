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
import { type TitleFilterType, TitleFilter } from "@/types/genre-filter-schema";
import { zodResolver } from "@hookform/resolvers/zod";

const ModalMovie = dynamic(
  () => import("@/components/my-custom-ui/modal-window"),
  {
    ssr: false,
  },
);

// API mapping for different filter types
const editApiMap = {
  [FilterEnum.specification]: editMovieSpecifications,
  [FilterEnum.keyword]: editMovieKeywords,
  [FilterEnum.action_time]: editMovieActionTimes,
} as const;

// API mapping for creating new filter items
const createApiMap = {
  [FilterEnum.specification]: createSpecification,
  [FilterEnum.keyword]: createKeyword,
  [FilterEnum.action_time]: createActionTime,
} as const;

const filterPostApi = (filterType: FilterEnum) => {
  const createApi = createApiMap[filterType as keyof typeof createApiMap];
  if (!createApi) {
    throw new Error("Invalid filter type");
  }
  return createApi;
};

type Props = {
  movieKey: string;
  filterItems: FilterItemOut[];
  selectedFilterItems: FilterItemOut[];
  filterType: FilterEnum;
};

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
    resolver: zodResolver(TitleFilter),
    defaultValues: {
      items: selectedFilterItems,
    },
  });

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data: TitleFilterType) => {
    if (data.items.length === 0 || !isDirty) {
      return;
    }

    try {
      const editApi = editApiMap[filterType as keyof typeof editApiMap];
      if (!editApi) {
        toast.error("Invalid filter type");
        return;
      }

      const res = await editApi(movieKey, data.items);

      if (res.status === 200) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the filter");
      console.error("Filter update error:", error);
    }
  };

  const handleSelectItem = ({ key, name, description }: FilterItemOut) => {
    if (!itemFields.find((prevItem) => prevItem.key === key)) {
      appendItem({
        key,
        name,
        percentage_match: 0,
        description,
      });
    } else {
      removeItem(itemFields.findIndex((prevItem) => prevItem.key === key));
    }
  };

  const handleOpenModal = () => {
    setOpenFilterFormModal(true);
  };

  const selectedItemKeys = itemFields.map((field) => field.key);

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
              onOpenModal={handleOpenModal}
              onSelect={handleSelectItem}
              checkIconStyle={selectedItemKeys}
            />
          </ResponsiveWrapper>

          {itemFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-2 gap-4">
              <FormField
                type="text"
                name={`items.${index}.name`}
                register={register}
                error={undefined}
                disabled
              />

              <SliderFormField
                name={`items.${index}.percentage_match`}
                register={register}
                defaultValue={getValues}
                error={
                  errors.items?.[index]?.percentage_match &&
                  errors.items[index].percentage_match
                }
                removItem={() => removeItem(index)}
              />
            </div>
          ))}

          {errors.items && errors.items.message && (
            <span className="text-sm text-red-500">{errors.items.message}</span>
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
            appendItem={appendItem}
            fetchApi={filterPostApi(filterType)}
          />
        </ModalMovie>
      )}
    </>
  );
};
