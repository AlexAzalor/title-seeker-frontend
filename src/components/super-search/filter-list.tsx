import {
  GenreOut,
  FilterItemOut,
  ActorOut,
  DirectorOut,
  VisualProfileCategoryOut,
  FilterEnum,
  SharedUniversePreCreateOut,
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
  specifications: FilterItemOut[];
  keywords: FilterItemOut[];
  action_times: FilterItemOut[];
  actors: ActorOut[];
  directors: DirectorOut[];
  shared_universes: SharedUniversePreCreateOut[];
  visual_profile_categories: VisualProfileCategoryOut[];
};

export const FilterList = ({
  genres,
  specifications,
  keywords,
  action_times,
  actors,
  directors,
  shared_universes,
  visual_profile_categories,
}: Props) => {
  return (
    <div
      className="mb-20 flex flex-col gap-4 overflow-auto"
      aria-label="filter-list"
    >
      <GenreSelector genres={genres} />

      <FilterSelector data={specifications} param_key={SPEC_KEY} />
      <FilterSelector data={keywords} param_key={KEYWORD_KEY} />
      <FilterSelector data={action_times} param_key={ACTION_TIME_KEY} />

      <PersonSelector peopleList={actors} personKey={ACTOR_KEY} />
      <PersonSelector peopleList={directors} personKey={DIRECTOR_KEY} />

      <FilterSelector
        data={shared_universes}
        param_key={FilterEnum.shared_universe}
      />
      <FilterSelector
        data={visual_profile_categories}
        param_key={FilterEnum.visual_profile}
      />
    </div>
  );
};
