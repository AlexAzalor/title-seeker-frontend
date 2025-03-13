"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { EXACT_MATCH, GENRE, SUBGENRE } from "./genres";
import { ACTION_TIME, KEYWORD, SPEC } from "./filter-fetch-wrapper";
import { ACTOR } from "./actors";
import { DIRECTOR } from "./director";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { modifyGenresSearchParams } from "@/lib/utils";

import {
  ActionTimeOut,
  ActorOut,
  DirectorOut,
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
  actors: ActorOut[];
  directors: DirectorOut[];
};

export const SelectedFilters = ({
  children,
  genres,
  subgenres,
  specifications,
  keywords,
  action_times,
  actors,
  directors,
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

            <FilterBrick
              type={SPEC}
              searchParamsList={currentSelectedSpecifications}
              data={specifications}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={KEYWORD}
              searchParamsList={currentSelectedKeywords}
              data={keywords}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={ACTION_TIME}
              searchParamsList={currentSelectedActionTimes}
              data={action_times}
              deleteItem={deleteSearchParam}
            />

            <FilterBrick
              type={ACTOR}
              searchParamsList={currentSelectedActors}
              data={actors}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={DIRECTOR}
              searchParamsList={currentSelectedDirectors}
              data={directors}
              deleteItem={deleteSearchParam}
            />

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
