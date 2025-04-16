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
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE: PageMoviePreviewOutSize = 10;

export function formatURI({
  query,
  page = DEFAULT_PAGE,
  size = DEFAULT_PAGE_SIZE,
  sortOrder = SortOrder.desc,
  sortBy = SortBy.rated_at,
}: URIParams) {
  // ?sort_by=rated_at&sort_order=desc&lang=uk&page=1&size=5
  // return `/search-experts/?name=${query}&page=${page}&size=${size}&order_type=${sortOrder}&order_by=${sortBy}`;
  return `/user/my-lists/?sort_by=${sortBy}&sort_order=${sortOrder}&page=${page}&size=${size}`;
}

const FIRST_PAGE = 1;
const THREE_DOTS = "...";

export type URIParams = {
  query: string;
  page?: PageMoviePreviewOutPage;
  size?: PageMoviePreviewOutSize;
  sortOrder?: SortOrder;
  sortBy?: SortBy;
};

type Props = {
  query: string;
  totalPages: PageMoviePreviewOutPages;
  currentPage: PageMoviePreviewOutPage;
  pageSize: PageMoviePreviewOutSize;
  sortOrder: SortOrder;
  sortBy: SortBy;
};

export const MyRatedMovies = ({
  query,
  totalPages,
  currentPage,
  pageSize,
  sortOrder,
  sortBy,
}: Props) => {
  const t = useTranslations("Other");

  const params: URIParams = {
    query,
    page: currentPage,
    size: pageSize,
    sortOrder,
    sortBy,
  };

  const prevPage =
    currentPage && currentPage !== FIRST_PAGE ? currentPage - 1 : FIRST_PAGE;
  const prevPageLink = formatURI({ ...params, page: prevPage });

  const nextPage =
    currentPage && currentPage !== totalPages ? currentPage + 1 : currentPage;
  const nextPageLink = formatURI({ ...params, page: nextPage });

  const pageButtonsList = getVisiblePages(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
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
                    href={formatURI({ ...params, page: FIRST_PAGE })}
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
                    href={formatURI({ ...params, page: Number(pageNumber) })}
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
                    href={formatURI({ ...params, page: totalPages })}
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
