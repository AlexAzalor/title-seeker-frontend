import { MovieFilter } from "@/components/movie/movie-page/movie-filter";
import { FilterEnum, type MovieFilterItem } from "@/orval_api/model";

type Props = {
  movieKey: string;
  specifications: MovieFilterItem[];
  keywords: MovieFilterItem[];
  action_times: MovieFilterItem[];
  isOwner: boolean;
};

export const MovieFilterList = ({
  movieKey,
  specifications,
  keywords,
  action_times,
  isOwner,
}: Props) => {
  return (
    <div
      className="my-4 flex flex-wrap justify-center gap-4 xl:justify-start"
      aria-label="movie-filter-list"
    >
      <MovieFilter
        movieKey={movieKey}
        data={specifications}
        filterKey={FilterEnum.specification}
        isOwner={isOwner}
      />

      <MovieFilter
        movieKey={movieKey}
        data={keywords}
        filterKey={FilterEnum.keyword}
        isOwner={isOwner}
      />

      <MovieFilter
        movieKey={movieKey}
        data={action_times}
        filterKey={FilterEnum.action_time}
        isOwner={isOwner}
      />
    </div>
  );
};
