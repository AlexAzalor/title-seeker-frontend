import { FilterEnum, MovieFilterItem } from "@/orval_api/model";
import { MovieFilter } from "./movie-filter";

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
        filterKey={FilterEnum.specification}
      />

      <MovieFilter
        movieKey={movieKey}
        data={keywords}
        filterKey={FilterEnum.keyword}
      />

      <MovieFilter
        movieKey={movieKey}
        data={action_times}
        filterKey={FilterEnum.action_time}
      />
    </div>
  );
};
