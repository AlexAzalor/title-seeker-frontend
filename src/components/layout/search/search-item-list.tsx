import Image from "next/image";
import Link from "next/link";
import { type SearchResult, SearchType } from "@/orval_api/model";

type Props = {
  posterURL: string;
  recentSearchItems: SearchResult[];
  title: string;
  close: (newItem: SearchResult) => void;
};

export function SearchItemList({
  posterURL,
  recentSearchItems,
  title,
  close,
}: Props) {
  const getSearchTypeUrl = (type: SearchType, key: string) => {
    // Create search params for super-search routes
    const createSearchParams = (paramName: string, value: string) => {
      const params = new URLSearchParams({ page: "1", [paramName]: value });
      return `/super-search?${params.toString()}`;
    };

    const directRoutes: Record<SearchType, string | null> = {
      [SearchType.movies]: `/movies/${encodeURIComponent(key)}`,
      [SearchType.tvseries]: `/tvseries/${encodeURIComponent(key)}`,
      [SearchType.anime]: `/anime/${encodeURIComponent(key)}`,
      [SearchType.games]: `/games/${encodeURIComponent(key)}`,
      [SearchType.actors]: createSearchParams("actor", key),
      [SearchType.directors]: createSearchParams("director", key),
      [SearchType.characters]: createSearchParams("character", key),
    };

    return directRoutes[type] || "/";
  };

  const getImageUrl = (type: SearchType, image: string): string => {
    const imagePathMap: Record<SearchType, string> = {
      [SearchType.movies]: `${posterURL}/posters/${image}`,
      [SearchType.tvseries]: `${posterURL}/posters/${image}`,
      [SearchType.anime]: `${posterURL}/posters/${image}`,
      [SearchType.games]: `${posterURL}/posters/${image}`,
      [SearchType.actors]: `${posterURL}/actors/${image}`,
      [SearchType.directors]: `${posterURL}/directors/${image}`,
      [SearchType.characters]: "", // No image path for characters
    };

    return imagePathMap[type] || "";
  };

  return (
    <div className="flex flex-col gap-1">
      <p className="mb-1 text-[var(--color-neutral-500)]">{title}</p>
      {recentSearchItems.map((item) => (
        <Link
          key={item.key}
          href={getSearchTypeUrl(item.type, item.key)}
          className="dark:hover:bg-main-dark-hover flex w-full items-center gap-2 rounded-sm p-2 transition-all duration-200 select-none hover:bg-neutral-100"
          onClick={() => close(item)}
        >
          {item.image && (
            <Image
              src={getImageUrl(item.type, item.image)}
              alt="Title Poster"
              height={60}
              width={40}
            />
          )}
          <div>
            <p className="text-lg font-bold">{item.name}</p>
            {item.extra_info && <span>{item.extra_info}</span>}
          </div>
        </Link>
      ))}
    </div>
  );
}
