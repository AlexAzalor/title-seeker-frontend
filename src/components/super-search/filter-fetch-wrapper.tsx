import { PropsWithChildren } from "react";
import { Language } from "@/orval_api/model";
import { getLocale } from "next-intl/server";
import { backendURL } from "@/lib/constants";
import { getMovies } from "@/orval_api/movies/movies";

import { SelectedFilters } from "./selected-filters";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { ScrollArea } from "../ui/scroll-area";
import { EnhanceSearch } from "./enhance-search";
import { FilterList } from "./filter-list";

export const FilterFetchWrapper = async ({ children }: PropsWithChildren) => {
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetMovieFilters } = getMovies();

  const {
    data: {
      genres,
      subgenres,
      actors,
      directors,
      specifications,
      keywords,
      action_times,
      shared_universes,
      visual_profile_categories,
    },
  } = await aPIGetMovieFilters({ lang }, backendURL);

  // do calculations on server side

  // "grid grid-cols-[minmax(200px,1fr)_minmax(1240px,2fr)_minmax(200px,1fr)] grid-rows-[auto_1fr] justify-items-center gap-4 p-4"

  // filter-fetch-wrapper.tsx => layout.tsx => page.tsx (movie list)
  return (
    <div className="Filter-Fetch-Wrapper h-screen w-full">
      <ResizablePanelGroup
        direction="vertical"
        className="rounded-lg p-4"
        autoSaveId="super-search"
      >
        <SelectedFilters
          genres={genres}
          subgenres={subgenres}
          specifications={specifications}
          keywords={keywords}
          action_times={action_times}
          actors={actors}
          directors={directors}
          shared_universes={shared_universes}
          visual_profile_categories={visual_profile_categories}
        >
          <ResizablePanel defaultSize={50} className="">
            <ResizablePanelGroup
              direction="horizontal"
              className="dark:border-dark-border"
              autoSaveId="super-search-body"
            >
              <ResizablePanel
                defaultSize={25}
                className="hidden justify-center p-2 lg:flex"
              >
                <FilterList
                  {...{
                    genres,
                    specifications,
                    keywords,
                    action_times,
                    actors,
                    directors,
                    shared_universes,
                    visual_profile_categories,
                  }}
                />
              </ResizablePanel>

              <ResizableHandle
                withHandle
                className="dark:bg-dark-border hidden lg:flex"
              />

              <ResizablePanel defaultSize={52}>
                <ScrollArea type="auto" className="mx-1 h-full rounded-md">
                  {children}
                </ScrollArea>
              </ResizablePanel>

              <ResizableHandle
                withHandle
                className="dark:bg-dark-border hidden lg:flex"
              />

              <ResizablePanel
                defaultSize={25}
                className="hidden justify-center lg:flex"
              >
                <EnhanceSearch />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </SelectedFilters>
      </ResizablePanelGroup>
    </div>
  );
};
