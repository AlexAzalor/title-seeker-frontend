import { useMemo } from "react";
import { CircleX, InfoIcon } from "lucide-react";
import { TooltipWrapper } from "./custom/tooltip-wrapper";
import { cleanString, cn, extractValues } from "@/lib/utils";
import { GENRE, SUBGENRE } from "./genres";
// import { percentageMatchColor } from "./movie/utils";
// import {
//   ActionTimeOut,
//   GenreOutPlus,
//   KeywordOut,
//   SpecificationOut,
//   SubgenreOutPlus,
// } from "@/orval_api/model";
import { ACTION_TIME, KEYWORD, SPEC } from "./filter-fetch-wrapper";
import { ACTOR } from "./actors";
import { DIRECTOR } from "./director";

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

const getColor = (type: string) =>
  ({
    [GENRE]: "#4A3AFF",
    [SUBGENRE]: "#9d4eff",
    [SPEC]: "#64fcfe",
    [KEYWORD]: "#FFC55C",
    [ACTION_TIME]: "#92A8D1",
    [ACTOR]: "#90ee90",
    [DIRECTOR]: "#f08080",
  })[type] || "#000";

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
    return getColor(type);
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
          type === GENRE && "dark:border-[#4A3AFF]",
          type === SUBGENRE && "dark:border-[#9d4eff]",
          hoveredSubgenre === cleanSearchParam &&
            type === GENRE &&
            "shadow-neon-border-fill",
          hoveredGenre === item.parent_genre_key &&
            type === SUBGENRE &&
            "shadow-neon-border-fill",
          type === SPEC &&
            "hover:shadow-movie-specification dark:border-[#64fcfe]",
          type === KEYWORD &&
            "hover:shadow-movie-keyword dark:border-[#FFC55C]",
          type === ACTION_TIME &&
            "hover:shadow-movie-action-time dark:border-[#92A8D1]",
          type === ACTOR && "hover:shadow-movie-actor dark:border-[#90ee90]",
          type === DIRECTOR &&
            "hover:shadow-movie-director dark:border-[#f08080]",
        )}
        onMouseEnter={
          type === GENRE && onMouseEnter
            ? () => onMouseEnter(cleanSearchParam)
            : type === SUBGENRE && onMouseEnter
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
            type === GENRE && "dark:border-[#4A3AFF]",
            type === SUBGENRE && "dark:border-[#9d4eff]",
            type === SPEC && "dark:border-[#64fcfe]",
            type === KEYWORD && "dark:border-[#FFC55C]",
            type === ACTION_TIME && "dark:border-[#92A8D1]",
            type === ACTOR && "dark:border-[#90ee90]",
            type === DIRECTOR && "dark:border-[#f08080]",
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
            {![ACTOR, DIRECTOR].includes(type) && (
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
