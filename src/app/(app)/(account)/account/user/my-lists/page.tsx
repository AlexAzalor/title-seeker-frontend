import { getLocale, getTranslations } from "next-intl/server";
import { backendURL, DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";

import { MyMovies } from "@/components/profile/my-lists/my-movies";
import { PaginationContoller } from "@/components/my-custom-ui/pagination/pagination-contoller";
import { SortingControls } from "@/components/my-custom-ui/pagination/sorting-controls";

import { getMovies } from "@/orval_api/movies/movies";

import { Language, SortBy, SortOrder } from "@/orval_api/model";
import { PaginationParamsSchema } from "@/types/search-params-schema";
import type { SearchParams } from "@/types/general";
import { getUserOrRedirect } from "@/app/(app)/services/user-api";

export default async function MyListsPage(props: {
  searchParams: SearchParams;
}) {
  const user = await getUserOrRedirect();

  const t = await getTranslations("Rating");
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const searchParams = await props.searchParams;

  const {
    page: pageNumber = DEFAULT_PAGE,
    size: pageSize = DEFAULT_PAGE_SIZE,
    sort_order: sortOrder = SortOrder.desc,
    sort_by: orderBy = SortBy.rated_at,
  } = PaginationParamsSchema.parse(searchParams);

  const { aPIGetMovies } = getMovies();
  const {
    data: { page, items, size, total, pages },
  } = await aPIGetMovies(
    {
      lang,
      user_uuid: user.uuid,

      // Pagination
      page: pageNumber,
      size: pageSize,
      sort_order: sortOrder,
      sort_by: orderBy,
    },
    backendURL,
  );

  return (
    <SortingControls
      uriKey="account/user/my-lists"
      currentPage={page}
      pageSize={size}
      sortOrder={sortOrder}
      sortBy={orderBy}
      sortByID
    >
      {!!total && !!pages ? (
        <>
          <MyMovies movies={items} />

          {pages > 1 && (
            <PaginationContoller
              uriKey="account/user/my-lists"
              currentPage={page}
              totalPages={pages}
              pageSize={size}
              sortOrder={sortOrder}
              sortBy={orderBy}
              totalItems={total}
            />
          )}
        </>
      ) : (
        <div>{t("noUserRating")}</div>
      )}
    </SortingControls>
  );
}
