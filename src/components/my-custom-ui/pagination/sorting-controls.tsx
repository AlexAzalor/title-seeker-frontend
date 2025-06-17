"use client";

import { useMemo, useRef } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { formatURI, URIParams } from "./pagination-contoller";
import {
  PageMoviePreviewOutPage,
  PageMoviePreviewOutSize,
  SortBy,
  SortOrder,
} from "@/orval_api/model";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useDeletePaginationParams } from "@/hooks/use-delete-pagination-params";
import { SortingItemList } from "./sorting-item-list";

type Props = {
  uriKey: string;
  query: string;
  children?: React.ReactNode;
  pageSize: PageMoviePreviewOutSize;
  sortOrder: SortOrder;
  sortBy: SortBy;
  currentPage: PageMoviePreviewOutPage;
  sortByID?: boolean;
  ratedAt?: boolean;
};

export const SortingControls = ({
  uriKey,
  children,
  query,
  currentPage,
  pageSize,
  sortOrder,
  sortBy,
  sortByID,
  ratedAt,
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

  const sortOrderItems = useMemo(() => {
    return [
      { value: SortOrder.desc, label: t("sorting.desc") },
      { value: SortOrder.asc, label: t("sorting.asc") },
    ];
  }, [t]);

  const sortByItems = useMemo(() => {
    return [
      {
        value: SortBy.rated_at,
        label: t("sorting.ratedAt"),
        exclude: ratedAt,
      },
      { value: SortBy.id, label: "By ID", exclude: sortByID },
      { value: SortBy.rating, label: t("sorting.rating") },
      { value: SortBy.ratings_count, label: t("sorting.ratingsCount") },
      { value: SortBy.release_date, label: t("sorting.releaseDate") },
      { value: SortBy.random, label: t("sorting.random") },
    ];
  }, [ratedAt, sortByID, t]);

  return (
    <>
      <div
        className={cn(
          "relative my-2 flex items-end justify-end rounded-[32px]",
          sortByID && "mb-0",
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="">
            <Button className="h-11 w-11 rounded-full px-1" variant="outline">
              <SlidersHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <SortingItemList
              items={sortOrderItems}
              handleOrderType={handleOrderType}
              title={t("sorting.sortOrder")}
              value={currentOrderType.current}
            />

            <DropdownMenuSeparator />

            <SortingItemList
              items={sortByItems}
              handleOrderType={handleOrderBy}
              title={t("sorting.sortBy")}
              value={currentOrderBy.current}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {children}
    </>
  );
};
