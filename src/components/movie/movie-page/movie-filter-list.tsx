"use client";

import {
  MovieActionTime,
  MovieKeyword,
  MovieSpecification,
} from "@/orval_api/model";
import { MovieFilter } from "./movie-filter";
import {
  ACTION_TIME_KEY,
  KEYWORD_KEY,
  SPEC_KEY,
} from "@/components/super-search/filter-fetch-wrapper";

type Props = {
  movieKey: string;
  specifications: MovieSpecification[];
  keywords: MovieKeyword[];
  action_times: MovieActionTime[];
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
        queryKey={SPEC_KEY}
        title="Specifications"
      />

      <MovieFilter
        movieKey={movieKey}
        data={keywords}
        queryKey={KEYWORD_KEY}
        title="Keywords"
      />

      <MovieFilter
        movieKey={movieKey}
        data={action_times}
        queryKey={ACTION_TIME_KEY}
        title="Action Times"
      />
    </div>
  );
};
