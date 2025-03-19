import {
  GenreOut,
  SubgenreOut,
  SpecificationOut,
  KeywordOut,
  ActionTimeOut,
  ActorOut,
  DirectorOut,
} from "@/orval_api/model";
import { Actors } from "./actors";
import { Directors } from "./director";
import { SPEC, KEYWORD, ACTION_TIME } from "./filter-fetch-wrapper";
import { Genres } from "./genres";
import { MovieFilters } from "./movie-filters";

type Props = {
  genres: GenreOut[];
  subgenres: SubgenreOut[];
  specifications: SpecificationOut[];
  keywords: KeywordOut[];
  action_times: ActionTimeOut[];
  actors: ActorOut[];
  directors: DirectorOut[];
};

export const FiltersList = ({
  genres,
  subgenres,
  specifications,
  keywords,
  action_times,
  actors,
  directors,
}: Props) => {
  return (
    <div className="mb-20 flex flex-col gap-4 overflow-auto">
      <Genres genres={genres} subgenres={subgenres} />

      <MovieFilters
        title="Specification"
        data={specifications}
        param_key={SPEC}
      />
      <MovieFilters title="Keyword" data={keywords} param_key={KEYWORD} />
      <MovieFilters
        title="Action Time"
        data={action_times}
        param_key={ACTION_TIME}
      />

      <Actors actors={actors} />

      <Directors directors={directors} />
    </div>
  );
};
