"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { EXACT_MATCH_KEY, GENRE_KEY, SUBGENRE_KEY } from "./genres";
import { ACTION_TIME_KEY, KEYWORD_KEY, SPEC_KEY } from "./filter-fetch-wrapper";
import { ACTOR_KEY } from "./actors";
import { DIRECTOR_KEY } from "./director";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
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
import { FiltersList } from "./filters-list";
import { SideMenuPanel } from "./super-search/side-menu-panel";
import { EnhanceSearch } from "./super-search/enhance-search";

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
  const currentSelectedGenres = currentSearchParams.getAll(GENRE_KEY);
  const currentSelectedSubgenres = currentSearchParams.getAll(SUBGENRE_KEY);
  const currentSelectedSpecifications = currentSearchParams.getAll(SPEC_KEY);
  const currentSelectedKeywords = currentSearchParams.getAll(KEYWORD_KEY);
  const currentSelectedActionTimes =
    currentSearchParams.getAll(ACTION_TIME_KEY);
  const currentSelectedActors = currentSearchParams.getAll(ACTOR_KEY);
  const currentSelectedDirectors = currentSearchParams.getAll(DIRECTOR_KEY);
  const currentExactMatch = currentSearchParams.get(EXACT_MATCH_KEY);

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

          <div className="mb-2 flex justify-between">
            <SideMenuPanel side="left" type="Filters">
              <FiltersList
                {...{
                  genres,
                  subgenres,
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
              genreItemsList={currentSelectedGenres}
              subgenreItemsList={currentSelectedSubgenres}
              genres={genres}
              subgenres={subgenres}
              deleteSearchParam={deleteSearchParam}
            />

            <FilterBrick
              type={SPEC_KEY}
              searchParamsList={currentSelectedSpecifications}
              data={specifications}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={KEYWORD_KEY}
              searchParamsList={currentSelectedKeywords}
              data={keywords}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={ACTION_TIME_KEY}
              searchParamsList={currentSelectedActionTimes}
              data={action_times}
              deleteItem={deleteSearchParam}
            />

            <FilterBrick
              type={ACTOR_KEY}
              searchParamsList={currentSelectedActors}
              data={actors}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={DIRECTOR_KEY}
              searchParamsList={currentSelectedDirectors}
              data={directors}
              deleteItem={deleteSearchParam}
            />

            {currentExactMatch && (
              <div className="hover:shadow-movie-exact-match dark:hover:shadow-movie-exact-match-light flex items-center space-x-1 rounded-xl border-1 border-black p-1 font-bold text-black transition-shadow dark:border-white dark:text-white">
                <span>Exact match</span>
                <CircleX
                  className="top-0 right-0 h-4 w-4 cursor-pointer"
                  onClick={() =>
                    deleteSearchParam(currentExactMatch, EXACT_MATCH_KEY)
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
