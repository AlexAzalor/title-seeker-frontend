"use client";

import { FilterItemOut } from "@/orval_api/model";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsSelector } from "../my-custom-ui/items-list-selector";

import {
  DEFAULT_RANGE,
  extractWord,
  manageSearchParameters,
} from "@/lib/utils";
import { ResponsiveWrapper } from "../my-custom-ui/responsive-wrapper";

type Props = {
  data: FilterItemOut[];
  param_key: string;
};

export const FilterSelector = ({ data, param_key }: Props) => {
  const router = useRouter();
  const t = useTranslations("Filters");

  const currentSearchParams = useSearchParams();
  const selectedFilter = currentSearchParams.getAll(param_key);

  function onClick(name: string) {
    const item = selectedFilter.find((e) => e.includes(name));
    manageSearchParameters(
      param_key,
      name + `(${DEFAULT_RANGE.join()})`,
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
        onSelect={(currentValue, key, genre) => {
          onClick(genre.key);
        }}
        checkIconStyle={selectedFilter.map((e) => extractWord(e))}
      />
    </ResponsiveWrapper>
  );
};
