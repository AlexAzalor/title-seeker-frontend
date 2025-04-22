import { getLocale } from "next-intl/server";
import { getMovies } from "@/orval_api/movies/movies";
import { backendURL } from "@/lib/constants";
import {
  Language,
  MoviePreviewOut,
  SortBy,
  SortOrder,
} from "@/orval_api/model";
import type { Metadata } from "next";
import { ListSortControls } from "@/components/profile/my-lists/list-sort-controls";
import { PaginationContoller } from "@/components/profile/my-lists/pagination-contoller";
import { MovieList } from "@/components/movie/movie-list";

export const metadata: Metadata = {
  title: "Super Search | Title Seeker",
};

export const revalidate = 10;

// type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SuperSearchPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const paramsKeys = Object.keys(searchParams);

  if (
    !paramsKeys.length ||
    (paramsKeys.length === 1 && paramsKeys.includes("exact_match"))
  ) {
    return (
      <h2 className="mx-auto mt-10 text-center">
        Please select at least one filter to search for movies
      </h2>
    );
  }

  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  let moviesList: MoviePreviewOut[] = [];

  let query = "";
  let pageNumber = "1";
  let pageSize = 12;
  let sortOrder: SortOrder = SortOrder.desc;
  let sortBy: SortBy = SortBy.id;

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

  const { aPISuperSearchMovies } = getMovies();

  const genreNamesList =
    typeof searchParams.genre_name === "string"
      ? [searchParams.genre_name]
      : searchParams.genre_name;
  const subgenreNamesList =
    typeof searchParams.subgenre_name === "string"
      ? [searchParams.subgenre_name]
      : searchParams.subgenre_name;

  const actorNamesList =
    typeof searchParams.actor_name === "string"
      ? [searchParams.actor_name]
      : searchParams.actor_name;

  const directorNamesList =
    typeof searchParams.director_name === "string"
      ? [searchParams.director_name]
      : searchParams.director_name;
  const specificationNamesList =
    typeof searchParams.specification_name === "string"
      ? [searchParams.specification_name]
      : searchParams.specification_name;
  const keywordNamesList =
    typeof searchParams.keyword_name === "string"
      ? [searchParams.keyword_name]
      : searchParams.keyword_name;
  const actionTimeNamesList =
    typeof searchParams.action_time_name === "string"
      ? [searchParams.action_time_name]
      : searchParams.action_time_name;

  const universesList =
    typeof searchParams.universe === "string"
      ? [searchParams.universe]
      : searchParams.universe;

  const exactMatch = searchParams.exact_match as any;

  const {
    data: { items: movies, page, total, size, pages },
  } = await aPISuperSearchMovies(
    {
      lang,
      genre_name: genreNamesList,
      subgenre_name: subgenreNamesList,
      actor_name: actorNamesList,
      director_name: directorNamesList,
      specification_name: specificationNamesList,
      keyword_name: keywordNamesList,
      action_time_name: actionTimeNamesList,
      exact_match: exactMatch,
      universe: universesList,

      // query: query,
      page: Number(pageNumber),
      size: Number(pageSize),
      sort_order: sortOrder,
      sort_by: sortBy,
    },
    {
      baseURL: backendURL.baseURL,
      paramsSerializer: {
        indexes: null, // fix brackets in query params - "&genre_name[]="
      },
    },
  );

  moviesList = movies;

  return (
    <ListSortControls
      uriKey="super-search"
      currentPage={page}
      pageSize={size}
      query={""}
      sortOrder={sortOrder}
      sortBy={sortBy}
      sortByID
      totalItems={total}
    >
      <div className="flex h-190 flex-wrap gap-4 py-3 lg:px-3">
        {moviesList.length ? (
          <MovieList movies={movies} lang={lang} />
        ) : (
          <h2 className="mx-auto mt-10">
            No movies found with selected filters
          </h2>
        )}

        {!!pages && total && total > 10 && (
          <PaginationContoller
            uriKey="super-search"
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
