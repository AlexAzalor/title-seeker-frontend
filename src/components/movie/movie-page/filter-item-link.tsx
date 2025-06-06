"use client";

import { useMemo, use } from "react";
import Link from "next/link";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFilterColor, percentageMatchColor } from "../utils";

import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import {
  ACTION_TIME_KEY,
  KEYWORD_KEY,
  SPEC_KEY,
} from "@/components/super-search/filter-fetch-wrapper";
import {
  GENRE_KEY,
  SUBGENRE_KEY,
} from "@/components/super-search/genre-selector";
import { FilterEnum, MovieFilterItem } from "@/orval_api/model";
import { GenreContext } from "./genres-list";

type Props = {
  filterKey: FilterEnum;
  data: MovieFilterItem[];
};

export const FilterItemLink = ({ filterKey, data }: Props) => {
  const { hoveredGenre, hoveredSubgenre, onMouseEnter, onMouseLeave } =
    use(GenreContext);
  const color = useMemo(() => {
    return getFilterColor(filterKey);
  }, [filterKey]);

  return (
    <div aria-label="filter-item-link" className="flex flex-wrap gap-4">
      {data.map((item) => (
        <Link
          href={
            !item.subgenre_parent_key
              ? `/super-search/?${filterKey}=${item.key}`
              : `/super-search/?genre=${item.subgenre_parent_key}&subgenre=${item.key}`
          }
          className={cn(
            "relative flex max-w-fit items-center rounded-xl border-2 leading-4 transition-shadow",
            filterKey === GENRE_KEY &&
              "hover:shadow-genre dark:border-genre hover:border-genre",
            filterKey === SUBGENRE_KEY &&
              "hover:shadow-subgenre dark:border-subgenre hover:border-subgenre",
            filterKey === SPEC_KEY &&
              "hover:shadow-specification dark:border-specification hover:border-specification",
            filterKey === KEYWORD_KEY &&
              "hover:shadow-keyword dark:border-keyword hover:border-keyword",
            filterKey === ACTION_TIME_KEY &&
              "hover:shadow-action-time dark:border-action-time hover:border-action-time",
            filterKey === GENRE_KEY &&
              hoveredSubgenre === item.key &&
              "shadow-genre border-genre",
            filterKey === SUBGENRE_KEY &&
              hoveredGenre === item.subgenre_parent_key &&
              "shadow-subgenre border-subgenre",
          )}
          key={item.key}
          style={{}}
          onMouseEnter={
            onMouseEnter
              ? () => onMouseEnter(item.subgenre_parent_key || item.key)
              : undefined
          }
          onMouseLeave={onMouseLeave ? () => onMouseLeave(null) : undefined}
        >
          <div
            style={{
              width: `${item.percentage_match}%`,
              borderColor: color,
              boxShadow: `0px 0px 0px 0px ${color}, 0 0 10px ${color}, 0 0 6px ${color}, inset 0 0 12px ${color}`,
              background: color + "66",
            }}
            className="absolute size-full rounded-lg border"
          />
          <div className="relative mx-auto flex items-center gap-2 p-2">
            <span className="max-w-44">{item.name}</span>
            <TooltipWrapper
              content={percentageMatchColor(
                item.percentage_match,
                item.description,
              )}
            >
              <InfoIcon className="h-4 w-4" />
            </TooltipWrapper>
          </div>
        </Link>
      ))}
    </div>
  );
};
