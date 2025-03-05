import { PropsWithChildren } from "react";
import { Language } from "@/orval_api/model";
import { getLocale } from "next-intl/server";
import { backendURL } from "@/lib/constants";
import { getMovies } from "@/orval_api/movies/movies";

import { Genres } from "./genres";
import { Actors } from "./actors";
import { Directors } from "./director";
import { MovieFilters } from "./movie-filters";
import { SelectedFilters } from "./selected-filters";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea } from "./ui/scroll-area";

export const SPEC = "specification_name";
export const KEYWORD = "keyword_name";
export const ACTION_TIME = "action_time_name";

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
    },
  } = await aPIGetMovieFilters({ lang }, backendURL);

  // "grid grid-cols-[minmax(200px,1fr)_minmax(1240px,2fr)_minmax(200px,1fr)] grid-rows-[auto_1fr] justify-items-center gap-4 p-4"
  return (
    <div className="h-screen w-full">
      <ResizablePanelGroup
        direction="vertical"
        className="rounded-lg p-4"
        autoSaveId="super-search"
      >
        <SelectedFilters>
          <ResizablePanel defaultSize={50} className="">
            <ResizablePanelGroup
              direction="horizontal"
              className="dark:border-[#211979]"
              autoSaveId="super-search-body"
            >
              <ResizablePanel defaultSize={25} className="flex justify-center">
                <div className="overflow-auto">
                  <Genres genres={genres} subgenres={subgenres} />

                  <MovieFilters
                    title="Specification"
                    data={specifications}
                    param_key={SPEC}
                  />
                  <MovieFilters
                    title="Keyword"
                    data={keywords}
                    param_key={KEYWORD}
                  />
                  <MovieFilters
                    title="Action Time"
                    data={action_times}
                    param_key={ACTION_TIME}
                  />

                  <Actors actors={actors} />

                  <Directors directors={directors} />
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle className="dark:bg-[#211979]" />

              <ResizablePanel defaultSize={52}>
                <ScrollArea type="auto" className="h-full rounded-md">
                  {children}
                </ScrollArea>
              </ResizablePanel>

              <ResizableHandle withHandle className="dark:bg-[#211979]" />

              <ResizablePanel defaultSize={25} className="flex justify-center">
                <div className="overflow-auto">
                  <h1>Other filters</h1>
                  <div>filter one</div>
                  <div>filter two</div>
                  <div>filter three</div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </SelectedFilters>
      </ResizablePanelGroup>
    </div>
  );
};
