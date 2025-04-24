import { useMemo } from "react";
import { CircleX, InfoIcon } from "lucide-react";
import { TooltipWrapper } from "../my-custom-ui/tooltip-wrapper";
import { cleanString, cn, extractValues } from "@/lib/utils";
import { GENRE_KEY, SUBGENRE_KEY } from "./genre-selector";
// import { percentageMatchColor } from "./movie/utils";
// import {
//   ActionTimeOut,
//   GenreOutPlus,
//   KeywordOut,
//   SpecificationOut,
//   SubgenreOutPlus,
// } from "@/orval_api/model";
import {
  ACTION_TIME_KEY,
  ACTOR_KEY,
  DIRECTOR_KEY,
  KEYWORD_KEY,
  SPEC_KEY,
} from "./filter-fetch-wrapper";

import { getFilterColor } from "../movie/utils";

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
    const cleanSearchParam = cleanString(searchParam);
    const item = data.find((d) => d.key === cleanSearchParam);

    if (!item) {
      return null;
    }
    const itemPercentMatchRange = extractValues(searchParam);

    return (
      <div
        key={searchParam}
        className={cn(
          "hover:shadow-neon-border-fill group relative flex min-h-12 min-w-28 items-center rounded-xl border-2 transition-shadow",
          type === GENRE_KEY && "dark:border-[#4A3AFF]",
          type === SUBGENRE_KEY && "dark:border-[#9d4eff]",
          hoveredSubgenre === cleanSearchParam &&
            type === GENRE_KEY &&
            "shadow-neon-border-fill",
          hoveredGenre === item.parent_genre_key &&
            type === SUBGENRE_KEY &&
            "shadow-neon-border-fill",
          type === SPEC_KEY &&
            "hover:shadow-movie-specification dark:border-[#64fcfe]",
          type === KEYWORD_KEY &&
            "hover:shadow-movie-keyword dark:border-[#FFC55C]",
          type === ACTION_TIME_KEY &&
            "hover:shadow-movie-action-time dark:border-[#92A8D1]",
          type === ACTOR_KEY &&
            "hover:shadow-movie-actor dark:border-[#90ee90]",
          type === DIRECTOR_KEY &&
            "hover:shadow-movie-director dark:border-[#f08080]",
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
            // width: `${50}%`,
            borderColor: color,
            boxShadow: `0px 0px 0px 0px ${color}, 0 0 10px ${color}, 0 0 6px ${color}, inset 0 0 12px ${color}`,
            // background: color + "66",
          }}
          className={cn(
            "absolute size-full rounded-lg border",
            type === GENRE_KEY && "dark:border-[#4A3AFF]",
            type === SUBGENRE_KEY && "dark:border-[#9d4eff]",
            type === SPEC_KEY && "dark:border-[#64fcfe]",
            type === KEYWORD_KEY && "dark:border-[#FFC55C]",
            type === ACTION_TIME_KEY && "dark:border-[#92A8D1]",
            type === ACTOR_KEY && "dark:border-[#90ee90]",
            type === DIRECTOR_KEY && "dark:border-[#f08080]",
          )}
        />

        <div className="relative mx-auto flex items-center gap-1 px-2">
          {item.description && (
            <TooltipWrapper
              asChild
              // content={percentageMatchColor(50, item.description)}
              content={item.description}
            >
              <InfoIcon className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100" />
            </TooltipWrapper>
          )}
          <div className="flex flex-col items-center leading-4">
            <p style={{ fontWeight: "bold" }}>{item.name}</p>
            {![ACTOR_KEY, DIRECTOR_KEY].includes(type) && (
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
