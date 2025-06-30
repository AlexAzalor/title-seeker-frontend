import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { AVATAR_URL, POSTER_URL } from "@/lib/constants";

import { ActorsCarousel } from "@/components/actors-carousel";
import { FetchWrapper } from "@/components/my-custom-ui/fetch-wrapper";
import { MoviesCarousel } from "@/components/movie/movie-carousel";
import { Spinner } from "@/components/my-custom-ui/spinner";

import { getPeople } from "@/orval_api/people/people";
import { getMovies } from "@/orval_api/movies/movies";
import type {
  ActorsList,
  APIGetActorsWithMostMoviesParams,
  APIGetRandomListParams,
  MovieCarouselList,
} from "@/orval_api/model";

export default function Home() {
  const t = useTranslations("HomePage");
  const keyFeatures = Object.keys(t.raw("keyFeatures.keys"));

  const { aPIGetActorsWithMostMovies } = getPeople();
  const { aPIGetRandomList } = getMovies();

  return (
    <>
      <main className="container flex min-h-screen max-w-320 flex-col items-center gap-5 p-4 lg:px-10 lg:py-8">
        <h1 className="to-main-ui-purple bg-gradient-to-r from-blue-600 via-purple-700 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-lg transition-transform duration-900 ease-in-out lg:text-7xl">
          {t("title")}
        </h1>

        <h2 className="max-w-210 text-center text-lg leading-relaxed font-semibold tracking-wide text-gray-700 lg:text-2xl dark:text-gray-300">
          {t("subTitle")}
        </h2>

        <h3 className="bg-baby-blue dark:bg-main-dark-hover rounded-md p-3 text-xl font-bold md:text-2xl">
          {t("meaning")}
        </h3>

        <p className="max-w-4xl rounded-lg border border-slate-200/50 bg-gradient-to-br from-slate-50/50 to-slate-100/50 px-4 py-6 text-center text-lg leading-relaxed font-medium tracking-wide text-slate-700 shadow-sm transition-all duration-300 hover:shadow-md lg:text-2xl dark:border-slate-700/50 dark:from-slate-800/30 dark:to-slate-900/30 dark:text-slate-300">
          {t("description")}
        </p>

        <h3 className="border-light-border from-form-ui-blue via-main-ui-purple to-form-ui-blue dark:border-dark-border/40 relative rounded-2xl border-2 bg-gradient-to-r bg-clip-text px-6 py-4 text-center text-xl font-extrabold text-transparent drop-shadow-md lg:text-2xl">
          {t("solution")}
        </h3>

        <p className="text-2xl font-bold">{t("keyFeatures.title")}</p>
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {keyFeatures.map((key) => (
            <div
              key={key}
              className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border flex min-h-[200px] flex-col rounded-4xl border p-2 md:p-4"
            >
              <h3 className="mb-4 text-center text-xl font-bold">
                {t(`keyFeatures.keys.${key}.title`)}
              </h3>
              <p className="flex flex-1 items-center justify-center text-center">
                {t(`keyFeatures.keys.${key}.description`)}
              </p>
            </div>
          ))}
        </div>

        <div className="text-gray-purple">{t("warning")}</div>

        <Suspense
          fallback={
            <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border w-full rounded-xl border p-5">
              <Spinner className="mx-auto w-fit" />
            </div>
          }
        >
          <FetchWrapper<
            MovieCarouselList,
            APIGetRandomListParams,
            typeof aPIGetRandomList
          >
            apiFetch={aPIGetRandomList}
            params={{}}
          >
            {({ result, lang }) => (
              <MoviesCarousel
                name={t("randomMovies")}
                movies={result.data.movies}
                lang={lang}
                posterURL={POSTER_URL || "NO URL!"}
                avatarURL={AVATAR_URL || "NO URL!"}
              />
            )}
          </FetchWrapper>
        </Suspense>

        <Suspense
          fallback={
            <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border w-full rounded-xl border p-5">
              <Spinner className="mx-auto w-fit" />
            </div>
          }
        >
          <FetchWrapper<
            ActorsList,
            APIGetActorsWithMostMoviesParams,
            typeof aPIGetActorsWithMostMovies
          >
            apiFetch={aPIGetActorsWithMostMovies}
            params={{}}
          >
            {({ result, lang }) => (
              <ActorsCarousel
                name={t("topActorsCarousel")}
                actors={result.data.actors}
                lang={lang}
                avatarURL={AVATAR_URL || "NO URL!"}
              />
            )}
          </FetchWrapper>
        </Suspense>
      </main>
    </>
  );
}
