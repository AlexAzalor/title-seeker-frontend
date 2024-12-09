import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { getMovies } from "@/orval_api/movies/movies";
import { backendURL } from "@/lib/constants";
import { Language } from "@/orval_api/model";

export default async function MoviesPage() {
  const t = await getTranslations("HomePage");
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetMovies } = getMovies();
  const {
    data: { movies },
  } = await aPIGetMovies({ lang }, backendURL);

  return (
    <div className="min-h-screen">
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
            {movie.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
