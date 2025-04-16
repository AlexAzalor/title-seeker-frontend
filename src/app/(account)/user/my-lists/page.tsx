import { auth } from "@/auth";
import { MyMovies } from "@/components/profile/my-lists/my-movies";
import {
  DEFAULT_PAGE_SIZE,
  MyRatedMovies,
} from "@/components/profile/my-lists/my-rated-movies";
import { PaginationWrapper } from "@/components/profile/my-lists/pagination-wrapper";
import { backendURL } from "@/lib/constants";
import { Language, SortBy, SortOrder } from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";
import { getLocale } from "next-intl/server";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function MyListsPage(props: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session) {
    return null;
  }

  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  let query = "";
  let pageNumber = "1";
  let pageSize = DEFAULT_PAGE_SIZE;
  let sortOrder: SortOrder = SortOrder.desc;
  let orderBy: SortBy = SortBy.rated_at;

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
    orderBy = searchParams.sort_by as SortBy;
  }

  const { aPIGetMovies } = getMovies();
  const {
    data: { page, items, size, total, pages },
  } = await aPIGetMovies(
    {
      lang,
      user_uuid: session.user.uuid,

      // query: query,
      page: Number(pageNumber),
      size: Number(pageSize),
      sort_order: sortOrder,
      sort_by: orderBy,
    },
    backendURL,
  );

  return (
    <PaginationWrapper
      currentPage={page}
      pageSize={size}
      query={""}
      sortOrder={sortOrder}
      sortBy={orderBy}
    >
      {!!total && !!pages ? (
        <>
          <MyMovies movies={items} />

          {pages > 1 && (
            <MyRatedMovies
              currentPage={page}
              totalPages={pages}
              pageSize={size}
              query={""}
              sortOrder={sortOrder}
              sortBy={orderBy}
            />
          )}
        </>
      ) : (
        <div>You have not rated any movies yet.</div>
      )}
    </PaginationWrapper>
  );
}
