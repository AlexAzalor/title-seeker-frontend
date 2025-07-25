import { Separator } from "@/components/ui/separator";
import { PersonSelector } from "@/components/super-search/person-selector";
import { GenreSelector } from "@/components/super-search/genre-selector";
import { FilterSelector } from "@/components/super-search/filter-selector";
import { SearchControlButtons } from "@/components/super-search/search-control-buttons";

import {
  type GenreOut,
  type FilterItemOut,
  type PersonBase,
  type VisualProfileCategoryOut,
  FilterEnum,
  type BaseSharedUniverse,
} from "@/orval_api/model";

type Props = {
  genres: GenreOut[];
  specifications: FilterItemOut[];
  keywords: FilterItemOut[];
  action_times: FilterItemOut[];
  actors: PersonBase[];
  directors: PersonBase[];
  characters: PersonBase[];
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
  characters,
  shared_universes,
  visual_profile_categories,
}: Props) => {
  return (
    <div
      className="mb-20 flex flex-col gap-4 overflow-y-auto"
      aria-label="filter-list"
    >
      <SearchControlButtons />

      <div className="custom-scrollbar flex flex-col gap-4 overflow-x-hidden overflow-y-auto pr-3">
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

        <FilterSelector
          data={action_times}
          param_key={FilterEnum.action_time}
        />

        <Separator className="my-2" />

        <PersonSelector peopleList={actors} personKey={FilterEnum.actor} />

        <PersonSelector
          peopleList={directors}
          personKey={FilterEnum.director}
        />

        <PersonSelector
          peopleList={characters}
          personKey={FilterEnum.character}
        />

        <Separator className="my-2" />

        <FilterSelector
          data={shared_universes}
          param_key={FilterEnum.shared_universe}
        />
      </div>
    </div>
  );
};
