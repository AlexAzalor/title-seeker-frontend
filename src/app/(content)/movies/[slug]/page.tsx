import { auth } from "@/auth";
import dynamic from "next/dynamic";
import { getLocale, getTranslations } from "next-intl/server";

import { checkIfAdmin, checkIfOwner } from "@/middleware";
import { AVATAR_URL, backendURL, POSTER_URL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";

import { LastWatchedWrapper } from "@/components/layout/last-watched-wrapper";
import { MovieInfo } from "@/components/movie/movie-page/info/movie-info";
import { MovieFiltersdata } from "@/components/movie/movie-page/components/movie-filters-data";
import { MovieContent } from "@/components/movie/movie-page/components/movie-content";
import { RelatedMoviesSidebar } from "@/components/movie/movie-page/components/related-movies-sidebar";
import { SharedUniverseSection } from "@/components/movie/movie-page/components/shared-universe-section";
import { MoviePoster } from "@/components/movie/movie-page/components/movie-poster";
import type { PageProps } from "@/types/general";

const SimilarMoviesFetcher = dynamic(
  () => import("@/components/movie/movie-page/similar-movies-fetcher"),
);

const posterUrl = POSTER_URL || "";
const avatarUrl = AVATAR_URL || "";

export default async function DynamicPage({ params }: PageProps) {
  const { slug: movie_key } = await params;

  const session = await auth();
  const t = await getTranslations("Rating");
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetMovie } = getMovies();
  const { data } = await aPIGetMovie(
    movie_key,
    { lang, user_uuid: session?.user.uuid },
    backendURL,
  );

  const isAdmin = checkIfAdmin(session?.user.role);
  const isOwner = checkIfOwner(session?.user.role);

  return (
    <>
      <title>{`${data.title} (${new Date(data.release_date).getFullYear()}) | Title Seeker`}</title>

      <LastWatchedWrapper movieKey={movie_key} poster={data.poster}>
        <div className="container min-h-screen max-w-320 px-4 lg:px-0">
          <div className="py-2 text-center lg:py-3 xl:text-left">
            <h1 className="text-3xl">{data.title}</h1>
            {data.title_en && (
              <span className="text-light-gray text-lg font-medium">
                ({data.title_en})
              </span>
            )}
          </div>

          <div className="flex flex-col items-center xl:flex-row">
            <MoviePoster
              posterUrl={posterUrl}
              poster={data.poster}
              title={data.title}
            />

            <MovieFiltersdata
              movieKey={movie_key}
              genres={data.genres}
              subgenres={data.subgenres}
              specifications={data.specifications}
              keywords={data.keywords}
              actionTimes={data.action_times}
            />

            <RelatedMoviesSidebar
              relatedMovies={data.related_movies}
              posterUrl={posterUrl}
              currentMovieKey={data.key}
              movieKey={movie_key}
            />
          </div>

          <MovieInfo data={data} lang={lang} isOwner={isOwner} />

          <MovieContent
            data={data}
            avatarUrl={avatarUrl}
            t={t}
            isOwner={isOwner}
            isAdmin={isAdmin}
          />

          <div className="flex flex-col justify-between xl:flex-row xl:gap-6">
            <SharedUniverseSection
              sharedUniverse={data.shared_universe}
              sharedUniverseOrder={data.shared_universe_order}
              movieKey={data.key}
              posterUrl={posterUrl}
            />

            {!!data.related_movies?.length && (
              <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border mb-4 flex max-w-88 flex-col rounded-4xl border p-5 md:w-full md:max-w-none">
                <SimilarMoviesFetcher movieKey={movie_key} bottom />
              </div>
            )}
          </div>
        </div>
      </LastWatchedWrapper>
    </>
  );
}
