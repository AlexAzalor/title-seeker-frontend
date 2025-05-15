"use client";

import { useRef } from "react";
// import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { formatURI, URIParams } from "./pagination-contoller";
import {
  PageMoviePreviewOutPage,
  PageMoviePreviewOutSize,
  PageMoviePreviewOutTotal,
  SortBy,
  SortOrder,
} from "@/orval_api/model";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeletePaginationParams } from "@/hooks/use-delete-pagination-params";

type Props = {
  // experts?: UserSearchOut[];
  uriKey: string;
  query: string;
  children?: React.ReactNode;
  pageSize: PageMoviePreviewOutSize;
  sortOrder: SortOrder;
  sortBy: SortBy;
  currentPage: PageMoviePreviewOutPage;
  sortByID?: boolean;
};

// Art, Low, ENT/ЛОР
// const MIN_CHARACTERS = 2;

export const SortingControls = ({
  uriKey,
  children,
  query,
  currentPage,
  pageSize,
  sortOrder,
  sortBy,
  sortByID,
}: Props) => {
  const router = useRouter();
  const currentOrderType = useRef(sortOrder);
  const currentOrderBy = useRef(sortBy);
  const t = useTranslations("Other");

  const cleanParams = useDeletePaginationParams();

  const params: URIParams = {
    uriKey,
    query,
    page: currentPage,
    size: pageSize,
    sortOrder,
    sortBy,
  };

  const handleOrderType = (sortOrder: SortOrder) => {
    currentOrderType.current = sortOrder;

    const uri = formatURI({ ...params, sortOrder, otherParams: cleanParams });
    router.replace(uri);
  };

  const handleOrderBy = (sortBy: SortBy) => {
    currentOrderBy.current = sortBy;

    const uri = formatURI({ ...params, sortBy, otherParams: cleanParams });
    router.replace(uri);
  };

  // const { debounce } = useDebounce((query: string) => {
  //   if (query.trim() === "") {
  //     return;
  //   }

  //   const uri = formatURI({ ...params, page: DEFAULT_PAGE, query });
  //   router.push(uri);
  // }, 500);

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;

  //   if (value.length <= MIN_CHARACTERS) {
  //     return;
  //   }

  //   debounce(value);
  // };
  // mx-auto max-w-[1280px]
  return (
    <>
      <div
        className={cn(
          "relative my-2 flex items-end justify-end rounded-[32px]",
          sortByID && "mb-0",
        )}
      >
        {/* <Image
          className="absolute top-1/2 left-6 -translate-y-1/2 transform"
          src="/static/search-normal.svg"
          width={20}
          height={20}
          alt="Search"
        /> */}

        {/* <input
          className={
            "h-[68px] w-full rounded-[32px] pl-14 pr-[222px] placeholder:text-primary focus-within:outline-none mobileMax:placeholder:text-xs desktopEnd:pr-[158px]"
          }
          placeholder="Search"
          type="text"
          onChange={handleSearch}
          defaultValue={query}
        /> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="">
            <Button className="h-11 w-11 rounded-full px-1" variant="outline">
              <SlidersHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{t("sorting.sortOrder")}:</DropdownMenuLabel>

            <DropdownMenuRadioGroup
              value={currentOrderType.current}
              onValueChange={(value) => handleOrderType(value as SortOrder)}
            >
              <DropdownMenuRadioItem value={SortOrder.desc}>
                {t("sorting.desc")}
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value={SortOrder.asc}>
                {t("sorting.asc")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>{t("sorting.sortBy")}:</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={currentOrderBy.current}
              onValueChange={(value) => handleOrderBy(value as SortBy)}
            >
              {!sortByID && (
                <DropdownMenuRadioItem value={SortBy.rated_at}>
                  {t("sorting.ratedAt")}
                </DropdownMenuRadioItem>
              )}

              {sortByID && (
                <DropdownMenuRadioItem value={SortBy.id}>
                  By ID
                </DropdownMenuRadioItem>
              )}

              <DropdownMenuRadioItem value={SortBy.rating}>
                {t("sorting.rating")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={SortBy.ratings_count}>
                {t("sorting.ratingsCount")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={SortBy.release_date}>
                {t("sorting.releaseDate")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={SortBy.random}>
                {t("sorting.random")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {children}
    </>
  );
};
