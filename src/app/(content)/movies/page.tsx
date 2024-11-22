import { useTranslations } from "next-intl";
import Link from "next/link";

export default function MoviesPage() {
  const t = useTranslations("HomePage");

  return (
    <div className="min-h-screen">
      <h1 className="p-5 text-3xl">{t("navigation.movies")}</h1>
      <div className="flex flex-col gap-4">

          <Link className="p-4 bg-purple-400 text-lg"  href="/movies/movie-1">Movie 1</Link>
          <Link className="p-4 bg-purple-400 text-lg"  href="/movies/movie-2">Movie 2</Link>
          <Link className="p-4 bg-purple-400 text-lg" href="/movies/movie-3">Movie 3</Link>
      </div>
    </div>
  );
}
