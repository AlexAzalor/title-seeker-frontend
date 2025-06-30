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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { SearchTabs } from "@/components/layout/search/search-tabs";
import { SearchInput } from "@/components/layout/search/search-input";
import { SearchSuggestions } from "@/components/layout/search/search-suggestions";
import { SearchResults } from "@/components/layout/search/search-results";
import { useSearchLogic } from "@/hooks/use-search-logic";

import { type SearchResult, SearchType } from "@/orval_api/model";

const CustomModal = dynamic(
  () => import("@/components/my-custom-ui/custom-modal"),
  {
    ssr: false,
  },
);

// Her (2013), It (2017)
const MIN_CHARACTERS = 1;

export type SapportedSearchType = Exclude<
  SearchType,
  typeof SearchType.tvseries | typeof SearchType.anime | typeof SearchType.games
>;

// Define supported search types
export const SUPPORTED_SEARCH_TYPES = new Set([
  SearchType.movies,
  SearchType.actors,
  SearchType.directors,
  SearchType.characters,
]);

type Props = {
  posterURL: string;
};

export const Search = ({ posterURL }: Props) => {
  const { open, close, isOpen } = useModal();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const t = useTranslations("Search");
  const navigation = useTranslations("HomePage");

  const [tab, setTab] = useState<SapportedSearchType>(SearchType.movies);

  const { data: parsedData, setData } = useLocalStorage<SearchResult[]>(
    "recent_search",
    [] as SearchResult[],
  );

  const navigationKeys: { title: string; key: SapportedSearchType }[] =
    Object.entries(navigation.raw("navigation")).map(([key, value]) => ({
      title: value as string,
      key: key as SapportedSearchType,
    }));

  const {
    searchResults,
    setSearchResults,
    warning,
    performSearch,
    handleTabChange: handleTabWarning,
  } = useSearchLogic(tab);

  const { debounce } = useDebounce(async (query: string) => {
    if (query.trim() === "") {
      setSearchResults(null);
      return;
    }

    await performSearch(query, tab);
  }, 500);

  const handleTabChange = useCallback(
    (newTab: SapportedSearchType) => {
      setTab(newTab);
      handleTabWarning(newTab);
    },
    [handleTabWarning],
  );

  const handleSearch = useCallback(
    async (query: string) => {
      if (warning) {
        return;
      }

      const searchQuery = query.trim();

      if (searchQuery.length <= MIN_CHARACTERS) {
        setSearchResults(null);
        return;
      }

      debounce(searchQuery);
    },
    [warning, debounce, setSearchResults],
  );

  const setSearchResultToLocalStorage = useCallback(
    (newItem: SearchResult) => {
      const data = parsedData;

      const filtered = data.filter((m) => m.key !== newItem.key);
      const updated = [newItem, ...filtered].slice(0, 3);
      setData(updated);
    },
    [parsedData, setData],
  );

  const handleChooseItem = useCallback(
    (newItem: SearchResult) => {
      close();
      setSearchResultToLocalStorage(newItem);
      setSearchResults(null);
    },
    [close, setSearchResultToLocalStorage, setSearchResults],
  );

  const getInputPlaceholder = useCallback(
    (type: SapportedSearchType) => {
      const directRoutes: Record<SapportedSearchType, string | null> = {
        [SearchType.movies]: t("searchByMovies"),
        [SearchType.actors]: t("searchByActors"),
        [SearchType.directors]: t("searchByDirectors"),
        [SearchType.characters]: t("searchByCharacters"),
      };

      return directRoutes[type] || t("searchByMovies");
    },
    [t],
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

          <SearchInput
            placeholder={getInputPlaceholder(tab)}
            isMobile={isMobile}
            onSearch={handleSearch}
          />

          <SearchResults
            searchResults={searchResults}
            parsedData={parsedData}
            posterURL={posterURL}
            t={t}
            handleChooseItem={handleChooseItem}
          />

          <SearchSuggestions
            navigationKeys={navigationKeys}
            t={t}
            close={close}
          />
        </CustomModal>
      )}
    </div>
  );
};
