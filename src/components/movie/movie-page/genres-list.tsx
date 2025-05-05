"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import type { MovieGenre, MovieSubgenre } from "@/orval_api/model";
import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import { percentageMatchColor } from "../utils";
import { movieComponents } from "@/lib/constants";

type Props = {
  genres: MovieGenre[];
  subgenres?: MovieSubgenre[];
};

export const GenresList = ({ genres, subgenres }: Props) => {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const [hoveredSubgenre, setHoveredSubgenre] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-4" aria-label="genres-list">
      <div className="">
        <div className="flex items-center gap-1">
          <p className="base-neon-text movie-genre-text text-xl">Genres</p>

          <TooltipWrapper content={movieComponents.genre}>
            <InfoIcon className="h-4 w-4" />
          </TooltipWrapper>
        </div>

        <div className="flex flex-wrap gap-4">
          {genres.map((genre) => (
            <Link
              key={genre.key}
              href={`/super-search/?genre=${genre.key}`}
              className={cn(
                "hover:shadow-neon-border-fill relative flex h-max w-max items-center rounded-xl border-2 transition-shadow dark:border-[#4A3AFF]",
                hoveredSubgenre === genre.key && "shadow-neon-border-fill",
              )}
              onMouseEnter={() => setHoveredGenre(genre.key)}
              onMouseLeave={() => setHoveredGenre(null)}
            >
              <div
                style={{ width: `${genre.percentage_match}%` }}
                className="neon-border absolute size-full rounded-lg border dark:border-[#4A3AFF]"
              />

              <div className="relative mx-auto flex items-center gap-2 p-2">
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
      </div>

      {!!subgenres?.length && (
        <div className="">
          <div className="flex items-center gap-1">
            <p className="base-neon-text movie-subgenre-text text-xl">
              Subgenres
            </p>

            <TooltipWrapper content={movieComponents.subgenre}>
              <InfoIcon className="h-4 w-4" />
            </TooltipWrapper>
          </div>

          <div className="flex flex-wrap gap-4">
            {subgenres?.map((subgenre) => (
              <Link
                href={`/super-search/?genre=${subgenre.parent_genre.key}&subgenre=${subgenre.key}`}
                className={cn(
                  "hover:shadow-neon-border-fill relative flex items-center rounded-xl border-2 transition-shadow dark:border-[#9d4eff]",
                  hoveredGenre === subgenre.parent_genre.key &&
                    "shadow-neon-border-fill",
                )}
                key={subgenre.key}
                onMouseEnter={() =>
                  setHoveredSubgenre(subgenre.parent_genre.key)
                }
                onMouseLeave={() => setHoveredSubgenre(null)}
              >
                <div
                  style={{ width: `${subgenre.percentage_match}%` }}
                  className="neon-subgenre absolute size-full rounded-lg border dark:border-[#9d4eff]"
                />

                <div className="relative mx-auto flex items-center gap-2 p-2">
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
      )}
    </div>
  );
};
