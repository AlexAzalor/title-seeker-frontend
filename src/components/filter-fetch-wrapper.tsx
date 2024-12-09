import { Language } from "@/orval_api/model";
import { getLocale } from "next-intl/server";
import { backendURL } from "@/lib/constants";
import { getMovies } from "@/orval_api/movies/movies";

import { Genres } from "./genres";
import { Actors } from "./actors";
import { Directors } from "./director";
import { PropsWithChildren } from "react";

export const FilterFetchWrapper = async ({ children }: PropsWithChildren) => {
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetMovieFilters } = getMovies();

  const {
    data: { genres, actors, directors },
  } = await aPIGetMovieFilters({ lang }, backendURL);

  return (
    <div className="flex justify-between gap-6">
      <Genres genres={genres} />

      <Actors actors={actors} />

      <Directors directors={directors} />

      {children}
    </div>
  );
};
