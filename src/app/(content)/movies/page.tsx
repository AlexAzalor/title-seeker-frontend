import { getLocale, getTranslations } from "next-intl/server";
import { backendURL } from "@/lib/constants";

import { PaginationContoller } from "@/components/my-custom-ui/pagination/pagination-contoller";
import { MovieList } from "@/components/movie/movie-list";
import { SortingControls } from "@/components/my-custom-ui/pagination/sorting-controls";

import { getMovies } from "@/orval_api/movies/movies";
import { Language, SortBy, SortOrder } from "@/orval_api/model";
import { PaginationParamsSchema } from "@/types/search-params-schema";
import type { SearchParams } from "@/types/general";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 30;

export default async function MoviesPage(props: {
  searchParams: SearchParams;
}) {
  const t = await getTranslations("Other");
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const searchParams = await props.searchParams;

  const {
    page: pageNumber = DEFAULT_PAGE,
    size: pageSize = DEFAULT_PAGE_SIZE,
    sort_order: sortOrder = SortOrder.desc,
    sort_by: sortBy = SortBy.id,
  } = PaginationParamsSchema.parse(searchParams);

  const { aPIGetMovies } = getMovies();
  const {
    data: { items, page, size, pages, total },
  } = await aPIGetMovies(
    {
      lang,
      page: pageNumber,
      size: pageSize,
      sort_order: sortOrder,
      sort_by: sortBy,
    },
    backendURL,
  );

  return (
    <div className="min-h-screen">
      <SortingControls
        uriKey="movies"
        currentPage={page}
        pageSize={size}
        sortOrder={sortOrder}
        sortBy={sortBy}
        ratedAt
        title={t("allMovies")}
      >
        <div className="3xl:grid-cols-5 my-5 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          <MovieList movies={items} lang={lang} />
        </div>

        {!!pages && (
          <PaginationContoller
            uriKey="movies"
            currentPage={page}
            totalPages={pages}
            pageSize={size}
            sortOrder={sortOrder}
            sortBy={sortBy}
            totalItems={total}
          />
        )}
      </SortingControls>
    </div>
  );
}
