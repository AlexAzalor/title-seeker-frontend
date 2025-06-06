import { useMemo } from "react";
import { CircleX, InfoIcon } from "lucide-react";
import { TooltipWrapper } from "../my-custom-ui/tooltip-wrapper";
import { cn, extractValues, extractWord } from "@/lib/utils";
import { GENRE_KEY, SUBGENRE_KEY } from "./genre-selector";
import {
  ACTION_TIME_KEY,
  ACTOR_KEY,
  DIRECTOR_KEY,
  KEYWORD_KEY,
  SPEC_KEY,
} from "./filter-fetch-wrapper";

import { getFilterColor } from "../movie/utils";
import { FilterEnum } from "@/orval_api/model";

type Data = {
  key: string;
  name: string;
  description?: string;
  parent_genre_key?: string;
};

type Props<ItemData extends Data> = {
  searchParamsList: string[];
  data: ItemData[];
  type: string;
  deleteItem: (value: string, key: string) => void;
  onMouseEnter?: (genre: string) => void;
  onMouseLeave?: () => void;
  hoveredSubgenre?: string | null;
  hoveredGenre?: string | null;
};

export const FilterBrick = <ItemData extends Data>({
  data,
  searchParamsList,
  type,
  deleteItem,
  onMouseEnter,
  onMouseLeave,
  hoveredSubgenre,
  hoveredGenre,
}: Props<ItemData>) => {
  const color = useMemo(() => {
    return getFilterColor(type);
  }, [type]);

  return searchParamsList.map((searchParam) => {
    const cleanSearchParam = extractWord(searchParam);
    const item = data.find((d) => d.key === cleanSearchParam);

    if (!item) {
      return null;
    }
    const itemPercentMatchRange = extractValues(searchParam);

    return (
      <div
        aria-label="filter-brick"
        key={searchParam}
        className={cn(
          "hover:shadow-genre group relative flex min-h-12 min-w-28 items-center rounded-xl border-2 transition-shadow",
          type === GENRE_KEY && "dark:border-genre",
          type === SUBGENRE_KEY && "dark:border-subgenre",
          hoveredSubgenre === cleanSearchParam &&
            type === GENRE_KEY &&
            "shadow-genre",
          hoveredGenre === item.parent_genre_key &&
            type === SUBGENRE_KEY &&
            "shadow-genre",
          type === SPEC_KEY &&
            "hover:shadow-specification dark:border-specification",
          type === KEYWORD_KEY && "hover:shadow-keyword dark:border-keyword",
          type === ACTION_TIME_KEY &&
            "hover:shadow-action-time dark:border-action-time",
          type === ACTOR_KEY && "hover:shadow-actor dark:border-actor",
          type === DIRECTOR_KEY && "hover:shadow-director dark:border-director",
          type === FilterEnum.shared_universe &&
            "hover:shadow-su dark:border-su",
          type === FilterEnum.visual_profile &&
            "hover:shadow-vp dark:border-vp",
        )}
        onMouseEnter={
          type === GENRE_KEY && onMouseEnter
            ? () => onMouseEnter(cleanSearchParam)
            : type === SUBGENRE_KEY && onMouseEnter
              ? () => onMouseEnter(item.parent_genre_key!)
              : undefined
        }
        onMouseLeave={onMouseLeave}
      >
        <div
          style={{
            borderColor: color,
            boxShadow: `0px 0px 0px 0px ${color}, 0 0 10px ${color}, 0 0 6px ${color}, inset 0 0 12px ${color}`,
          }}
          className="absolute size-full rounded-lg border"
        />

        <div className="relative mx-auto flex items-center gap-1 px-2">
          {item.description && (
            <TooltipWrapper asChild content={item.description}>
              <InfoIcon className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100" />
            </TooltipWrapper>
          )}
          <div className="flex flex-col items-center leading-4">
            <p style={{ fontWeight: "bold" }}>{item.name}</p>
            {![
              ACTOR_KEY,
              DIRECTOR_KEY,
              FilterEnum.shared_universe,
              FilterEnum.visual_profile,
            ].includes(type) && (
              <p className="text-sm">({itemPercentMatchRange.join("-")})</p>
            )}
          </div>
          <CircleX
            className="top-0 right-0 h-4 w-4 cursor-pointer"
            onClick={() => deleteItem(searchParam, type)}
          />
        </div>
      </div>
    );
  });
};
