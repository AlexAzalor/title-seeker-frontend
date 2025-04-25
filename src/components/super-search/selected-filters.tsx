"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { EXACT_MATCH_KEY, GENRE_KEY, SUBGENRE_KEY } from "./genre-selector";
import {
  ACTION_TIME_KEY,
  ACTOR_KEY,
  DIRECTOR_KEY,
  KEYWORD_KEY,
  SPEC_KEY,
} from "./filter-fetch-wrapper";

import { ResizableHandle, ResizablePanel } from "../ui/resizable";
import { manageSearchParameters } from "@/lib/utils";

import {
  ActionTimeOut,
  ActorOut,
  DirectorOut,
  GenreOut,
  KeywordOut,
  SpecificationOut,
  SubgenreOut,
} from "@/orval_api/model";

import { FilterBrick } from "./filter-brick";
import { HoverBrick } from "./hover-brick";
import { CircleX } from "lucide-react";
import { FilterList } from "./filter-list";
import { SideMenuPanel } from "./side-menu-panel";
import { EnhanceSearch } from "./enhance-search";

type Props = {
  children: React.ReactNode;
  genres: GenreOut[];
  subgenres: SubgenreOut[];
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
  const selectedGenres = currentSearchParams.getAll(GENRE_KEY);
  const selectedSubgenres = currentSearchParams.getAll(SUBGENRE_KEY);
  const selectedSpecifications = currentSearchParams.getAll(SPEC_KEY);
  const selectedKeywords = currentSearchParams.getAll(KEYWORD_KEY);
  const selectedActionTimes = currentSearchParams.getAll(ACTION_TIME_KEY);
  const selectedActors = currentSearchParams.getAll(ACTOR_KEY);
  const selectedDirectors = currentSearchParams.getAll(DIRECTOR_KEY);
  const selectedExactMatch = currentSearchParams.get(EXACT_MATCH_KEY);

  const deleteSubgenres = (genre: string, urlSearchParams: URLSearchParams) => {
    if (subgenres.length) {
      const filtredSubgenres = subgenres.filter((subgenre) =>
        genre.includes(subgenre.parent_genre_key),
      );

      if (filtredSubgenres.length) {
        for (const subgenre of filtredSubgenres) {
          const subgenreKey = selectedSubgenres.find((e) =>
            e.includes(subgenre.key),
          );

          if (subgenreKey) {
            urlSearchParams.delete(SUBGENRE_KEY, subgenreKey);
          }
        }
      }
    }
  };

  const deleteSearchParam = (value: string, key: string) => {
    manageSearchParameters(
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
      <ResizablePanel defaultSize={8}>
        <div className="col-span-3 min-h-25 w-full">
          <h1 className="mb-3 text-center lg:text-5xl">
            Advanced title search
          </h1>

          {/* for mobile */}
          <div className="mb-2 flex justify-between">
            <SideMenuPanel side="left" type="Filters">
              <FilterList
                {...{
                  genres,
                  specifications,
                  keywords,
                  action_times,
                  actors,
                  directors,
                }}
              />
            </SideMenuPanel>

            <SideMenuPanel side="right" type="Enhance Search" handleOnly>
              <EnhanceSearch />
            </SideMenuPanel>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <HoverBrick
              genreItemsList={selectedGenres}
              subgenreItemsList={selectedSubgenres}
              genres={genres}
              subgenres={subgenres}
              deleteSearchParam={deleteSearchParam}
            />

            <FilterBrick
              type={SPEC_KEY}
              searchParamsList={selectedSpecifications}
              data={specifications}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={KEYWORD_KEY}
              searchParamsList={selectedKeywords}
              data={keywords}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={ACTION_TIME_KEY}
              searchParamsList={selectedActionTimes}
              data={action_times}
              deleteItem={deleteSearchParam}
            />

            <FilterBrick
              type={ACTOR_KEY}
              searchParamsList={selectedActors}
              data={actors}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={DIRECTOR_KEY}
              searchParamsList={selectedDirectors}
              data={directors}
              deleteItem={deleteSearchParam}
            />

            {selectedExactMatch && (
              <div className="hover:shadow-movie-exact-match dark:hover:shadow-movie-exact-match-light flex items-center space-x-1 rounded-xl border-1 border-black p-1 font-bold text-black transition-shadow dark:border-white dark:text-white">
                <span>Exact match</span>
                <CircleX
                  className="top-0 right-0 h-4 w-4 cursor-pointer"
                  onClick={() =>
                    deleteSearchParam(selectedExactMatch, EXACT_MATCH_KEY)
                  }
                />
              </div>
            )}
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="dark:bg-[#211979]" />

      {children}
    </>
  );
};
