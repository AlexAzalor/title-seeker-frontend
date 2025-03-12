import { CircleX, InfoIcon } from "lucide-react";
import { TooltipWrapper } from "./custom/tooltip-wrapper";
import { cn } from "@/lib/utils";
import { GENRE, SUBGENRE } from "./genres";
import { percentageMatchColor } from "./movie/utils";
import {
  ActionTimeOut,
  GenreOutPlus,
  KeywordOut,
  SpecificationOut,
  SubgenreOutPlus,
} from "@/orval_api/model";
import { ACTION_TIME, KEYWORD, SPEC } from "./filter-fetch-wrapper";
import { useMemo } from "react";

type Props = {
  type: string;
  searchParam: string;
  itemData:
    | SubgenreOutPlus
    | GenreOutPlus
    | SpecificationOut
    | KeywordOut
    | ActionTimeOut;
  deleteItem: (value: string, key: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  hoveredSubgenre?: string | null;
  hoveredGenre?: string | null;
  cleanSearchParam?: string;
};

export const FilterBrick = ({
  type,
  searchParam,
  deleteItem,
  itemData,
  onMouseEnter,
  onMouseLeave,
  hoveredSubgenre,
  hoveredGenre,
  cleanSearchParam,
}: Props) => {
  const color = useMemo(() => {
    if (type === GENRE) {
      return "#4A3AFF";
    }
    if (type === SUBGENRE) {
      return "#9d4eff";
    }
    if (type === SPEC) {
      return "#64fcfe";
    }
    if (type === KEYWORD) {
      return "#FFC55C";
    }
    if (type === ACTION_TIME) {
      return "#92A8D1";
    }
    return "";
  }, [type]);

  return (
    <div
      className={cn(
        "hover:shadow-neon-border-fill relative flex min-h-10 min-w-28 items-center rounded-xl border-2 transition-shadow",
        type === GENRE && "dark:border-[#4A3AFF]",
        type === SUBGENRE && "dark:border-[#9d4eff]",
        hoveredSubgenre === cleanSearchParam &&
          type === GENRE &&
          "shadow-neon-border-fill",
        hoveredGenre === (itemData as SubgenreOutPlus).parent_genre_key &&
          type === SUBGENRE &&
          "shadow-neon-border-fill",
        type === SPEC &&
          "hover:shadow-movie-specification dark:border-[#64fcfe]",
        type === KEYWORD && "hover:shadow-movie-keyword dark:border-[#FFC55C]",
        type === ACTION_TIME &&
          "hover:shadow-movie-action-time dark:border-[#92A8D1]",
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          width: `${50}%`,
          borderColor: color,
          boxShadow: `0px 0px 0px 0px ${color}, 0 0 10px ${color}, 0 0 6px ${color}, inset 0 0 12px ${color}`,
          background: color + "66",
        }}
        className={cn(
          "absolute size-full rounded-lg border",
          type === GENRE && "dark:border-[#4A3AFF]",
          type === SUBGENRE && "dark:border-[#9d4eff]",
          type === SPEC && "dark:border-[#64fcfe]",
          type === KEYWORD && "dark:border-[#FFC55C]",
          type === ACTION_TIME && "dark:border-[#92A8D1]",
        )}
      />

      <div className="relative mx-auto flex items-center gap-2 px-1">
        <span>{itemData.name}</span>
        <TooltipWrapper
          asChild
          content={percentageMatchColor(50, itemData.description)}
        >
          <InfoIcon className="h-4 w-4" />
        </TooltipWrapper>
      </div>

      <CircleX
        className="absolute top-0 right-0 h-4 w-4 cursor-pointer"
        onClick={() => deleteItem(searchParam, type)}
      />
    </div>
  );
};
