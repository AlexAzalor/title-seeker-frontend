"use client";

import { ActionTimeOut, KeywordOut, SpecificationOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";

import {
  DEFAULT_RANGE,
  extractWord,
  modifyGenresSearchParams,
} from "@/lib/utils";
import { ResponsiveWrapper } from "./movie/ui/responsive-wrapper";

type Props = {
  data: SpecificationOut[] | KeywordOut[] | ActionTimeOut[];
  param_key: string;
  title: string;
};

export const MovieFilters = ({ data, param_key, title }: Props) => {
  const router = useRouter();

  const currentSearchParams = useSearchParams();
  const currentSelectedFilter = currentSearchParams.getAll(param_key);

  function onClick(name: string) {
    const item = currentSelectedFilter.find((e) => e.includes(name));
    modifyGenresSearchParams(
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
        checkIconStyle={currentSelectedFilter.map((e) => extractWord(e))}
      />
    </ResponsiveWrapper>
  );
};
