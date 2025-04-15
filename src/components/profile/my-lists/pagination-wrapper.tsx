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
import { formatURI, URIParams } from "./my-rated-movies";
import {
  PageMoviePreviewOutPage,
  PageMoviePreviewOutSize,
  SortBy,
  SortOrder,
} from "@/orval_api/model";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

type Props = {
  // experts?: UserSearchOut[];
  query: string;
  children?: React.ReactNode;
  pageSize: PageMoviePreviewOutSize;
  sortOrder: SortOrder;
  sortBy: SortBy;
  currentPage: PageMoviePreviewOutPage;
};

// Art, Low, ENT/ЛОР
// const MIN_CHARACTERS = 2;

export const PaginationWrapper = ({
  children,
  query,
  currentPage,
  pageSize,
  sortOrder,
  sortBy,
}: Props) => {
  const router = useRouter();
  const currentOrderType = useRef(sortOrder);
  const currentOrderBy = useRef(sortBy);
  const t = useTranslations("Other");

  const params: URIParams = {
    query,
    page: currentPage,
    size: pageSize,
    sortOrder,
    sortBy,
  };

  const handleOrderType = (sortOrder: SortOrder) => {
    currentOrderType.current = sortOrder;

    const uri = formatURI({ ...params, sortOrder });
    router.replace(uri);
  };

  const handleOrderBy = (sortBy: SortBy) => {
    currentOrderBy.current = sortBy;

    const uri = formatURI({ ...params, sortBy });
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

  return (
    <div className="mx-auto max-w-[1280px]">
      <h1>All my rated movies</h1>

      <div className="relative mb-6 flex justify-end rounded-[32px]">
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
          <DropdownMenuTrigger asChild>
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
              <DropdownMenuRadioItem value={SortBy.rated_at}>
                {t("sorting.ratedAt")}
              </DropdownMenuRadioItem>

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
    </div>
  );
};
