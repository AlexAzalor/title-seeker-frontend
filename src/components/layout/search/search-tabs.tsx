import { cn } from "@/lib/utils";
import { SearchType } from "@/orval_api/model";
import { SUPPORTED_SEARCH_TYPES, type SapportedSearchType } from "./search";

const SEARCH_TYPE_OPTIONS = [
  { key: SearchType.actors, label: "Actors" },
  { key: SearchType.directors, label: "Directors" },
  { key: SearchType.characters, label: "Characters" },
] as const;

type Props = {
  navKeys: {
    title: string;
    key: SapportedSearchType;
  }[];
  tab: SapportedSearchType;
  onChange: (tab: SapportedSearchType) => void;
};

export const SearchTabs = ({ navKeys, tab, onChange }: Props) => {
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
        {SEARCH_TYPE_OPTIONS.map(({ key, label }) => {
          const isTab = tab === key;

          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={getTabClasses(key, isTab)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
};
