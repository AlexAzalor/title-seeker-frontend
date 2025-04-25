"use client";

import { Fragment } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// import type {
//   OrderType,
//   PageUserSearchOutPage,
//   PageUserSearchOutPages,
//   PageUserSearchOutSize,
//   UsersOrderBy,
// } from "@/orval_api/model";
import { cn, getVisiblePages } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  PageMoviePreviewOutPage,
  PageMoviePreviewOutPages,
  PageMoviePreviewOutSize,
  SortBy,
  SortOrder,
} from "@/orval_api/model";
import { useDeletePaginationParams } from "@/hooks/use-delete-pagination-params";
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE: PageMoviePreviewOutSize = 10;

export function formatURI({
  uriKey,
  query,
  otherParams,
  page = DEFAULT_PAGE,
  size = DEFAULT_PAGE_SIZE,
  sortOrder = SortOrder.desc,
  sortBy = SortBy.rated_at,
}: URIParams) {
  return `/${uriKey}?${otherParams ? otherParams + "&" : ""}sort_by=${sortBy}&sort_order=${sortOrder}&page=${page}&size=${size}`;
}

const FIRST_PAGE = 1;
const THREE_DOTS = "...";

export type URIParams = {
  uriKey: string;
  query: string;
  page?: PageMoviePreviewOutPage;
  size?: PageMoviePreviewOutSize;
  sortOrder?: SortOrder;
  sortBy?: SortBy;
  otherParams?: string;
};

type Props = {
  uriKey: string;
  query: string;
  totalPages: PageMoviePreviewOutPages;
  currentPage: PageMoviePreviewOutPage;
  pageSize: PageMoviePreviewOutSize;
  sortOrder: SortOrder;
  sortBy: SortBy;
};

export const PaginationContoller = ({
  uriKey,
  query,
  totalPages,
  currentPage,
  pageSize,
  sortOrder,
  sortBy,
}: Props) => {
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

  const prevPage =
    currentPage && currentPage !== FIRST_PAGE ? currentPage - 1 : FIRST_PAGE;

  const prevPageLink = formatURI({
    ...params,
    page: prevPage,
    otherParams: cleanParams,
  });

  const nextPage =
    currentPage && currentPage !== totalPages ? currentPage + 1 : currentPage;

  const nextPageLink = formatURI({
    ...params,
    page: nextPage,
    otherParams: cleanParams,
  });

  const pageButtonsList = getVisiblePages(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent className="items-end">
        <PaginationItem>
          <PaginationPrevious
            className={cn(currentPage === FIRST_PAGE && "pointer-events-none")}
            name={t("paginationPrev")}
            href={prevPageLink}
          />
        </PaginationItem>

        {pageButtonsList.map((pageNumber, i) => {
          const isPageActive = pageNumber === currentPage;
          const showThreeDots = pageNumber === THREE_DOTS;

          const isNumber = typeof pageNumber === "number";
          const showPageButton =
            ![FIRST_PAGE, totalPages].includes(isNumber ? pageNumber : 0) &&
            pageNumber !== THREE_DOTS;

          return (
            <Fragment key={pageNumber + "-" + i}>
              {pageNumber === FIRST_PAGE && (
                <PaginationItem>
                  <PaginationLink
                    href={formatURI({
                      ...params,
                      page: FIRST_PAGE,
                      otherParams: cleanParams,
                    })}
                    isActive={isPageActive}
                  >
                    {FIRST_PAGE}
                  </PaginationLink>
                </PaginationItem>
              )}

              {showThreeDots && i === 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {showPageButton && (
                <PaginationItem>
                  <PaginationLink
                    href={formatURI({
                      ...params,
                      page: Number(pageNumber),
                      otherParams: cleanParams,
                    })}
                    isActive={isPageActive}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )}

              {showThreeDots && i === pageButtonsList.length - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {pageNumber === totalPages && (
                <PaginationItem>
                  <PaginationLink
                    href={formatURI({
                      ...params,
                      page: totalPages,
                      otherParams: cleanParams,
                    })}
                    isActive={isPageActive}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
            </Fragment>
          );
        })}

        <PaginationItem>
          <PaginationNext
            className={cn(currentPage === totalPages && "pointer-events-none")}
            name={t("paginationNext")}
            href={nextPageLink}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
