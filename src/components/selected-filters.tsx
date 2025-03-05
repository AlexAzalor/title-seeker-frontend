"use client";

import { PropsWithChildren } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EXACT_MATCH, GENRE, SUBGENRE } from "./genres";
import { ACTION_TIME, KEYWORD, SPEC } from "./filter-fetch-wrapper";
import { ACTOR } from "./actors";
import { DIRECTOR } from "./director";

export const SelectedFilters = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  const currentSearchParams = useSearchParams();
  const currentSelectedGenres = currentSearchParams.getAll(GENRE);
  const currentSelectedSubgenres = currentSearchParams.getAll(SUBGENRE);
  const currentSelectedSpecifications = currentSearchParams.getAll(SPEC);
  const currentSelectedKeywords = currentSearchParams.getAll(KEYWORD);
  const currentSelectedActionTimes = currentSearchParams.getAll(ACTION_TIME);
  const currentSelectedActors = currentSearchParams.getAll(ACTOR);
  const currentSelectedDirectors = currentSearchParams.getAll(DIRECTOR);
  const currentExactMatch = currentSearchParams.get(EXACT_MATCH);

  const deleteGenre = (genre: string, type: string) => {
    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );

    updatedSearchParams.delete(type, genre);

    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    router.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  };

  return (
    <>
      <div className="col-span-3 min-h-25 w-full">
        <h1 className="text-center">Selected filters</h1>

        <div className="flex flex-wrap justify-center gap-2">
          {currentSelectedGenres.map((genre) => (
            <div
              key={genre}
              className="flex items-center space-x-2 border-1 border-[#4A3AFF] p-1 text-[#4A3AFF]"
            >
              <span>{genre}</span>
              <button onClick={() => deleteGenre(genre, GENRE)}>X</button>
            </div>
          ))}
          {currentSelectedSubgenres.map((subgenre) => (
            <div
              key={subgenre}
              className="flex items-center space-x-2 border-1 border-[#9d4eff] p-1 text-[#9d4eff]"
            >
              <span>{subgenre}</span>
              <button
                className="cursor-pointer"
                onClick={() => deleteGenre(subgenre, SUBGENRE)}
              >
                X
              </button>
            </div>
          ))}
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
      {children}
    </>
  );
};
