import { backendURL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";
import { PageProps } from "@/types/general";
import { getLocale, getTranslations } from "next-intl/server";

export default async function DynamicPage({ params }: PageProps) {
  const { slug: movie_uuid } = await params;

  const t = await getTranslations("HomePage");
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetMovie } = getMovies();
  const { data } = await aPIGetMovie(movie_uuid, { lang }, backendURL);

  return (
    <div className="min-h-screen">
      <h1 className="p-5 text-3xl">
        {t("navigation.movies")}: {data.title}
      </h1>
    </div>
  );
}
