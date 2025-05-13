"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { InfoIcon } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import { CustomModal } from "../../my-custom-ui/custom-modal";
import { getFilterColor, percentageMatchColor } from "../utils";
import { FilterItemOut, MovieFilterItem } from "@/orval_api/model";
import { movieComponents } from "@/lib/constants";

import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import {
  ACTION_TIME_KEY,
  KEYWORD_KEY,
  SPEC_KEY,
} from "@/components/super-search/filter-fetch-wrapper";
import { Button } from "@/components/ui/button";
import {
  getActionTimes,
  getKeywords,
  getSpecifications,
} from "@/app/services/admin-api";
import { FilterEditForm } from "./filter-edit-form";
import {
  GENRE_KEY,
  SUBGENRE_KEY,
} from "@/components/super-search/genre-selector";

type QueryKeys =
  | typeof GENRE_KEY
  | typeof SUBGENRE_KEY
  | typeof SPEC_KEY
  | typeof KEYWORD_KEY
  | typeof ACTION_TIME_KEY;

type Props = {
  movieKey: string;
  data: MovieFilterItem[];
  queryKey: QueryKeys;
  title: string;
  onMouseEnter?: (key: string) => void;
  onMouseLeave?: (key: null) => void;
  hoveredGenre?: string | null;
  hoveredSubgenre?: string | null;
};

export const MovieFilter = ({
  movieKey,
  data,
  queryKey,
  title,
  onMouseEnter,
  onMouseLeave,
  hoveredGenre,
  hoveredSubgenre,
}: Props) => {
  const session = useSession();
  const { isOpen, open, close } = useModal();
  const [filterData, setFilterData] = useState<FilterItemOut[]>([]);

  const color = useMemo(() => {
    return getFilterColor(queryKey);
  }, [queryKey]);

  const getFilterData = async () => {
    if (queryKey === SPEC_KEY) {
      const res = await getSpecifications();

      if (Array.isArray(res)) {
        setFilterData(res);
      }
    }

    if (queryKey === KEYWORD_KEY) {
      const res = await getKeywords();

      if (Array.isArray(res)) {
        setFilterData(res);
      }
    }

    if (queryKey === ACTION_TIME_KEY) {
      const res = await getActionTimes();

      if (Array.isArray(res)) {
        setFilterData(res);
      }
    }
  };

  const handleEdit = () => {
    open();
    getFilterData();
  };

  return (
    <>
      <div>
        <div className="flex items-center gap-1">
          <p
            className={cn(
              "base-neon-text text-xl",
              queryKey === GENRE_KEY && "movie-genre-text",
              queryKey === SUBGENRE_KEY && "movie-subgenre-text",
              queryKey === SPEC_KEY && "movie-spec-text",
              queryKey === KEYWORD_KEY && "movie-keywords-text",
              queryKey === ACTION_TIME_KEY && "movie-act-time-text",
            )}
          >
            {title}
          </p>
          <TooltipWrapper content={movieComponents[queryKey]}>
            <InfoIcon className="h-4 w-4" />
          </TooltipWrapper>

          {session.data?.user.role === "owner" &&
            [SPEC_KEY, KEYWORD_KEY, ACTION_TIME_KEY].includes(queryKey) && (
              <Button variant="link" className="h-7 p-0" onClick={handleEdit}>
                Edit
              </Button>
            )}
        </div>

        <div className="flex flex-wrap gap-4">
          {data.map((item) => (
            <Link
              href={
                !item.parent_genre?.key
                  ? `/super-search/?${queryKey}=${item.key}`
                  : `/super-search/?genre=${item.parent_genre?.key}&subgenre=${item.key}`
              }
              className={cn(
                "relative flex max-w-fit items-center rounded-xl border-2 leading-4 transition-shadow",
                queryKey === GENRE_KEY &&
                  "hover:shadow-neon-border-fill dark:border-main-ui-purple",
                queryKey === SUBGENRE_KEY &&
                  "hover:shadow-neon-border-fill dark:border-subgenre",
                queryKey === SPEC_KEY &&
                  "hover:shadow-movie-specification dark:border-specification",
                queryKey === KEYWORD_KEY &&
                  "hover:shadow-movie-keyword dark:border-keyword",
                queryKey === ACTION_TIME_KEY &&
                  "hover:shadow-movie-action-time dark:border-action-time",
                queryKey === GENRE_KEY &&
                  hoveredSubgenre === item.key &&
                  "shadow-neon-border-fill",
                queryKey === SUBGENRE_KEY &&
                  hoveredGenre === item.parent_genre?.key &&
                  "shadow-neon-border-fill",
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
                  queryKey === GENRE_KEY &&
                    "genre-fill-brick dark:border-main-ui-purple",
                  queryKey === SUBGENRE_KEY &&
                    "subgenre-fill-brick dark:border-subgenre",
                  queryKey === SPEC_KEY && "dark:border-specification",
                  queryKey === KEYWORD_KEY && "dark:border-keyword",
                  queryKey === ACTION_TIME_KEY && "dark:border-action-time",
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
      </div>

      <Suspense>
        <CustomModal isOpen={isOpen} onClose={close}>
          <div className="mb-2 flex items-center justify-center gap-2">
            <p
              className={cn(
                "base-neon-text text-2xl",
                queryKey === SPEC_KEY && "movie-spec-text",
                queryKey === KEYWORD_KEY && "movie-keywords-text",
                queryKey === ACTION_TIME_KEY && "movie-act-time-text",
              )}
            >
              {title}
            </p>
            <TooltipWrapper content={movieComponents[queryKey]}>
              <InfoIcon className="h-4 w-4" />
            </TooltipWrapper>
          </div>
          <FilterEditForm
            movieKey={movieKey}
            filterItems={filterData}
            selectedFilterItems={data}
            filterType={queryKey}
          />
        </CustomModal>
      </Suspense>
    </>
  );
};
