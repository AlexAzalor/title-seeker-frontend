"use client";

import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import { SortBy, SortOrder } from "@/orval_api/model";

type Props<V> = {
  title: string;
  items: { label: string; value: V; exclude?: boolean }[];
  value: string;
  handleOrderType: (type: V) => void;
};

export const SortingItemList = <V extends SortOrder | SortBy>({
  items,
  title,
  value,
  handleOrderType,
}: Props<V>) => {
  return (
    <>
      <DropdownMenuLabel>{title}:</DropdownMenuLabel>

      <DropdownMenuRadioGroup
        value={value}
        onValueChange={(value) => handleOrderType(value as V)}
      >
        {items.map(
          (e) =>
            !e.exclude && (
              <DropdownMenuRadioItem key={e.value} value={e.value}>
                {e.label}
              </DropdownMenuRadioItem>
            ),
        )}
      </DropdownMenuRadioGroup>
    </>
  );
};
