"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EXACT_MATCH, GENRE, SUBGENRE } from "./genres";
import { ACTION_TIME, KEYWORD, SPEC } from "./filter-fetch-wrapper";
import { ACTOR } from "./actors";
import { DIRECTOR } from "./director";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { cn, modifyGenresSearchParams } from "@/lib/utils";
import { TooltipWrapper } from "./custom/tooltip-wrapper";
import { CircleX, InfoIcon } from "lucide-react";
import { GenreOutPlus, SubgenreOutPlus } from "@/orval_api/model";
import { percentageMatchColor } from "./movie/utils";
import { cleanString, extractValues } from "./super-search/enhance-search";

type Props = {
  genres: GenreOutPlus[];
  subgenres: SubgenreOutPlus[];
  children: React.ReactNode;
};

export const SelectedFilters = ({ children, genres, subgenres }: Props) => {
  const router = useRouter();

  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const [hoveredSubgenre, setHoveredSubgenre] = useState<string | null>(null);

  const currentSearchParams = useSearchParams();
  const currentSelectedGenres = currentSearchParams.getAll(GENRE);
  const currentSelectedSubgenres = currentSearchParams.getAll(SUBGENRE);
  const currentSelectedSpecifications = currentSearchParams.getAll(SPEC);
  const currentSelectedKeywords = currentSearchParams.getAll(KEYWORD);
  const currentSelectedActionTimes = currentSearchParams.getAll(ACTION_TIME);
  const currentSelectedActors = currentSearchParams.getAll(ACTOR);
  const currentSelectedDirectors = currentSearchParams.getAll(DIRECTOR);
  const currentExactMatch = currentSearchParams.get(EXACT_MATCH);

  const deleteSubgenres = (
    genre: string,
    updatedSearchParams: URLSearchParams,
  ) => {
    if (subgenres.length) {
      const filtredSubgenres = subgenres.filter((subgenre) =>
        genre.includes(subgenre.parent_genre_key),
      );

      if (filtredSubgenres.length) {
        for (const subgenre of filtredSubgenres) {
          const subgenreKey = currentSelectedSubgenres.find((e) =>
            e.includes(subgenre.key),
          );

          if (subgenreKey) {
            updatedSearchParams.delete(SUBGENRE, subgenreKey);
          }
        }
      }
    }
  };

  const deleteGenre = (genre: string, type: string) => {
    modifyGenresSearchParams(
      type,
      genre,
      genre,
      currentSearchParams,
      router,
      deleteSubgenres,
    );
  };

  return (
    <>
      <ResizablePanel defaultSize={4}>
        <div className="col-span-3 min-h-25 w-full">
          <h1 className="mb-3 text-center text-5xl">Advanced title search</h1>

          <div className="flex flex-wrap justify-center gap-2">
            {currentSelectedGenres.map((g) => {
              const genre = cleanString(g);
              const genreData = genres.find((g) => g.key === genre);
              if (!genreData) {
                return null;
              }

              const genrePM = extractValues(g);

              return (
                <div
                  key={genre}
                  className={cn(
                    "hover:shadow-neon-border-fill relative flex min-h-10 min-w-28 items-center rounded-xl border-2 transition-shadow dark:border-[#4A3AFF]",
                    hoveredSubgenre === genre && "shadow-neon-border-fill",
                  )}
                  onMouseEnter={() => setHoveredGenre(genre)}
                  onMouseLeave={() => setHoveredGenre(null)}
                >
                  <div
                    style={{
                      minWidth: `${genrePM[0]}%`,
                      maxWidth: `${genrePM[1]}%`,
                    }}
                    className="neon-border absolute size-full rounded-lg border dark:border-[#4A3AFF]"
                  />

                  <div className="relative mx-auto flex items-center gap-2 px-1">
                    <span>{genre}</span>
                    <TooltipWrapper
                      asChild
                      content={percentageMatchColor(50, genreData.description)}
                    >
                      <InfoIcon className="h-4 w-4" />
                    </TooltipWrapper>
                  </div>

                  <CircleX
                    className="absolute top-0 right-0 h-6 w-6 cursor-pointer"
                    onClick={() => deleteGenre(g, GENRE)}
                  />
                </div>
              );
            })}
            {currentSelectedSubgenres.map((subg) => {
              const subgenre = cleanString(subg);
              const subgenreData = subgenres.find((s) => s.key === subgenre);
              if (!subgenreData) {
                return null;
              }

              return (
                <div
                  className={cn(
                    "hover:shadow-neon-border-fill relative flex min-h-14 min-w-28 items-center rounded-xl border-2 transition-shadow dark:border-[#9d4eff]",
                    hoveredGenre === subgenreData.parent_genre_key &&
                      "shadow-neon-border-fill",
                  )}
                  key={subgenre}
                  onMouseEnter={() =>
                    setHoveredSubgenre(subgenreData.parent_genre_key)
                  }
                  onMouseLeave={() => setHoveredSubgenre(null)}
                >
                  <div
                    style={{ width: `${subgenreData.percentage_match}%` }}
                    className="neon-subgenre absolute size-full rounded-lg border dark:border-[#9d4eff]"
                  />

                  <div className="relative mx-auto flex items-center gap-2 px-2">
                    <span>{subgenre}</span>
                    <TooltipWrapper
                      content={percentageMatchColor(
                        subgenreData.percentage_match,
                        subgenreData.description,
                      )}
                    >
                      <InfoIcon className="h-4 w-4" />
                    </TooltipWrapper>
                  </div>

                  <CircleX
                    className="absolute top-0 right-0 h-6 w-6 cursor-pointer"
                    onClick={() => deleteGenre(subg, SUBGENRE)}
                  />
                </div>
              );
            })}

            {currentSelectedSpecifications.map((spec) => (
              <div
                key={spec}
                className="flex items-center space-x-2 border-1 border-[#64fcfe] p-1 text-[#64fcfe]"
              >
                <span>{spec}</span>
                <button
                  className="cursor-pointer"
                  onClick={() => deleteGenre(spec, SPEC)}
                >
                  X
                </button>
              </div>
            ))}

            {currentSelectedKeywords.map((keyword) => (
              <div
                key={keyword}
                className="flex items-center space-x-2 border-1 border-[#FFC55C] p-1 text-[#FFC55C]"
              >
                <span>{keyword}</span>
                <button
                  className="cursor-pointer"
                  onClick={() => deleteGenre(keyword, KEYWORD)}
                >
                  X
                </button>
              </div>
            ))}

            {currentSelectedActionTimes.map((actionTime) => (
              <div
                key={actionTime}
                className="flex items-center space-x-2 border-1 border-[#92A8D1] p-1 text-[#92A8D1]"
              >
                <span>{actionTime}</span>
                <button
                  className="cursor-pointer"
                  onClick={() => deleteGenre(actionTime, ACTION_TIME)}
                >
                  X
                </button>
              </div>
            ))}

            {currentSelectedActors.map((actor) => (
              <div
                key={actor}
                className="flex items-center space-x-2 border-1 border-green-500 p-1 text-green-500"
              >
                <span>{actor}</span>
                <button
                  className="cursor-pointer"
                  onClick={() => deleteGenre(actor, ACTOR)}
                >
                  X
                </button>
              </div>
            ))}

            {currentSelectedDirectors.map((director) => (
              <div
                key={director}
                className="flex items-center space-x-2 border-1 border-red-500 p-1 text-red-500"
              >
                <span>{director}</span>
                <button
                  className="cursor-pointer"
                  onClick={() => deleteGenre(director, DIRECTOR)}
                >
                  X
                </button>
              </div>
            ))}

            {currentExactMatch && (
              <div className="flex items-center space-x-2 border-1 border-black p-1 text-black dark:border-white dark:text-white">
                <span>{currentExactMatch}</span>
                <button
                  className="cursor-pointer"
                  onClick={() => deleteGenre(currentExactMatch, EXACT_MATCH)}
                >
                  X
                </button>
              </div>
            )}
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle className="dark:bg-[#211979]" />

      {children}
    </>
  );
};
