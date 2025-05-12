"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { InfoIcon, X } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import { CustomModal } from "../../my-custom-ui/custom-modal";
import { getFilterColor, percentageMatchColor } from "../utils";
import {
  MovieActionTime,
  MovieKeyword,
  MovieSpecification,
  FilterItemOut,
} from "@/orval_api/model";
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

type QueryKeys = typeof SPEC_KEY | typeof KEYWORD_KEY | typeof ACTION_TIME_KEY;

type Props = {
  movieKey: string;
  data: MovieSpecification[] | MovieKeyword[] | MovieActionTime[];
  queryKey: QueryKeys;
  title: string;
};

export const MovieFilter = ({ movieKey, data, queryKey, title }: Props) => {
  const session = useSession();
  const { isOpen, open, close } = useModal();
  const [filterData, setFilterData] = useState<FilterItemOut[]>([]);

  const tooltipContent =
    queryKey === SPEC_KEY
      ? movieComponents.specification
      : queryKey === KEYWORD_KEY
        ? movieComponents.keyword
        : movieComponents.actionTime;

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
      <div className="">
        <div className="flex items-center gap-1">
          <p
            className={cn(
              "base-neon-text text-xl",
              queryKey === SPEC_KEY && "movie-spec-text",
              queryKey === KEYWORD_KEY && "movie-keywords-text",
              queryKey === ACTION_TIME_KEY && "movie-act-time-text",
            )}
          >
            {title}
          </p>
          <TooltipWrapper content={tooltipContent}>
            <InfoIcon className="h-4 w-4" />
          </TooltipWrapper>

          {session.data?.user.role === "owner" && (
            <Button variant="link" className="h-7 p-0" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          {data.map((item) => (
            <Link
              href={`/super-search/?${queryKey}=${item.key}`}
              className={cn(
                "relative flex max-w-fit items-center rounded-xl border-2 leading-4 transition-shadow",
                queryKey === SPEC_KEY &&
                  "hover:shadow-movie-specification dark:border-[#64fcfe]",
                queryKey === KEYWORD_KEY &&
                  "hover:shadow-movie-keyword dark:border-[#FFC55C]",
                queryKey === ACTION_TIME_KEY &&
                  "hover:shadow-movie-action-time dark:border-[#92A8D1]",
              )}
              key={item.key}
              style={{}}
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
                  queryKey === SPEC_KEY && "dark:border-[#64fcfe]",
                  queryKey === KEYWORD_KEY && "dark:border-[#FFC55C]",
                  queryKey === ACTION_TIME_KEY && "dark:border-[#92A8D1]",
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
          <X
            onClick={close}
            className="ml-auto h-4 w-4 cursor-pointer hover:scale-110"
          />
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
            <TooltipWrapper content={tooltipContent}>
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
