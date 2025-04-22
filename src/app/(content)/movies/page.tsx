import { getLocale, getTranslations } from "next-intl/server";
import { getMovies } from "@/orval_api/movies/movies";
import { backendURL } from "@/lib/constants";
import { Language, SortBy, SortOrder } from "@/orval_api/model";
import { ListSortControls } from "@/components/profile/my-lists/list-sort-controls";
import { PaginationContoller } from "@/components/profile/my-lists/pagination-contoller";
import { MovieList } from "@/components/movie/movie-list";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function MoviesPage(props: {
  searchParams: SearchParams;
}) {
  const t = await getTranslations("HomePage");
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  let query = "";
  let pageNumber = "1";
  let pageSize = 30;
  let sortOrder: SortOrder = SortOrder.desc;
  let sortBy: SortBy = SortBy.id;

  const searchParams = await props.searchParams;

  if (!!searchParams && typeof searchParams.name === "string") {
    query = searchParams.name;
  }

  if (!!searchParams && typeof searchParams.page === "string") {
    pageNumber = searchParams.page;
  }

  if (!!searchParams && typeof searchParams.size === "string") {
    pageSize = Number(searchParams.size);
  }

  if (!!searchParams && typeof searchParams.sort_order === "string") {
    sortOrder = searchParams.sort_order as SortOrder;
  }

  if (!!searchParams && typeof searchParams.sort_by === "string") {
    sortBy = searchParams.sort_by as SortBy;
  }

  const { aPIGetMovies } = getMovies();
  const {
    data: { items, page, size, total, pages },
  } = await aPIGetMovies(
    {
      lang,
      page: Number(pageNumber),
      size: Number(pageSize),
      sort_order: sortOrder,
      sort_by: sortBy,
    },
    backendURL,
  );

  return (
    <ListSortControls
      uriKey="movies"
      currentPage={page}
      pageSize={size}
      query={""}
      sortOrder={sortOrder}
      sortBy={sortBy}
      sortByID
      totalItems={total}
    >
      <title>Movies | Title Seeker</title>

      <div className="min-h-screen">
        <div className="my-5 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <MovieList movies={items} lang={lang} />
        </div>

        {!!pages && (
          <PaginationContoller
            uriKey="movies"
            currentPage={page}
            totalPages={pages}
            pageSize={size}
            query={""}
            sortOrder={sortOrder}
            sortBy={sortBy}
          />
        )}
      </div>
    </ListSortControls>
  );
}
