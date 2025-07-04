"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { CircleX } from "lucide-react";
import { useSubgenreStore } from "@/lib/store";
import { extractWord, manageSearchParameters } from "@/lib/utils";

import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { EXACT_MATCH_KEY } from "@/components/super-search/genre-selector";
import { FilterBrick } from "@/components/super-search/filter-brick";
import { HoverBrick } from "@/components/super-search/hover-brick";
import { FilterList } from "@/components/super-search/filter-list";
import { EnhanceSearch } from "@/components/super-search/enhance-search";

import {
  type FilterItemOut,
  type PersonBase,
  type GenreOut,
  type SubgenreOut,
  type VisualProfileCategoryOut,
  FilterEnum,
  type BaseSharedUniverse,
} from "@/orval_api/model";

const SideMenuPanel = dynamic(() => import("./side-menu-panel"), {
  ssr: false,
});

type Props = {
  children: React.ReactNode;
  genres: GenreOut[];
  subgenres: SubgenreOut[];
  specifications: FilterItemOut[];
  keywords: FilterItemOut[];
  action_times: FilterItemOut[];
  actors: PersonBase[];
  directors: PersonBase[];
  characters: PersonBase[];
  shared_universes: BaseSharedUniverse[];
  visual_profile_categories: VisualProfileCategoryOut[];
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
  characters,
  shared_universes,
  visual_profile_categories,
}: Props) => {
  const router = useRouter();
  const t = useTranslations("SuperSearch");
  const { setSubgenres, subgenres: subgenresState } = useSubgenreStore();

  const currentSearchParams = useSearchParams();
  const selectedGenres = currentSearchParams.getAll(FilterEnum.genre);
  const selectedSubgenres = currentSearchParams.getAll(FilterEnum.subgenre);
  const selectedSpecifications = currentSearchParams.getAll(
    FilterEnum.specification,
  );
  const selectedKeywords = currentSearchParams.getAll(FilterEnum.keyword);
  const selectedActionTimes = currentSearchParams.getAll(
    FilterEnum.action_time,
  );
  const selectedActors = currentSearchParams.getAll(FilterEnum.actor);
  const selectedDirectors = currentSearchParams.getAll(FilterEnum.director);
  const selectedCharacters = currentSearchParams.getAll(FilterEnum.character);
  const selectedUniverses = currentSearchParams.getAll(
    FilterEnum.shared_universe,
  );
  const selectedExactMatch = currentSearchParams.get(EXACT_MATCH_KEY);
  const selectedVisualProfiles = currentSearchParams.getAll(
    FilterEnum.visual_profile,
  );

  const deleteSubgenres = (genre: string, urlSearchParams: URLSearchParams) => {
    setSubgenres(
      subgenresState.filter((e) => e.parent_genre_key !== extractWord(genre)),
    );

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
            urlSearchParams.delete(FilterEnum.subgenre, subgenreKey);
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
      <span aria-label="selected-filters" className="sr-only">
        Selected Filters
      </span>
      <ResizablePanel defaultSize={8}>
        <div className="col-span-3 min-h-25 w-full">
          <h1 className="mb-0 text-center text-xl sm:mb-3 sm:text-5xl">
            {t("title")}
          </h1>

          {/* for mobile */}
          <div className="mb-2 flex justify-between">
            <SideMenuPanel
              side="left"
              type={t("filters")}
              description={t("description")}
            >
              <FilterList
                {...{
                  genres,
                  specifications,
                  keywords,
                  action_times,
                  actors,
                  directors,
                  characters,
                  shared_universes,
                  visual_profile_categories,
                }}
              />
            </SideMenuPanel>

            <SideMenuPanel
              side="right"
              type={t("enhance")}
              description={t("description")}
              handleOnly
            >
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
              type={FilterEnum.specification}
              searchParamsList={selectedSpecifications}
              data={specifications}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={FilterEnum.keyword}
              searchParamsList={selectedKeywords}
              data={keywords}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={FilterEnum.action_time}
              searchParamsList={selectedActionTimes}
              data={action_times}
              deleteItem={deleteSearchParam}
            />

            <FilterBrick
              type={FilterEnum.actor}
              searchParamsList={selectedActors}
              data={actors}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={FilterEnum.director}
              searchParamsList={selectedDirectors}
              data={directors}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={FilterEnum.character}
              searchParamsList={selectedCharacters}
              data={characters}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={FilterEnum.shared_universe}
              searchParamsList={selectedUniverses}
              data={shared_universes}
              deleteItem={deleteSearchParam}
            />
            <FilterBrick
              type={FilterEnum.visual_profile}
              searchParamsList={selectedVisualProfiles}
              data={visual_profile_categories}
              deleteItem={deleteSearchParam}
            />

            {selectedExactMatch && (
              <div className="hover:shadow-exact-match dark:hover:shadow-exact-match-light flex items-center space-x-1 rounded-xl border-1 border-black p-1 font-bold text-black transition-shadow dark:border-white dark:text-white">
                <span>{t("exactMatch")}</span>
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

      <ResizableHandle withHandle className="dark:bg-dark-border" />

      {children}
    </>
  );
};
