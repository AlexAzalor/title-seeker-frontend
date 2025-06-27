import type { MovieFilterItem } from "@/orval_api/model";
import { GenresList } from "@/components/movie/movie-page/genres-list";
import { MovieFilterList } from "@/components/movie/movie-page/movie-filter-list";

type Props = {
  movieKey: string;
  genres: MovieFilterItem[];
  subgenres?: MovieFilterItem[];
  specifications: MovieFilterItem[];
  keywords: MovieFilterItem[];
  actionTimes: MovieFilterItem[];
};

export const MovieFiltersdata = ({
  movieKey,
  genres,
  subgenres,
  specifications,
  keywords,
  actionTimes,
}: Props) => (
  <div className="mx-6">
    <GenresList
      movieKey={movieKey}
      genres={genres}
      subgenres={subgenres || []}
    />

    <MovieFilterList
      movieKey={movieKey}
      specifications={specifications}
      keywords={keywords}
      action_times={actionTimes}
    />
  </div>
);
