import { Separator } from "@/components/ui/separator";
import { SearchItemList } from "@/components/layout/search/search-item-list";
import type { SearchResult } from "@/orval_api/model";

export const SearchResults = ({
  searchResults,
  parsedData,
  posterURL,
  t,
  handleChooseItem,
}: {
  searchResults: SearchResult[] | null;
  parsedData: SearchResult[];
  posterURL: string;
  t: (key: string) => string;
  handleChooseItem: (item: SearchResult) => void;
}) => (
  <>
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
  </>
);
