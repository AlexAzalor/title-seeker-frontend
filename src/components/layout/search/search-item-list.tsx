import Image from "next/image";
import Link from "next/link";
import { SearchResult, SearchType } from "@/orval_api/model";

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
    switch (type) {
      case SearchType.movies:
        return `/movies/${key}`;
      case SearchType.tvseries:
        return "/tvseries";
      case SearchType.anime:
        return "/anime";
      case SearchType.games:
        return "/games";
      case SearchType.actors:
        return `/super-search?page=1&actor=${key}`;
      case SearchType.directors:
        return `/super-search?page=1&director=${key}`;
      case SearchType.characters:
        return `/super-search?page=1&character=${key}`;
      default:
        return "/";
    }
  };

  const getImageUrl = (type: SearchType, image: string) => {
    switch (type) {
      case SearchType.movies:
        return `${posterURL}/posters/${image}`;
      case SearchType.tvseries:
        return `${posterURL}/posters/${image}`;
      case SearchType.anime:
        return `${posterURL}/posters/${image}`;
      case SearchType.games:
        return `${posterURL}/posters/${image}`;
      case SearchType.actors:
        return `${posterURL}/actors/${image}`;
      case SearchType.directors:
        return `${posterURL}/directors/${image}`;
      default:
        return "";
    }
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
