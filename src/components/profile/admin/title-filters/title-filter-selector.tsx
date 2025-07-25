"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import { TitleFilterEditForm } from "@/components/profile/admin/title-filters/title-filter-edit-form";

import {
  getActionTimes,
  getFilterFormFields,
  getGenreFormFields,
  getGenresList,
  getKeywords,
  getSpecifications,
  getSubgenresList,
} from "@/app/(app)/services/admin-api";

import {
  FilterEnum,
  type FilterFieldsWithUUID,
  type FilterItemOut,
} from "@/orval_api/model";

const FILTERS_LIST = [
  { key: FilterEnum.genre, label: "Genres" },
  { key: FilterEnum.subgenre, label: "Subgenres" },
  { key: FilterEnum.specification, label: "Specifications" },
  { key: FilterEnum.keyword, label: "Keywords" },
  { key: FilterEnum.action_time, label: "Action Times" },
];

// Configuration mapping for filter types
const filterConfig = {
  [FilterEnum.genre]: {
    api: getGenresList,
    message: "Genres loaded!",
  },
  [FilterEnum.subgenre]: {
    api: getSubgenresList,
    message: "Subgenres loaded!",
  },
  [FilterEnum.specification]: {
    api: getSpecifications,
    message: "Specifications loaded!",
  },
  [FilterEnum.keyword]: {
    api: getKeywords,
    message: "Keywords loaded!",
  },
  [FilterEnum.action_time]: {
    api: getActionTimes,
    message: "Action times loaded!",
  },
} as const;

type FilterItem = {
  item: FilterFieldsWithUUID;
  key: FilterEnum;
  itemKey: string;
};

export const TitleFilterSelector = () => {
  const [selectedFilterType, setSelectedFilterType] =
    useState<FilterEnum | null>(null);

  const [filterList, setFilterList] = useState<FilterItemOut[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<FilterItem[]>([]);

  const selectFilterType = async (filterKey: FilterEnum) => {
    setSelectedFilters([]);
    setFilterList([]);

    try {
      const config = filterConfig[filterKey as keyof typeof filterConfig];
      if (!config) {
        toast.error("No data found for this filter type");
        return;
      }

      setSelectedFilterType(filterKey);
      const res = await config.api();

      if (Array.isArray(res)) {
        setFilterList(res);
        toast.info(config.message);
      } else {
        toast.error("No data found for this filter type");
      }
    } catch (error) {
      console.error("Error loading filter data:", error);
      toast.error("Failed to load filter data");
    }
  };

  const selectFilterItem = useCallback(
    async (key: string) => {
      if (!selectedFilterType) {
        toast.error("Please select a filter type first");
        return;
      }

      // Check if item is already selected and toggle if so
      if (selectedFilters.some((e) => e.item.key === key)) {
        setSelectedFilters((prev) => prev.filter((e) => e.item.key !== key));
        return;
      }

      // Configuration for different API calls based on filter type
      const apiConfig = {
        genre: () => getGenreFormFields(key, selectedFilterType),
        subgenre: () => getGenreFormFields(key, selectedFilterType),
        default: () => getFilterFormFields(key, selectedFilterType),
      };

      try {
        // Determine which API to use
        const isGenreType =
          selectedFilterType === FilterEnum.genre ||
          selectedFilterType === FilterEnum.subgenre;
        const apiCall = isGenreType ? apiConfig.genre : apiConfig.default;

        const res = await apiCall();

        if (res.status === 200 && res.data) {
          setSelectedFilters((prev) => [
            ...prev,
            {
              item: res.data,
              key: selectedFilterType,
              itemKey: res.data.key,
            },
          ]);
        } else {
          toast.error(`${res.status}: ${res.message}`);
        }
      } catch (error) {
        console.error("Error selecting filter item:", error);
        toast.error("Failed to load filter item data");
      }
    },
    [selectedFilterType, selectedFilters],
  );

  const filterTitle =
    FILTERS_LIST.find((e) => e.key === selectedFilterType)?.label ||
    "Select a filter first";

  const selectedFilterKeys = selectedFilters.map((e) => e.item.key);

  return (
    <div aria-label="title-filter-selector">
      <div className="mb-6 flex flex-col justify-center gap-3 lg:flex-row">
        <Select onValueChange={selectFilterType}>
          <SelectTrigger
            id="rating-criteria"
            className="max-w-100 self-center justify-self-center"
          >
            <SelectValue placeholder="Select a filter type" />
          </SelectTrigger>
          <SelectContent>
            {FILTERS_LIST.map((item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ResponsiveWrapper title={filterTitle}>
          <ItemsSelector
            items={filterList}
            emptyText="No items found"
            onSelect={({ key }) => {
              selectFilterItem(key);
            }}
            checkIconStyle={selectedFilterKeys}
          />
        </ResponsiveWrapper>
      </div>

      {!!selectedFilters.length &&
        selectedFilters.map(({ itemKey, item, key }) => (
          <TitleFilterEditForm key={itemKey} filterItem={item} type={key} />
        ))}
    </div>
  );
};
