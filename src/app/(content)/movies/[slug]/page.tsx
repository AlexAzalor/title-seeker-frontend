import { auth } from "@/auth";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { checkIfAdmin, checkIfOwner } from "@/middleware";
import { AVATAR_URL, backendURL, POSTER_URL } from "@/lib/constants";
import {
  APIGetSimilarMoviesParams,
  Language,
  SimilarMovieOutList,
} from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";

import { PageProps } from "@/types/general";
import { getLocale, getTranslations } from "next-intl/server";
import { MovieRateBox } from "@/components/movie/movie-page/movie-rate-box";
import { GenresList } from "@/components/movie/movie-page/genres-list";
import { MovieFilterList } from "@/components/movie/movie-page/movie-filter-list";
import { ExpandableText } from "@/components/my-custom-ui/expandable-text";
import { MovieCrew } from "@/components/movie/movie-page/movie-crew";
import { Button } from "@/components/ui/button";

import { LastWatchedWrapper } from "@/components/layout/last-watched-wrapper";

import { RelatedSimilarList } from "@/components/movie/movie-page/related-similar-list";
import { MoviesCollection } from "@/components/movie/movie-page/movies-collection";
import { FetchWrapper } from "@/components/my-custom-ui/fetch-wrapper";
import { Spinner } from "@/components/my-custom-ui/spinner";

import { MovieInfo } from "@/components/movie/movie-page/info/movie-info";
import { VisualProfileRadarChart } from "@/components/movie/movie-page/visual-profile.tsx/visual-profile-radar-chart";
import { CustomTabs } from "@/components/my-custom-ui/custom-tabs";

export default async function DynamicPage({ params }: PageProps) {
  const { slug: movie_key } = await params;

  const session = await auth();
  const t = await getTranslations("Rating");
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetMovie, aPIGetSimilarMovies } = getMovies();
  const { data } = await aPIGetMovie(
    movie_key,
    { lang, user_uuid: session?.user.uuid },
    backendURL,
  );

  // need refactor?
  const relatedMoviesFetcher = (bottom?: boolean) => {
    return (
      <Suspense
        fallback={
          <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border min-w-76 rounded-[34px] border p-5">
            <Spinner className="mx-auto w-fit" />
          </div>
        }
      >
        <FetchWrapper<
          SimilarMovieOutList,
          APIGetSimilarMoviesParams,
          typeof aPIGetSimilarMovies
        >
          apiFetch={aPIGetSimilarMovies}
          params={{ movie_key }}
        >
          {({ result }) => (
            <RelatedSimilarList
              type="similar"
              movies={result.data.similar_movies}
              posterUrl={POSTER_URL || "NO URL!!!"}
              currentMovieKey={data.key}
              bottom={bottom}
            />
          )}
        </FetchWrapper>
      </Suspense>
    );
  };

  const isAdmin = checkIfAdmin(session?.user.role);
  const isOwner = checkIfOwner(session?.user.role);

  return (
    <>
      <title>{`${data.title} (${new Date(data.release_date).getFullYear()}) | Title Seeker`}</title>

      <LastWatchedWrapper movie={{ key: movie_key, poster: data.poster }}>
        <div className="container min-h-screen max-w-[1280px] px-4 lg:px-0">
          <div className="py-2 text-center lg:py-3 lg:text-left">
            <h1 className="text-3xl">{data.title}</h1>
            {data.title_en && (
              <span className="text-light-gray text-lg font-medium">
                ({data.title_en})
              </span>
            )}
          </div>

          <div className="flex flex-col items-center xl:flex-row">
            <div className="">
              <Image
                src={`${POSTER_URL}/posters/${data.poster}`}
                alt="Movie poster"
                className="h-[450px] w-[300px] max-w-none"
                height={450}
                width={300}
                priority
              />
            </div>

            <div className="mx-6">
              <GenresList
                movieKey={movie_key}
                genres={data.genres}
                subgenres={data.subgenres}
              />

              <MovieFilterList
                movieKey={movie_key}
                specifications={data.specifications}
                keywords={data.keywords}
                action_times={data.action_times}
              />
            </div>

            <div className="lg:ml-auto">
              {data.related_movies?.length ? (
                <RelatedSimilarList
                  type="related"
                  movies={data.related_movies}
                  posterUrl={POSTER_URL || "NO URL!!!"}
                  currentMovieKey={data.key}
                />
              ) : (
                relatedMoviesFetcher()
              )}
            </div>
          </div>

          <MovieInfo data={data} lang={lang} isOwner={isOwner} />

          <div className="mb-4 flex flex-col justify-between gap-6 lg:flex-row">
            <div className="pt-6">
              <ExpandableText text={data.description} />

              <MovieCrew
                avatarURL={AVATAR_URL || "NO URL!!!"}
                actors={data.actors}
                directors={data.directors}
              />
            </div>

            <CustomTabs
              className="h-[498px] max-w-[594px] lg:w-[594px]"
              header={
                <Link
                  href="/about-rating-system"
                  className="mx-auto"
                  target="_blank"
                >
                  <Button
                    variant="link"
                    className="text-light-gray h-auto w-auto p-0"
                  >
                    {t("about")}
                  </Button>
                </Link>
              }
              tabs={[
                {
                  key: "visual-profile",
                  component: (
                    <VisualProfileRadarChart
                      key="visual-profile"
                      movieKey={data.key}
                      radarData={data.visual_profile}
                      isOwner={isOwner}
                    />
                  ),
                },
                {
                  key: "movie-rate-box",
                  component: (
                    <MovieRateBox
                      key="movie-rate-box"
                      movieKey={data.key}
                      ratingType={data.rating_criterion}
                      isAdmin={isAdmin}
                      isUserRated={!!data.user_rating}
                      userRatingData={data.user_rating_criteria}
                      overallRatingCriteria={
                        data.overall_average_rating_criteria
                      }
                    />
                  ),
                },
              ]}
            />
          </div>

          <div className="flex flex-col justify-between lg:flex-row lg:gap-6">
            {!!data.shared_universe && data.shared_universe_order && (
              <div className="w-full">
                <MoviesCollection
                  data={data.shared_universe}
                  posterUrl={POSTER_URL || "NO URL!!!"}
                  currentMovieKey={data.key}
                  index={data.shared_universe_order - 1}
                />
              </div>
            )}

            {!!data.related_movies?.length && (
              <div className="w-full">{relatedMoviesFetcher(true)}</div>
            )}
          </div>
        </div>
      </LastWatchedWrapper>
    </>
  );
}
