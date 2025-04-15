import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { getMovies } from "@/orval_api/movies/movies";
import { backendURL, POSTER_URL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import { formatDate } from "@/lib/utils";
// import { cache } from "react";

// export const getLocaleFunc = cache(async () => {
//   return await getLocale();
// });

export default async function MoviesPage() {
  const t = await getTranslations("HomePage");
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetMovies } = getMovies();
  const {
    data: { items },
  } = await aPIGetMovies({ lang }, backendURL);

  return (
    <>
      <title>Movies | Title Seeker</title>

      <div className="min-h-screen">
        {/* {!!temporary_movies.length && (
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
        )} */}

        <div className="my-5 grid grid-cols-1 gap-4 lg:grid-cols-5">
          {items.map((movie) => (
            <Link
              key={movie.key}
              className="shadow-form-layout dark:shadow-dark-form-layout grid h-[158px] w-[340px] grid-cols-[1fr_3fr] items-center gap-2 rounded-[34px] border border-[#EFF0F7] p-6 dark:border-[#211979]"
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
          ))}
        </div>
      </div>
    </>
  );
}
