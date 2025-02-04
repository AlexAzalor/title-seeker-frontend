"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import type { MovieOut } from "@/orval_api/model";
import { TooltipWrapper } from "@/components/custom/tooltip-wrapper";
import { percentageMatchColor } from "../utils";

type Props = {
  data: MovieOut;
};

export const GenresList = ({ data }: Props) => {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const [hoveredSubgenre, setHoveredSubgenre] = useState<string | null>(null);

  return (
    <div className="my-3">
      <div className={cn("mb-4 flex gap-4")}>
        {data.genres?.map((genre) => (
          <Link
            key={genre.key}
            href={`/super-search/?genre_name=${genre.key}`}
            className={cn(
              "hover:shadow-neon-border-fill relative flex min-h-14 min-w-28 items-center rounded-xl border-2 transition-shadow dark:border-[#4A3AFF]",
              hoveredSubgenre === genre.key && "shadow-neon-border-fill",
            )}
            onMouseEnter={() => setHoveredGenre(genre.key)}
            onMouseLeave={() => setHoveredGenre(null)}
          >
            <div
              style={{ width: `${genre.percentage_match}%` }}
              className="neon-fill neon-border absolute size-full rounded-lg border dark:border-[#4A3AFF]"
            />

            <div className="relative mx-auto flex items-center gap-2 px-1">
              <span>{genre.name}</span>
              <TooltipWrapper
                asChild
                content={percentageMatchColor(
                  genre.percentage_match,
                  genre.description,
                )}
              >
                <InfoIcon className="h-4 w-4" />
              </TooltipWrapper>
            </div>
          </Link>
        ))}
      </div>

      <div className={cn("flex gap-4")}>
        {data.subgenres?.map((subgenre) => (
          <Link
            href={`/super-search/?genre_name=${subgenre.parent_genre.key}&subgenre_name=${subgenre.key}`}
            className={cn(
              "hover:shadow-neon-border-fill relative flex min-h-14 min-w-28 items-center rounded-xl border-2 transition-shadow dark:border-[#9d4eff]",
              hoveredGenre === subgenre.parent_genre.key &&
                "shadow-neon-border-fill",
            )}
            key={subgenre.key}
            onMouseEnter={() => setHoveredSubgenre(subgenre.parent_genre.key)}
            onMouseLeave={() => setHoveredSubgenre(null)}
          >
            <div
              style={{ width: `${subgenre.percentage_match}%` }}
              className="neon-fill neon-subgenre absolute size-full rounded-lg border dark:border-[#9d4eff]"
            />

            <div className="relative mx-auto flex items-center gap-2 px-2">
              <span>{subgenre.name}</span>
              <TooltipWrapper
                content={percentageMatchColor(
                  subgenre.percentage_match,
                  subgenre.description,
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
