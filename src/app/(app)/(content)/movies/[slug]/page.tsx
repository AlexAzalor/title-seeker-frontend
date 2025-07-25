import { cache } from "react";
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
import { ShareLinkButtons } from "@/components/movie/movie-page/components/share-link-buttons";

import type { PageProps } from "@/types/general";
import type { Metadata } from "next";

const SimilarMoviesFetcher = dynamic(
  () => import("@/components/movie/movie-page/similar-movies-fetcher"),
);

const posterUrl = POSTER_URL || "";
const avatarUrl = AVATAR_URL || "";

/** Prevent two requests to the backend */
const getMovie = cache(async (slug: string) => {
  const session = await auth();
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetMovie } = getMovies();
  const { data } = await aPIGetMovie(
    slug,
    {
      lang,
      user_uuid: session?.user.uuid,
    },
    backendURL,
  );
  return data;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const movie = await getMovie(slug);

  return {
    title: `${movie.title} (${new Date(movie.release_date).getFullYear()}) | Title Seeker`,
    openGraph: {
      images: [`${posterUrl}/posters/${movie.poster}`],
    },
  };
}

export default async function MoviePage({ params }: PageProps) {
  const { slug: movie_key } = await params;

  const session = await auth();
  const t = await getTranslations("Rating");
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const movie = await getMovie(movie_key);

  const isAdmin = checkIfAdmin(session?.user.role);
  const isOwner = checkIfOwner(session?.user.role);

  return (
    <LastWatchedWrapper movieKey={movie_key} poster={movie.poster}>
      <div className="container min-h-screen max-w-320 px-4 lg:px-0">
        <div className="flex items-center justify-center py-2 text-center md:justify-between lg:py-3 xl:text-left">
          <div>
            <h1 className="text-3xl">{movie.title}</h1>
            {movie.title_en && (
              <span className="text-light-gray text-lg font-medium">
                ({movie.title_en})
              </span>
            )}
          </div>

          <ShareLinkButtons />
        </div>

        <div className="flex flex-col items-center xl:flex-row">
          <MoviePoster
            posterUrl={posterUrl}
            poster={movie.poster}
            title={movie.title}
          />

          <MovieFiltersdata
            movieKey={movie_key}
            genres={movie.genres}
            subgenres={movie.subgenres}
            specifications={movie.specifications}
            keywords={movie.keywords}
            actionTimes={movie.action_times}
          />

          <RelatedMoviesSidebar
            relatedMovies={movie.related_movies}
            posterUrl={posterUrl}
            currentMovieKey={movie.key}
            movieKey={movie_key}
          />
        </div>

        <MovieInfo data={movie} lang={lang} isOwner={isOwner} />

        <MovieContent
          data={movie}
          avatarUrl={avatarUrl}
          t={t}
          isOwner={isOwner}
          isAdmin={isAdmin}
        />

        <div className="flex flex-col justify-between xl:flex-row xl:gap-6">
          <SharedUniverseSection
            sharedUniverse={movie.shared_universe}
            sharedUniverseOrder={movie.shared_universe_order}
            movieKey={movie.key}
            posterUrl={posterUrl}
          />

          {!!movie.related_movies?.length && (
            <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border mb-4 flex max-w-88 flex-col rounded-4xl border p-5 md:w-full md:max-w-none">
              <SimilarMoviesFetcher movieKey={movie_key} bottom />
            </div>
          )}
        </div>
      </div>
    </LastWatchedWrapper>
  );
}
