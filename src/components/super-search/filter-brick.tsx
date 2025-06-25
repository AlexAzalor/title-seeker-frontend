import { useMemo } from "react";
import { CircleX, InfoIcon } from "lucide-react";
import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import { cn, extractValues, extractWord } from "@/lib/utils";
import { getFilterColor } from "@/components/movie/utils";
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
  type: FilterEnum;
  deleteItem: (value: string, key: string) => void;
  onMouseEnter?: (genre: string) => void;
  onMouseLeave?: () => void;
  hoveredSubgenre?: string | null;
  hoveredGenre?: string | null;
};

const cutLongWords = (word: string, maxLength: number) => {
  if (word.length > maxLength) {
    return `${word.slice(0, maxLength)}...`;
  }
  return word;
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

  const specialFilters = [
    FilterEnum.actor,
    FilterEnum.director,
    FilterEnum.character,
    FilterEnum.shared_universe,
    FilterEnum.visual_profile,
  ] as const;

  const isFilters = (specialFilters as readonly FilterEnum[]).includes(type);

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
          type === FilterEnum.genre && "dark:border-genre",
          type === FilterEnum.subgenre && "dark:border-subgenre",
          hoveredSubgenre === cleanSearchParam &&
            type === FilterEnum.genre &&
            "shadow-genre",
          hoveredGenre === item.parent_genre_key &&
            type === FilterEnum.subgenre &&
            "shadow-genre",
          type === FilterEnum.specification &&
            "hover:shadow-specification dark:border-specification",
          type === FilterEnum.keyword &&
            "hover:shadow-keyword dark:border-keyword",
          type === FilterEnum.action_time &&
            "hover:shadow-action-time dark:border-action-time",
          type === FilterEnum.actor && "hover:shadow-actor dark:border-actor",
          type === FilterEnum.director &&
            "hover:shadow-director dark:border-director",
          type === FilterEnum.character &&
            "hover:shadow-character dark:border-character",
          type === FilterEnum.shared_universe &&
            "hover:shadow-su dark:border-su",
          type === FilterEnum.visual_profile &&
            "hover:shadow-vp dark:border-vp",
        )}
        onMouseEnter={
          type === FilterEnum.genre && onMouseEnter
            ? () => onMouseEnter(cleanSearchParam)
            : type === FilterEnum.subgenre && onMouseEnter
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
            <p title={item.name} style={{ fontWeight: "bold" }}>
              {cutLongWords(item.name, 24)}
            </p>
            {!isFilters && (
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
