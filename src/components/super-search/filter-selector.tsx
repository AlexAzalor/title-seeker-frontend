"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import {
  DEFAULT_RANGE,
  extractWord,
  manageSearchParameters,
} from "@/lib/utils";
import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import { FilterEnum, type FilterItemOut } from "@/orval_api/model";

type NoPm = Omit<FilterItemOut, "percentage_match">;
type Props = {
  data: NoPm[];
  param_key: FilterEnum;
};

export const FilterSelector = ({ data, param_key }: Props) => {
  const router = useRouter();
  const t = useTranslations("Filters");

  const specialFilters = [
    FilterEnum.specification,
    FilterEnum.keyword,
    FilterEnum.action_time,
  ] as const;

  const isFilters = (specialFilters as readonly FilterEnum[]).includes(
    param_key,
  );

  const defaultRange = isFilters ? `(${DEFAULT_RANGE.join()})` : "";

  const currentSearchParams = useSearchParams();
  const selectedFilter = currentSearchParams.getAll(param_key);

  function onClick(name: string) {
    const item = selectedFilter.find((e) => e.includes(name));
    manageSearchParameters(
      param_key,
      name + defaultRange,
      item,
      currentSearchParams,
      router,
    );
  }

  return (
    <ResponsiveWrapper title={t(`${param_key}.name`)}>
      <ItemsSelector
        items={data}
        emptyText={t("filterNotFound")}
        onSelect={(currentValue, key) => {
          onClick(key);
        }}
        checkIconStyle={selectedFilter.map((e) => extractWord(e))}
      />
    </ResponsiveWrapper>
  );
};
