import {
  GenreOut,
  SpecificationOut,
  KeywordOut,
  ActionTimeOut,
  ActorOut,
  DirectorOut,
} from "@/orval_api/model";
import { PersonSelector } from "./person-selector";
import {
  SPEC_KEY,
  KEYWORD_KEY,
  ACTION_TIME_KEY,
  ACTOR_KEY,
  DIRECTOR_KEY,
} from "./filter-fetch-wrapper";
import { GenreSelector } from "./genre-selector";
import { FilterSelector } from "./filter-selector";

type Props = {
  genres: GenreOut[];
  specifications: SpecificationOut[];
  keywords: KeywordOut[];
  action_times: ActionTimeOut[];
  actors: ActorOut[];
  directors: DirectorOut[];
};

export const FilterList = ({
  genres,
  specifications,
  keywords,
  action_times,
  actors,
  directors,
}: Props) => {
  return (
    <div
      className="mb-20 flex flex-col gap-4 overflow-auto"
      aria-label="filter-list"
    >
      <GenreSelector genres={genres} />

      <FilterSelector
        title="Specification"
        data={specifications}
        param_key={SPEC_KEY}
      />
      <FilterSelector title="Keyword" data={keywords} param_key={KEYWORD_KEY} />
      <FilterSelector
        title="Action Time"
        data={action_times}
        param_key={ACTION_TIME_KEY}
      />

      <PersonSelector
        peopleList={actors}
        title="Actors"
        personKey={ACTOR_KEY}
      />
      <PersonSelector
        peopleList={directors}
        title="Directors"
        personKey={DIRECTOR_KEY}
      />
    </div>
  );
};
