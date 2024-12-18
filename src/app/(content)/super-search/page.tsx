import { getLocale } from "next-intl/server";
import Link from "next/link";
import { getMovies } from "@/orval_api/movies/movies";
import { backendURL } from "@/lib/constants";
import { Language, MovieSearchOut } from "@/orval_api/model";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

export const revalidate = 10;

// type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SuperSearchPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  let moviesList: MovieSearchOut[] = [];

  const { aPISearchMovies } = getMovies();

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

  const {
    data: { movies },
  } = await aPISearchMovies(
    {
      lang,
      genre_name: genreNamesList,
      subgenre_name: subgenreNamesList,
      actor_name: actorNamesList,
      director_name: directorNamesList,
      specification_name: specificationNamesList,
      keyword_name: keywordNamesList,
      action_time_name: actionTimeNamesList,
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
    <div className="min-h-screen">
      <div className="flex flex-col gap-4">
        {moviesList.length ? (
          moviesList.map((movie) => (
            <Link
              key={movie.key}
              className="flex w-[350px] items-center justify-around bg-purple-400 p-4 text-lg"
              href={`/movies/${movie.key}`}
            >
              {movie.poster && (
                <Image
                  className="h-28 w-max"
                  src={`http://127.0.0.1:5002/api/movies/poster/${movie.poster}`}
                  alt="Actor Avatar"
                  height={100}
                  width={50}
                />
              )}
              <div>
                {movie.title}
                {movie.release_date ? (
                  <div>{formatDate(movie.release_date, lang)}</div>
                ) : (
                  "no release date"
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="flex w-[350px] items-center justify-around bg-red-400 p-4 text-lg">
            No movies found
          </div>
        )}
      </div>
    </div>
  );
}
