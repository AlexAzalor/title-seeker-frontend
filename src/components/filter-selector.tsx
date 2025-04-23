"use client";

import { ActionTimeOut, KeywordOut, SpecificationOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";

import {
  DEFAULT_RANGE,
  extractWord,
  manageSearchParameters,
} from "@/lib/utils";
import { ResponsiveWrapper } from "./movie/ui/responsive-wrapper";

type Props = {
  data: SpecificationOut[] | KeywordOut[] | ActionTimeOut[];
  param_key: string;
  title: string;
};

export const FilterSelector = ({ data, param_key, title }: Props) => {
  const router = useRouter();

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
    <ResponsiveWrapper title={title}>
      <ItemsListSelector
        title={title}
        items={data}
        emptyText="Nothing found"
        onSelect={(currentValue, key, genre) => {
          onClick(genre.key);
        }}
        checkIconStyle={selectedFilter.map((e) => extractWord(e))}
      />
    </ResponsiveWrapper>
  );
};
