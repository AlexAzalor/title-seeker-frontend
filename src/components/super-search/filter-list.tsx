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
import { GenreSelector } from "./genre-selector";
import { FilterSelector } from "./filter-selector";
import { SearchControlButtons } from "./search-control-buttons";

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
      <SearchControlButtons />

      <FilterSelector
        data={visual_profile_categories}
        param_key={FilterEnum.visual_profile}
      />

      <GenreSelector genres={genres} />

      <FilterSelector
        data={specifications}
        param_key={FilterEnum.specification}
      />
      <FilterSelector data={keywords} param_key={FilterEnum.keyword} />
      <FilterSelector data={action_times} param_key={FilterEnum.action_time} />

      <PersonSelector peopleList={actors} personKey={FilterEnum.actor} />
      <PersonSelector peopleList={directors} personKey={FilterEnum.director} />

      <FilterSelector
        data={shared_universes}
        param_key={FilterEnum.shared_universe}
      />
    </div>
  );
};
