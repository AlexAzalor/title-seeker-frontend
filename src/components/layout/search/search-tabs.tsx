import { cn } from "@/lib/utils";
import { SearchType } from "@/orval_api/model";
import { SUPPORTED_SEARCH_TYPES, type SapportedSearchType } from "./search";
import { useCallback } from "react";
import { useTranslations } from "next-intl";

const SEARCH_TYPE_OPTIONS = [
  { key: SearchType.actors },
  { key: SearchType.directors },
  { key: SearchType.characters },
] as const;

type OnlyPersonsType = Exclude<SapportedSearchType, "movies">;

type Props = {
  navKeys: {
    title: string;
    key: SapportedSearchType;
  }[];
  tab: SapportedSearchType;
  onChange: (tab: SapportedSearchType) => void;
};

export const SearchTabs = ({ navKeys, tab, onChange }: Props) => {
  const t = useTranslations("Filters");

  const colorClassMap: Record<SapportedSearchType, string> = {
    [SearchType.movies]: "movie-color-set",
    [SearchType.actors]: "actor-color-set",
    [SearchType.directors]: "director-color-set",
    [SearchType.characters]: "character-color-set",
  };

  const getTabClasses = (key: SapportedSearchType, isActive: boolean) => {
    return cn(
      "search-nav rounded-md border px-1 font-medium",
      isActive && colorClassMap[key],
    );
  };

  const getPersonLabel = useCallback(
    (type: OnlyPersonsType) => {
      const person: Record<OnlyPersonsType, string | null> = {
        [SearchType.actors]: t("actor"),
        [SearchType.directors]: t("director"),
        [SearchType.characters]: t("character"),
      };

      return person[type] || "";
    },
    [t],
  );

  return (
    <>
      <div className="mb-2 flex gap-4 px-2">
        {navKeys.map(({ key, title }) => {
          if (!SUPPORTED_SEARCH_TYPES.has(key)) {
            return;
          }
          const isTab = tab === key;

          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={getTabClasses(key, isTab)}
            >
              {title}
            </button>
          );
        })}
      </div>

      <div className="mb-2 flex gap-4 px-2">
        {SEARCH_TYPE_OPTIONS.map(({ key }) => {
          const isTab = tab === key;

          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={getTabClasses(key, isTab)}
            >
              {getPersonLabel(key)}
            </button>
          );
        })}
      </div>
    </>
  );
};
