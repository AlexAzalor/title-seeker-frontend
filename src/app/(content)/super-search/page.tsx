import { getLocale } from "next-intl/server";
import Link from "next/link";
import { getMovies } from "@/orval_api/movies/movies";
import { backendURL, POSTER_URL } from "@/lib/constants";
import { Language, MoviePreviewOut } from "@/orval_api/model";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

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
      <h2 className="mx-auto">
        Please select at least one filter to search for movies
      </h2>
    );
  }

  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  let moviesList: MoviePreviewOut[] = [];

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
    data: { movies },
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
    },
    {
      baseURL: backendURL.baseURL,
      paramsSerializer: {
        indexes: null, // fix brackets in query params - "&genre_name[]="
      },
    },
  );

  moviesList = movies;

  console.log("moviesList", moviesList.length);

  return (
    <>
      {moviesList.length ? (
        moviesList.map((movie) => (
          <Link
            key={movie.key}
            className="shadow-form-layout dark:shadow-dark-form-layout grid h-32 w-[300px] grid-cols-[1fr_3fr] items-center gap-2 rounded-[34px] border border-[#EFF0F7] p-3 lg:h-[158px] lg:w-[340px] lg:p-6 dark:border-[#211979]"
            href={`/movies/${movie.key}`}
          >
            {movie.poster && (
              <Image
                src={`${POSTER_URL}/posters/${movie.poster}`}
                alt="Actor Avatar"
                height={200}
                width={100}
              />
            )}
            <div className="flex h-full flex-col justify-between self-start">
              <p title={movie.title} className="text-xl font-bold">
                {movie.title.length > 40
                  ? movie.title.slice(0, 40) + "..."
                  : movie.title}
              </p>
              <div>
                {movie.release_date
                  ? formatDate(movie.release_date, lang)
                  : "no date"}
              </div>
              <div className="flex gap-1">
                <div>{movie.duration}</div>|<div>{movie.main_genre}</div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <h2 className="mx-auto mt-10">No movies found with selected filters</h2>
      )}
    </>
  );
}
