import { cn } from "@/lib/utils";
import { SearchType } from "@/orval_api/model";

type Props = {
  navKeys: {
    title: string;
    key: SearchType;
  }[];
  tab: SearchType;
  onChange: (tab: SearchType) => void;
};

export const SearchTabs = ({ navKeys, tab, onChange }: Props) => {
  return (
    <>
      <div className="mb-2 flex gap-4 px-2">
        {navKeys.map(({ key, title }) => {
          const isTab = tab === key;

          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                "search-nav rounded-md border px-1 font-medium",
                isTab && key === SearchType.movies && "movie-color-set",
                isTab && key === SearchType.tvseries && "tvseries-color-set",
                isTab && key === SearchType.anime && "anime-color-set",
                isTab && key === SearchType.games && "game-color-set",
              )}
            >
              {title}
            </button>
          );
        })}
      </div>

      <div className="mb-2 flex gap-4 px-2">
        {[
          { key: SearchType.actors, label: "Actors" },
          { key: SearchType.directors, label: "Directors" },
          { key: SearchType.characters, label: "Characters" },
        ].map(({ key, label }) => {
          const isTab = tab === key;

          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                "search-nav rounded-md border px-1 font-medium",
                isTab && key === SearchType.actors && "actor-color-set",
                isTab && key === SearchType.directors && "director-color-set",
                isTab && key === SearchType.characters && "character-color-set",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
};
