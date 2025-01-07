import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { getMovies } from "@/orval_api/movies/movies";
import { backendURL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import { formatDate } from "@/lib/utils";

export default async function MoviesPage() {
  const t = await getTranslations("HomePage");
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetMovies } = getMovies();
  const {
    data: { movies, temporary_movies },
  } = await aPIGetMovies({ lang }, backendURL);

  return (
    <div className="min-h-screen">
      {!!temporary_movies.length && (
        <div>
          <h1>Temporary Movies</h1>
          <div className="flex gap-5">
            {temporary_movies.map((movie) => (
              <Link
                href={{
                  pathname: "/add-movie",
                  query: { temp_movie_key: movie.key },
                }}
                key={movie.key}
                className="bg-gray-600 p-4"
              >
                <div className="text-xl">{movie.title_en}</div>
                <div>
                  Rating:{" "}
                  <span className="text-lg font-bold">{movie.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <h1 className="p-5 text-3xl">{t("navigation.movies")}</h1>
      <div className="grid grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link
            key={movie.key}
            className="bg-purple-400 p-4 text-lg"
            href={`/movies/${movie.key}`}
          >
            {movie.poster && (
              <Image
                src={`http://127.0.0.1:5002/api/movies/poster/${movie.poster}`}
                alt="Actor Avatar"
                height={100}
                width={50}
              />
            )}
            <div>{movie.title}</div>
            <div>
              {movie.release_date
                ? formatDate(movie.release_date, lang)
                : "no date"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
