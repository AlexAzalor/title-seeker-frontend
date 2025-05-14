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
import { MovieFilterItem } from "@/orval_api/model";
import { GenreContext } from "./genres-list";

type QueryKeys =
  | typeof GENRE_KEY
  | typeof SUBGENRE_KEY
  | typeof SPEC_KEY
  | typeof KEYWORD_KEY
  | typeof ACTION_TIME_KEY;

type Props = {
  filterKey: QueryKeys;
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
            !item.parent_genre?.key
              ? `/super-search/?${filterKey}=${item.key}`
              : `/super-search/?genre=${item.parent_genre?.key}&subgenre=${item.key}`
          }
          className={cn(
            "relative flex max-w-fit items-center rounded-xl border-2 leading-4 transition-shadow",
            filterKey === GENRE_KEY &&
              "hover:shadow-genre dark:border-main-ui-purple",
            filterKey === SUBGENRE_KEY &&
              "hover:shadow-subgenre dark:border-subgenre",
            filterKey === SPEC_KEY &&
              "hover:shadow-specification dark:border-specification",
            filterKey === KEYWORD_KEY &&
              "hover:shadow-keyword dark:border-keyword",
            filterKey === ACTION_TIME_KEY &&
              "hover:shadow-action-time dark:border-action-time",
            filterKey === GENRE_KEY &&
              hoveredSubgenre === item.key &&
              "shadow-genre",
            filterKey === SUBGENRE_KEY &&
              hoveredGenre === item.parent_genre?.key &&
              "shadow-subgenre",
          )}
          key={item.key}
          style={{}}
          onMouseEnter={
            onMouseEnter
              ? () => onMouseEnter(item.parent_genre?.key || item.key)
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
            className={cn(
              "absolute size-full rounded-lg border",
              filterKey === GENRE_KEY && "dark:border-main-ui-purple",
              filterKey === SUBGENRE_KEY && "dark:border-subgenre",
              filterKey === SPEC_KEY && "dark:border-specification",
              filterKey === KEYWORD_KEY && "dark:border-keyword",
              filterKey === ACTION_TIME_KEY && "dark:border-action-time",
            )}
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
