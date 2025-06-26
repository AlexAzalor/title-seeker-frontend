import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getLocale, getTranslations } from "next-intl/server";

import { checkIfAdmin, checkIfOwner } from "@/middleware";
import { AVATAR_URL, backendURL, POSTER_URL } from "@/lib/constants";
import { FilterEnum, Language } from "@/orval_api/model";

import { ExpandableText } from "@/components/my-custom-ui/expandable-text";
import { CustomTabs } from "@/components/my-custom-ui/custom-tabs";
import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { LastWatchedWrapper } from "@/components/layout/last-watched-wrapper";

import { MovieRateBox } from "@/components/movie/movie-page/movie-rate-box";
import { GenresList } from "@/components/movie/movie-page/genres-list";
import { MovieFilterList } from "@/components/movie/movie-page/movie-filter-list";
import { MovieCrew } from "@/components/movie/movie-page/movie-crew";
import { RelatedSimilarMovieList } from "@/components/movie/movie-page/related-similar-list";
import { MoviesCollection } from "@/components/movie/movie-page/movies-collection";
import { MovieInfo } from "@/components/movie/movie-page/info/movie-info";
import { VisualProfile } from "@/components/movie/movie-page/visual-profile.tsx/visual-profile";

import { getMovies } from "@/orval_api/movies/movies";
import type { PageProps } from "@/types/general";

const SimilarMoviesFetcher = dynamic(
  () => import("@/components/movie/movie-page/similar-movies-fetcher"),
);

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
            <div className="">
              <Image
                src={`${POSTER_URL}/posters/${data.poster}`}
                alt="Movie poster"
                className="max-h-75 max-w-50 sm:max-h-112 sm:max-w-76"
                height={450}
                width={300}
                priority
                loading="eager"
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

            <div className="xl:ml-auto">
              <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border max-w-84 rounded-lg border p-2 lg:w-76 lg:rounded-4xl lg:p-5">
                {data.related_movies?.length ? (
                  <RelatedSimilarMovieList
                    type="related"
                    movies={data.related_movies}
                    posterUrl={POSTER_URL || "NO URL!!!"}
                    currentMovieKey={data.key}
                  />
                ) : (
                  <SimilarMoviesFetcher movieKey={movie_key} />
                )}
              </div>
            </div>
          </div>

          <MovieInfo data={data} lang={lang} isOwner={isOwner} />

          <div className="mb-4 flex flex-col justify-between gap-6 xl:flex-row">
            <div className="pt-6 sm:mx-auto">
              <ExpandableText text={data.description} />

              <MovieCrew
                avatarURL={AVATAR_URL || "NO URL!!!"}
                actors={data.actors}
                directors={data.directors}
              />
            </div>

            <CustomTabs
              className="h-124 max-w-148 sm:mx-auto xl:w-148 xl:max-w-none"
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
                    <VisualProfile
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

          <div className="flex flex-col justify-between xl:flex-row xl:gap-6">
            {!!data.shared_universe && data.shared_universe_order && (
              <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border mb-4 flex w-full flex-col rounded-4xl border p-5">
                <Link
                  href={`/super-search/?${FilterEnum.shared_universe}=${data.key}`}
                  scroll={false}
                  className="flex items-center gap-4 p-2 text-2xl"
                >
                  {data.shared_universe.name}

                  <TooltipWrapper
                    content={data.description}
                    className="text-center"
                  />
                </Link>

                <MoviesCollection
                  data={data.shared_universe}
                  posterUrl={POSTER_URL || "NO URL!!!"}
                  currentMovieKey={data.key}
                  index={data.shared_universe_order - 1}
                />
              </div>
            )}

            {!!data.related_movies?.length && (
              <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border mb-4 flex w-full flex-col rounded-4xl border p-5">
                <SimilarMoviesFetcher movieKey={movie_key} bottom />
              </div>
            )}
          </div>
        </div>
      </LastWatchedWrapper>
    </>
  );
}
