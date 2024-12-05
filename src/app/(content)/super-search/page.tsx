import { getLocale } from "next-intl/server";
import Link from "next/link";
import { getMovies } from "@/orval_api/movies/movies";
import { getGenres } from "@/orval_api/genres/genres";
import { backendURL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Genres } from "@/components/genres";

export const revalidate = 10;

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SuperSearchPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetGenres } = getGenres();

  const {
    data: { genres },
  } = await aPIGetGenres({ lang }, backendURL);

  const { aPIGetMoviesByGenre } = getMovies();

  const genreNamesList =
    typeof searchParams.genre_name === "string"
      ? [searchParams.genre_name]
      : searchParams.genre_name;

  const {
    data: { movies, genre, subgenre },
  } = await aPIGetMoviesByGenre(
    {
      lang,
      genre_name: genreNamesList,
    },
    {
      baseURL: backendURL.baseURL,
      paramsSerializer: {
        indexes: null, // fix brackets in query params - "&genre_name[]="
      },
    },
  );

  console.log("movies", movies.length);

  return (
    <div className="min-h-screen">
      <h1>{movies.length}</h1>
      <h1 className="p-5 text-3xl">
        Result search by genres: {genre ? genre.name : ""},{" "}
        {subgenre ? subgenre.name : ""}
      </h1>

      {!movies.length && <h2>No movies found</h2>}

      <div className="flex justify-around gap-6">
        <Genres genres={genres} />

        <div className="flex flex-col gap-4">
          {movies.map((movie) => (
            <Link
              key={movie.uuid}
              className="flex items-center justify-around bg-purple-400 p-4 text-lg"
              href={`/movies/${movie.uuid}`}
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
          ))}
        </div>
      </div>
    </div>
  );
}
