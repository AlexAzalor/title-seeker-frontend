"use client";

import { useCallback, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  searchActors,
  searchCharacters,
  searchDirectors,
  searchTitles,
} from "@/app/services/global-api";

import {
  BadgeJapaneseYenIcon,
  Film,
  Gamepad2,
  ScanSearch,
  Search as SearchIcon,
  Tv,
} from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { SearchResult, SearchType } from "@/orval_api/model";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CustomModal } from "../my-custom-ui/custom-modal";
import { useModal } from "@/hooks/use-modal";
import { Separator } from "../ui/separator";

// Her (2013), It (2017)
const MIN_CHARACTERS = 1;

export const CONTENT_ICONS = {
  movies: <Film />,
  tvseries: <Tv />,
  games: <Gamepad2 />,
  anime: <BadgeJapaneseYenIcon />,
};
type Props = {
  posterURL: string;
};

export const Search = ({ posterURL }: Props) => {
  const { open, close, isOpen } = useModal();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const t = useTranslations("Search");
  const navigation = useTranslations("HomePage");

  const navigationKeys: { title: string; key: SearchType }[] = Object.entries(
    navigation.raw("navigation"),
  ).map(([key, value]) => ({
    title: value as string,
    key: key as SearchType,
  }));

  const [tab, setTab] = useState<SearchType>(SearchType.movies);

  const [warning, setWarning] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null,
  );

  const { data: parsedData, setData } = useLocalStorage<SearchResult[]>(
    "recent_search",
    [] as SearchResult[],
  );

  const getMovieList = async (query: string) => {
    const res = await searchTitles(query, tab);

    if (res.status === 200 && res.data?.results) {
      setSearchResults(res.data.results);
      return;
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  const getActorList = async (query: string) => {
    const res = await searchActors(query);

    if (res.status === 200 && res.data?.results) {
      setSearchResults(res.data.results);
      return;
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  const getCharacterList = async (query: string) => {
    const res = await searchCharacters(query);

    if (res.status === 200 && res.data?.results) {
      setSearchResults(res.data.results);
      return;
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  const getDirectorList = async (query: string) => {
    const res = await searchDirectors(query);

    if (res.status === 200 && res.data?.results) {
      setSearchResults(res.data.results);
      return;
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  const { debounce } = useDebounce(async (query: string) => {
    if (query.trim() === "") {
      return;
    }

    if (tab === SearchType.movies) {
      getMovieList(query);
    }

    if (tab === SearchType.actors) {
      getActorList(query);
    }
    if (tab === SearchType.directors) {
      getDirectorList(query);
    }
    if (tab === SearchType.characters) {
      getCharacterList(query);
    }
  }, 500);

  const handleSearch = async (query: string) => {
    if (warning) {
      return;
    }
    const searchQuery = query.trim().toLowerCase();

    if (searchQuery.length <= MIN_CHARACTERS) {
      return;
    }

    debounce(searchQuery);
  };

  const setSearchResultToLocalStorage = (newItem: SearchResult) => {
    const data = parsedData;

    const filtered = data.filter((m) => m.key !== newItem.key);
    const updated = [newItem, ...filtered].slice(0, 3);
    setData(updated);
  };

  const handleTabChange = useCallback((tab: SearchType) => {
    setTab(tab);
    if (
      tab !== SearchType.movies &&
      tab !== SearchType.actors &&
      tab !== SearchType.directors &&
      tab !== SearchType.characters
    ) {
      setWarning(true);
      return;
    }

    setWarning(false);
  }, []);

  const handleChooseItem = (newItem: SearchResult) => {
    close();
    setSearchResultToLocalStorage(newItem);
    setSearchResults(null);
  };

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
    <div
      className="flex flex-1 flex-col items-center sm:mx-3"
      aria-label="search"
    >
      <div className="mx-2 flex gap-1 lg:mx-0">
        <div
          onClick={() => open()}
          className="relative flex w-30 cursor-pointer items-center lg:w-50"
        >
          <SearchIcon className="absolute mr-2 ml-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder={t("search")}
            className="dark:hover:bg-main-dark-hover cursor-pointer bg-white transition-colors placeholder:pl-5 hover:bg-neutral-200 dark:placeholder:text-neutral-400"
            readOnly
          />
        </div>

        <Link href="/super-search">
          <Button>
            <ScanSearch />
            {t("super")}
          </Button>
        </Link>
      </div>

      <CustomModal isOpen={isOpen} onClose={close}>
        <div className="mb-2 flex gap-4 px-2">
          {navigationKeys.map(({ key, title }) => {
            const isTab = tab === key;

            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
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
                onClick={() => handleTabChange(key)}
                className={cn(
                  "search-nav rounded-md border px-1 font-medium",
                  isTab && key === SearchType.actors && "actor-color-set",
                  isTab && key === SearchType.directors && "director-color-set",
                  isTab &&
                    key === SearchType.characters &&
                    "character-color-set",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {warning && (
          <p className="error-message mx-6 rounded-md text-center">
            Title type not supported!
          </p>
        )}

        <div
          className="mb-3 flex items-center border-b px-3 dark:border-b-neutral-700"
          cmdk-input-wrapper=""
        >
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder={t("type")}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus={!isMobile}
            className={
              "flex field-sizing-content h-11 w-full rounded-md border-none bg-transparent py-3 text-sm outline-hidden placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-400"
            }
          />
        </div>

        {!!searchResults && searchResults.length === 0 && (
          <p className="error-message mx-6 rounded-md text-center">
            Titles Not found
          </p>
        )}

        {!!searchResults && !!searchResults.length && (
          <div className="flex flex-col gap-1">
            {searchResults.map((item) => (
              <Link
                key={item.key}
                href={getSearchTypeUrl(item.type, item.key)}
                className="dark:hover:bg-main-dark-hover flex w-full items-center gap-2 rounded-sm p-2 transition-all duration-200 select-none hover:bg-neutral-100"
                onClick={() => handleChooseItem(item)}
              >
                {item.image && (
                  <Image
                    src={getImageUrl(item.type, item.image)}
                    alt="Movie poster"
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

            <Separator className="my-3" />
          </div>
        )}

        {parsedData.length > 0 && (
          <>
            <div className="flex flex-col gap-1">
              <p className="mb-1 text-[var(--color-neutral-500)]">
                {t("recent")}
              </p>
              {parsedData.map((item) => (
                <Link
                  key={item.key}
                  href={getSearchTypeUrl(item.type, item.key)}
                  className="dark:hover:bg-main-dark-hover flex w-full items-center gap-2 rounded-sm p-2 transition-all duration-200 select-none hover:bg-neutral-100"
                  onClick={close}
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

            <Separator className="my-3" />
          </>
        )}

        <div className="flex flex-col gap-2">
          <p className="mb-1 text-[var(--color-neutral-500)]">
            {t("suggestions")}
          </p>
          {navigationKeys.map((item) => (
            <Link
              key={item.key}
              href={item.key}
              className="dark:hover:bg-main-dark-hover flex w-full items-center gap-1 rounded-sm p-1 transition-all duration-200 select-none hover:bg-neutral-100"
              onClick={close}
            >
              {
                CONTENT_ICONS[
                  item.key.replace("/", "") as keyof typeof CONTENT_ICONS
                ]
              }
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </CustomModal>
    </div>
  );
};
