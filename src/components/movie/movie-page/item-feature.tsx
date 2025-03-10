"use client";

import Link from "next/link";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { percentageMatchColor } from "../utils";
import {
  MovieActionTime,
  MovieKeyword,
  MovieSpecification,
} from "@/orval_api/model";
import { TooltipWrapper } from "@/components/custom/tooltip-wrapper";
import { movieComponents } from "@/lib/constants";

type QueryKeys = "specification_name" | "keyword_name" | "action_time_name";

type Props = {
  data: MovieSpecification[] | MovieKeyword[] | MovieActionTime[];
  queryKey: QueryKeys;
  color: string;
  title: string;
};

export const ItemFeature = ({ data, queryKey, color, title }: Props) => {
  const tooltipContent =
    queryKey === "specification_name"
      ? movieComponents.specification
      : queryKey === "keyword_name"
        ? movieComponents.keyword
        : movieComponents.actionTime;
  return (
    <div>
      <div className="flex gap-4">
        <div className="flex items-center gap-1">
          <p
            className={cn(
              "base-neon-text text-2xl",
              queryKey === "specification_name" && "movie-spec-text",
              queryKey === "keyword_name" && "movie-keywords-text",
              queryKey === "action_time_name" && "movie-act-time-text",
            )}
          >
            {title}
          </p>

          <TooltipWrapper content={tooltipContent}>
            <InfoIcon className="h-4 w-4" />
          </TooltipWrapper>
        </div>

        {data.map((item) => (
          <Link
            href={`/super-search/?${queryKey}=${item.key}`}
            className={cn(
              "relative flex min-h-14 min-w-28 items-center rounded-xl border-2 transition-shadow",
              queryKey === "specification_name" &&
                "hover:shadow-movie-specification dark:border-[#64fcfe]",
              queryKey === "keyword_name" &&
                "hover:shadow-movie-keyword dark:border-[#FFC55C]",
              queryKey === "action_time_name" &&
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
                queryKey === "specification_name" && "dark:border-[#64fcfe]",
                queryKey === "action_time_name" && "dark:border-[#92A8D1]",
                queryKey === "keyword_name" && "dark:border-[#FFC55C]",
              )}
            />
            <div className="relative mx-auto flex items-center gap-2 px-2">
              <span>{item.name}</span>
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
