import { Language } from "@/orval_api/model";
import { getLocale } from "next-intl/server";
import { backendURL } from "@/lib/constants";
import { getMovies } from "@/orval_api/movies/movies";

import { Genres } from "./genres";
import { Actors } from "./actors";
import { Directors } from "./director";
import { PropsWithChildren } from "react";
import { MovieFilters } from "./movie-filters";

export const FilterFetchWrapper = async ({ children }: PropsWithChildren) => {
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetMovieFilters } = getMovies();

  const {
    data: { genres, actors, directors, specifications, keywords, action_times },
  } = await aPIGetMovieFilters({ lang }, backendURL);

  return (
    <div className="flex justify-between gap-6">
      <Genres genres={genres} />

      <MovieFilters data={specifications} param_key="specification_name" />
      <MovieFilters data={keywords} param_key="keyword_name" />
      <MovieFilters data={action_times} param_key="action_time_name" />

      <Actors actors={actors} />

      <Directors directors={directors} />

      {children}
    </div>
  );
};
