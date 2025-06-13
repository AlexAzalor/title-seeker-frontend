import {
  GenreOut,
  FilterItemOut,
  PersonBase,
  VisualProfileCategoryOut,
  FilterEnum,
  BaseSharedUniverse,
} from "@/orval_api/model";
import { PersonSelector } from "./person-selector";
import { GenreSelector } from "./genre-selector";
import { FilterSelector } from "./filter-selector";
import { SearchControlButtons } from "./search-control-buttons";
import { Separator } from "../ui/separator";

type Props = {
  genres: GenreOut[];
  specifications: FilterItemOut[];
  keywords: FilterItemOut[];
  action_times: FilterItemOut[];
  actors: PersonBase[];
  directors: PersonBase[];
  shared_universes: BaseSharedUniverse[];
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

      <Separator className="my-2" />

      <GenreSelector genres={genres} />

      <Separator className="my-2" />

      <FilterSelector
        data={specifications}
        param_key={FilterEnum.specification}
      />
      <FilterSelector data={keywords} param_key={FilterEnum.keyword} />
      <FilterSelector data={action_times} param_key={FilterEnum.action_time} />

      <Separator className="my-2" />

      <PersonSelector peopleList={actors} personKey={FilterEnum.actor} />
      <PersonSelector peopleList={directors} personKey={FilterEnum.director} />

      <Separator className="my-2" />

      <FilterSelector
        data={shared_universes}
        param_key={FilterEnum.shared_universe}
      />
    </div>
  );
};
