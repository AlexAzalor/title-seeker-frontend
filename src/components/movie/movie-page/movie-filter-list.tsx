"use client";

import { MovieFilterItem } from "@/orval_api/model";
import { MovieFilter } from "./movie-filter";
import {
  ACTION_TIME_KEY,
  KEYWORD_KEY,
  SPEC_KEY,
} from "@/components/super-search/filter-fetch-wrapper";

type Props = {
  movieKey: string;
  specifications: MovieFilterItem[];
  keywords: MovieFilterItem[];
  action_times: MovieFilterItem[];
};

export const MovieFilterList = ({
  movieKey,
  specifications,
  keywords,
  action_times,
}: Props) => {
  return (
    <div className="my-4 flex flex-wrap gap-4" aria-label="movie-filter-list">
      <MovieFilter
        movieKey={movieKey}
        data={specifications}
        filterKey={SPEC_KEY}
        title="Specifications"
      />

      <MovieFilter
        movieKey={movieKey}
        data={keywords}
        filterKey={KEYWORD_KEY}
        title="Keywords"
      />

      <MovieFilter
        movieKey={movieKey}
        data={action_times}
        filterKey={ACTION_TIME_KEY}
        title="Action Times"
      />
    </div>
  );
};
