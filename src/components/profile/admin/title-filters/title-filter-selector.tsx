"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FilterEnum,
  FilterFieldsWithUUID,
  FilterItemOut,
} from "@/orval_api/model";
import { toast } from "sonner";

import {
  getActionTimes,
  getFilterFormFields,
  getGenreFormFields,
  getGenresList,
  getKeywords,
  getSpecifications,
  getSubgenresList,
} from "@/app/services/admin-api";
import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import { TitleFilterEditForm } from "./title-filter-edit-form";

const FILTERS_LIST = [
  { key: FilterEnum.genre, label: "Genres" },
  { key: FilterEnum.subgenre, label: "Subgenres" },
  { key: FilterEnum.specification, label: "Specifications" },
  { key: FilterEnum.keyword, label: "Keywords" },
  { key: FilterEnum.action_time, label: "Action Times" },
];

export const TitleFilterSelector = () => {
  const [selectedFilterType, setSelectedFilterType] =
    useState<FilterEnum | null>(null);

  const [filterList, setFilterList] = useState<FilterItemOut[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<{
    item: FilterFieldsWithUUID;
    key: FilterEnum;
  } | null>(null);

  const selectFilterType = async (filterKey: FilterEnum) => {
    setSelectedFilter(null);
    setFilterList([]);

    if (filterKey === FilterEnum.genre) {
      setSelectedFilterType(filterKey);
      const res = await getGenresList();
      if (Array.isArray(res)) {
        setFilterList(res);
        toast.info("Genres loaded!");
        return;
      }
    }
    if (filterKey === FilterEnum.subgenre) {
      setSelectedFilterType(filterKey);
      const res = await getSubgenresList();
      if (Array.isArray(res)) {
        setFilterList(res);
        toast.info("Subgenres loaded!");
        return;
      }
    }
    if (filterKey === FilterEnum.specification) {
      setSelectedFilterType(filterKey);
      const res = await getSpecifications();
      if (Array.isArray(res)) {
        setFilterList(res);
        toast.info("Specifications loaded!");
        return;
      }
    }

    if (filterKey === FilterEnum.keyword) {
      setSelectedFilterType(filterKey);
      const res = await getKeywords();
      if (Array.isArray(res)) {
        setFilterList(res);
        toast.info("Keywords loaded!");
        return;
      }
    }

    if (filterKey === FilterEnum.action_time) {
      setSelectedFilterType(filterKey);
      const res = await getActionTimes();
      if (Array.isArray(res)) {
        setFilterList(res);
        toast.info("Action times loaded!");
        return;
      }
    }

    toast.error("No data found for this filter type");
  };

  const selectFilterItem = async (key: string) => {
    if (!selectedFilterType) {
      toast.error("Please select a filter type first");
      return;
    }

    setSelectedFilter(null);

    if (
      selectedFilterType === FilterEnum.genre ||
      selectedFilterType === FilterEnum.subgenre
    ) {
      const res = await getGenreFormFields(key, selectedFilterType);

      if (res.status === 200 && res.data) {
        setSelectedFilter({
          item: res.data,
          key: selectedFilterType,
        });
        return;
      } else {
        toast.error(`${res.status}: ${res.message}`);
        return;
      }
    }

    const res = await getFilterFormFields(key, selectedFilterType);

    if (res.status === 200 && res.data) {
      setSelectedFilter({
        item: res.data,
        key: selectedFilterType,
      });
      return;
    } else {
      toast.error(`${res.status}: ${res.message}`);
    }
  };

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

        <ResponsiveWrapper
          title={
            FILTERS_LIST.find((e) => e.key === selectedFilterType)?.label ||
            "Select a filter first"
          }
        >
          <ItemsSelector
            items={filterList}
            emptyText="No items found"
            onSelect={(currentValue, key, item) => {
              selectFilterItem(item.key);
            }}
            checkIconStyle={[selectedFilter?.item.key || ""]}
          />
        </ResponsiveWrapper>
      </div>

      {selectedFilter && (
        <TitleFilterEditForm
          filterItem={selectedFilter.item}
          type={selectedFilter.key}
        />
      )}
    </div>
  );
};
