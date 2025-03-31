"use client";

import Link from "next/link";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFilterColor, percentageMatchColor } from "../utils";
import {
  MovieActionTime,
  MovieKeyword,
  MovieSpecification,
} from "@/orval_api/model";
import { TooltipWrapper } from "@/components/custom/tooltip-wrapper";
import { movieComponents } from "@/lib/constants";
import { ACTION_TIME, KEYWORD, SPEC } from "@/components/filter-fetch-wrapper";
import { useMemo } from "react";

type QueryKeys = typeof SPEC | typeof KEYWORD | typeof ACTION_TIME;

type Props = {
  data: MovieSpecification[] | MovieKeyword[] | MovieActionTime[];
  queryKey: QueryKeys;
  title: string;
};

export const ItemFeature = ({ data, queryKey, title }: Props) => {
  const tooltipContent =
    queryKey === SPEC
      ? movieComponents.specification
      : queryKey === KEYWORD
        ? movieComponents.keyword
        : movieComponents.actionTime;

  const color = useMemo(() => {
    return getFilterColor(queryKey);
  }, [queryKey]);
  // flex flex-col items-start gap-4 lg:flex-row lg:items-center
  return (
    <div className="">
      <div className="flex items-center gap-1">
        <p
          className={cn(
            "base-neon-text text-xl",
            queryKey === SPEC && "movie-spec-text",
            queryKey === KEYWORD && "movie-keywords-text",
            queryKey === ACTION_TIME && "movie-act-time-text",
          )}
        >
          {title}
        </p>
        <TooltipWrapper content={tooltipContent}>
          <InfoIcon className="h-4 w-4" />
        </TooltipWrapper>
      </div>

      <div className="flex flex-wrap gap-4">
        {data.map((item) => (
          <Link
            href={`/super-search/?${queryKey}=${item.key}`}
            className={cn(
              "relative flex max-w-fit items-center rounded-xl border-2 leading-4 transition-shadow",
              queryKey === SPEC &&
                "hover:shadow-movie-specification dark:border-[#64fcfe]",
              queryKey === KEYWORD &&
                "hover:shadow-movie-keyword dark:border-[#FFC55C]",
              queryKey === ACTION_TIME &&
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
                queryKey === SPEC && "dark:border-[#64fcfe]",
                queryKey === KEYWORD && "dark:border-[#FFC55C]",
                queryKey === ACTION_TIME && "dark:border-[#92A8D1]",
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
  );
};
