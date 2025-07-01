import { getLocale, getTranslations } from "next-intl/server";
import { backendURL } from "@/lib/constants";

import { PaginationContoller } from "@/components/my-custom-ui/pagination/pagination-contoller";
import { MovieList } from "@/components/movie/movie-list";
import { SortingControls } from "@/components/my-custom-ui/pagination/sorting-controls";

import { getMovies } from "@/orval_api/movies/movies";
import {
  FilterSchema,
  PaginationParamsSchema,
} from "@/types/search-params-schema";
import { Language, SortBy, SortOrder } from "@/orval_api/model";
import type { SearchParams } from "@/types/general";
import type { Metadata } from "next";
import { getSession } from "@/app/services/global-api";

export const metadata: Metadata = {
  title: "Super Search | Title Seeker",
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;

export default async function SuperSearchPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const paramsKeys = Object.keys(searchParams);
  const t = await getTranslations("SuperSearch");

  const hasNoParams =
    !paramsKeys.length ||
    (paramsKeys.length === 1 && paramsKeys.includes("exact_match"));

  if (hasNoParams) {
    return <h2 className="mx-auto mt-10 text-center">{t("emptyState")}</h2>;
  }

  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];
  const session = await getSession();

  const {
    page: pageNumber = DEFAULT_PAGE,
    size: pageSize = DEFAULT_PAGE_SIZE,
    sort_order: sortOrder = SortOrder.desc,
    sort_by: sortBy = SortBy.id,
  } = PaginationParamsSchema.parse(searchParams);

  const {
    genre: genreNamesList,
    subgenre: subgenreNamesList,
    specification: specificationNamesList,
    keyword: keywordNamesList,
    action_time: actionTimeNamesList,
    actor: actorNamesList,
    director: directorNamesList,
    character: characterNamesList,
    shared_universe: universesList,
    visual_profile: visualProfileList,
  } = FilterSchema.parse(searchParams);

  const exactMatch =
    typeof searchParams.exact_match === "string"
      ? searchParams.exact_match
      : undefined;

  const { aPISuperSearchMovies } = getMovies();
  const {
    data: { items: movies, page, total, size, pages },
  } = await aPISuperSearchMovies(
    {
      lang,
      // Filters
      genre: genreNamesList,
      subgenre: subgenreNamesList,
      specification: specificationNamesList,
      keyword: keywordNamesList,
      action_time: actionTimeNamesList,
      actor: actorNamesList,
      director: directorNamesList,
      character: characterNamesList,
      shared_universe: universesList,
      visual_profile: visualProfileList,

      // Extra filters
      exact_match: Boolean(exactMatch),

      // Pagination and sorting,
      page: pageNumber,
      size: pageSize,
      sort_order: sortOrder,
      sort_by: sortBy,
      user_uuid: session?.uuid,
    },
    {
      baseURL: backendURL.baseURL,
      paramsSerializer: {
        indexes: null, // fix brackets in query params - "&genre[]="
      },
    },
  );

  return (
    <SortingControls
      uriKey="super-search"
      currentPage={page}
      pageSize={size}
      sortOrder={sortOrder}
      sortBy={sortBy}
      ratedAt
    >
      <div className="flex flex-col items-center gap-4 py-3 md:flex-row md:flex-wrap lg:px-3">
        {movies.length ? (
          <MovieList movies={movies} lang={lang} className="w-76 lg:w-86" />
        ) : (
          <h2 className="mx-auto mt-10">{t("notFound")}</h2>
        )}

        {!!pages && total && total > DEFAULT_PAGE_SIZE && (
          <PaginationContoller
            uriKey="super-search"
            currentPage={page}
            totalPages={pages}
            pageSize={size}
            sortOrder={sortOrder}
            sortBy={sortBy}
            totalItems={total}
          />
        )}
      </div>
    </SortingControls>
  );
}
