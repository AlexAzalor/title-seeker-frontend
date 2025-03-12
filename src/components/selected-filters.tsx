"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { EXACT_MATCH, GENRE, SUBGENRE } from "./genres";
import { ACTION_TIME, KEYWORD, SPEC } from "./filter-fetch-wrapper";
import { ACTOR } from "./actors";
import { DIRECTOR } from "./director";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { cleanString, modifyGenresSearchParams } from "@/lib/utils";

import {
  ActionTimeOut,
  GenreOutPlus,
  KeywordOut,
  SpecificationOut,
  SubgenreOutPlus,
} from "@/orval_api/model";

import { FilterBrick } from "./filter-brick";
import { HoverBrick } from "./hover-brick";

type Props = {
  children: React.ReactNode;
  genres: GenreOutPlus[];
  subgenres: SubgenreOutPlus[];
  specifications: SpecificationOut[];
  keywords: KeywordOut[];
  action_times: ActionTimeOut[];
};

export const SelectedFilters = ({
  children,
  genres,
  subgenres,
  specifications,
  keywords,
  action_times,
}: Props) => {
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

  const deleteSubgenres = (genre: string, urlSearchParams: URLSearchParams) => {
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
            urlSearchParams.delete(SUBGENRE, subgenreKey);
          }
        }
      }
    }
  };

  const deleteSearchParam = (value: string, key: string) => {
    modifyGenresSearchParams(
      key,
      value,
      value,
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
            <HoverBrick
              genreItemsList={currentSelectedGenres}
              subgenreItemsList={currentSelectedSubgenres}
              genres={genres}
              subgenres={subgenres}
              deleteSearchParam={deleteSearchParam}
            />

            {currentSelectedSpecifications.map((spec) => {
              const specification = cleanString(spec);
              const sData = specifications.find((g) => g.key === specification);
              if (!sData) {
                return null;
              }

              return (
                <FilterBrick
                  key={spec}
                  type={SPEC}
                  searchParam={spec}
                  deleteItem={deleteSearchParam}
                  itemData={sData}
                />
              );
            })}

            {currentSelectedKeywords.map((k) => {
              const keyword = cleanString(k);
              const kData = keywords.find((g) => g.key === keyword);
              if (!kData) {
                return null;
              }

              return (
                <FilterBrick
                  key={k}
                  type={KEYWORD}
                  searchParam={k}
                  deleteItem={deleteSearchParam}
                  itemData={kData}
                />
              );
            })}

            {currentSelectedActionTimes.map((a) => {
              const actionTime = cleanString(a);
              const aData = action_times.find((g) => g.key === actionTime);
              if (!aData) {
                return null;
              }

              return (
                <FilterBrick
                  key={a}
                  type={ACTION_TIME}
                  searchParam={a}
                  deleteItem={deleteSearchParam}
                  itemData={aData}
                />
              );
            })}

            {currentSelectedActors.map((actor) => (
              <div
                key={actor}
                className="flex items-center space-x-2 border-1 border-green-500 p-1 text-green-500"
              >
                <span>{actor}</span>
                <button
                  className="cursor-pointer"
                  onClick={() => deleteSearchParam(actor, ACTOR)}
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
                  onClick={() => deleteSearchParam(director, DIRECTOR)}
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
                  onClick={() =>
                    deleteSearchParam(currentExactMatch, EXACT_MATCH)
                  }
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
