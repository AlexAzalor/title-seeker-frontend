"use client";

import { useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useDeletePaginationParams } from "@/hooks/use-delete-pagination-params";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  formatURI,
  type URIParams,
} from "@/components/my-custom-ui/pagination/pagination-contoller";
import { SortingItemList } from "@/components/my-custom-ui/pagination/sorting-item-list";

import {
  type PageMoviePreviewOutPage,
  type PageMoviePreviewOutSize,
  SortBy,
  SortOrder,
} from "@/orval_api/model";

type Props = {
  uriKey: string;
  children?: React.ReactNode;
  pageSize: PageMoviePreviewOutSize;
  sortOrder: SortOrder;
  sortBy: SortBy;
  currentPage: PageMoviePreviewOutPage;
  sortByID?: boolean;
  ratedAt?: boolean;
  title?: string;
};

export const SortingControls = ({
  uriKey,
  children,
  currentPage,
  pageSize,
  sortOrder,
  sortBy,
  sortByID,
  ratedAt,
  title,
}: Props) => {
  const router = useRouter();
  const currentOrderType = useRef(sortOrder);
  const currentOrderBy = useRef(sortBy);
  const t = useTranslations("Other");

  const cleanParams = useDeletePaginationParams();

  const params: URIParams = {
    uriKey,
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
          "justify-ent relative m-3 flex justify-end rounded-[32px]",
          sortByID && "m-0",
          title && "justify-between",
        )}
      >
        {title && <h1 className="bold">{title}</h1>}

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
