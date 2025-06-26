import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  searchActors,
  searchCharacters,
  searchDirectors,
  searchTitles,
} from "@/app/services/global-api";
import { SearchType, type SearchResult } from "@/orval_api/model";
import {
  SUPPORTED_SEARCH_TYPES,
  type SapportedSearchType,
} from "@/components/layout/search/search";

/**
 *
 * @description Custom hook to manage search logic for different content types.
 */
export const useSearchLogic = (tab: SapportedSearchType) => {
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null,
  );
  const [warning, setWarning] = useState(false);

  const searchFunctions = {
    [SearchType.movies]: (query: string) => searchTitles(query, tab),
    [SearchType.actors]: searchActors,
    [SearchType.directors]: searchDirectors,
    [SearchType.characters]: searchCharacters,
  };

  const performSearch = async (
    query: string,
    searchType: SapportedSearchType,
  ) => {
    try {
      const searchFunction = searchFunctions[searchType];
      if (!searchFunction) {
        toast.error("Search type not supported");
        return;
      }

      const res = await searchFunction(query);

      if (res.status === 200 && res.data?.results) {
        setSearchResults(res.data.results);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Search failed. Please try again.");
      console.error("Search error:", error);
    }
  };

  const handleTabChange = useCallback((newTab: SapportedSearchType) => {
    setSearchResults(null);

    if (!SUPPORTED_SEARCH_TYPES.has(newTab)) {
      setWarning(true);
      return;
    }

    setWarning(false);
  }, []);

  return {
    searchResults,
    setSearchResults,
    warning,
    setWarning,
    performSearch,
    handleTabChange,
  };
};
