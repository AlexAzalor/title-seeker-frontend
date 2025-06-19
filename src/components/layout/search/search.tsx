"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import dynamic from "next/dynamic";

import { ScanSearch, Search as SearchIcon } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useModal } from "@/hooks/use-modal";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CONTENT_ICONS } from "@/components/layout/sidebar/menu-item-collection";
import { SearchTabs } from "@/components/layout/search/search-tabs";
import { SearchItemList } from "@/components/layout/search/search-item-list";

import { type SearchResult, SearchType } from "@/orval_api/model";
import {
  searchActors,
  searchCharacters,
  searchDirectors,
  searchTitles,
} from "@/app/services/global-api";

const CustomModal = dynamic(() => import("../../my-custom-ui/custom-modal"), {
  ssr: false,
});

// Her (2013), It (2017)
const MIN_CHARACTERS = 1;

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

  const setSearchResultToLocalStorage = useCallback(
    (newItem: SearchResult) => {
      const data = parsedData;

      const filtered = data.filter((m) => m.key !== newItem.key);
      const updated = [newItem, ...filtered].slice(0, 3);
      setData(updated);
    },
    [parsedData, setData],
  );

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

  const handleChooseItem = useCallback(
    (newItem: SearchResult) => {
      close();
      setSearchResultToLocalStorage(newItem);
      setSearchResults(null);
    },
    [close, setSearchResultToLocalStorage],
  );

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

      {isOpen && (
        <CustomModal isOpen={isOpen} onClose={close}>
          <SearchTabs
            navKeys={navigationKeys}
            tab={tab}
            onChange={handleTabChange}
          />

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
              Items Not found
            </p>
          )}

          {!!searchResults && !!searchResults.length && (
            <>
              <SearchItemList
                title={t("result")}
                posterURL={posterURL}
                recentSearchItems={searchResults}
                close={handleChooseItem}
              />
              <Separator className="my-3" />
            </>
          )}

          {parsedData.length > 0 && (
            <>
              <SearchItemList
                title={t("recent")}
                posterURL={posterURL}
                recentSearchItems={parsedData}
                close={handleChooseItem}
              />
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
      )}
    </div>
  );
};
