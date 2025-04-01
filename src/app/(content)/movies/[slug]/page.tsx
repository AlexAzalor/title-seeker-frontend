import { Suspense } from "react";
import Image from "next/image";
import { AVATAR_URL, backendURL, POSTER_URL } from "@/lib/constants";
import {
  APIGetSimilarMoviesParams,
  Language,
  SimilarMovieOutList,
} from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";

import { PageProps } from "@/types/general";
import { getLocale, getTranslations } from "next-intl/server";
import { formatDate } from "@/lib/utils";
import { MovieRateBox } from "@/components/movie/movie-rate-box";
import { GenresList } from "@/components/movie/movie-page/genres-list";
import { FeaturesList } from "@/components/movie/movie-page/features-list";
import { ExpandableText } from "@/components/custom/expandable-text";
import { MovieCrew } from "@/components/movie/movie-crew";
import { MovieMoney } from "@/components/movie/movie-money";

import { LastWatchedWrapper } from "@/components/movie/last-watched-wrapper";

import { RelatedSimilarList } from "@/components/movie/movie-page/related-similar-list";
import { MoviesCollection } from "@/components/movie/movie-page/movies-collection";
import { FetchWrapper } from "@/components/movie/fetch-wrapper";
import { Spinner } from "@/components/spinner";

export default async function DynamicPage({ params }: PageProps) {
  const { slug: movie_key } = await params;

  const t = await getTranslations("HomePage");
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetMovie, aPIGetSimilarMovies } = getMovies();
  const { data } = await aPIGetMovie(movie_key, { lang }, backendURL);

  // need refactor?
  const relatedMoviesFetcher = (bottom?: boolean) => {
    return (
      <Suspense
        fallback={
          <div className="shadow-form-layout dark:shadow-dark-form-layout min-w-76 rounded-[34px] border border-[#EFF0F7] p-5 dark:border-[#211979]">
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
              name="Similar Movies"
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

  return (
    <LastWatchedWrapper movie={{ key: movie_key, poster: data.poster }}>
      <div className="container min-h-screen max-w-[1280px] px-4 lg:px-0">
        <h1 className="py-5 text-center text-3xl lg:text-left">{data.title}</h1>

        <div className="flex flex-col items-center xl:flex-row">
          <div className="">
            <Image
              src={`${POSTER_URL}/posters/${data.poster}`}
              alt="Movie Poster"
              className="h-[450px] w-[300px] max-w-none"
              height={450}
              width={300}
            />
          </div>

          <div className="mx-6">
            <GenresList data={data} />

            <FeaturesList
              specifications={data.specifications}
              keywords={data.keywords}
              action_times={data.action_times}
            />
          </div>

          <div className="lg:ml-auto">
            {data.related_movies?.length ? (
              <RelatedSimilarList
                type="related"
                name="Related Movies"
                movies={data.related_movies}
                posterUrl={POSTER_URL || "NO URL!!!"}
                currentMovieKey={data.key}
              />
            ) : (
              relatedMoviesFetcher()
            )}
          </div>
        </div>

        <div className="my-4 grid w-full grid-cols-1 place-items-center gap-3 lg:grid-cols-3">
          <MovieMoney
            budget={data.budget}
            domesticGross={data.domestic_gross}
            worldwideGross={data.worldwide_gross}
          />

          <div className="rating-text2 text-center text-2xl">
            <div className="movie-duration">{data.duration}</div>
            {data.release_date ? (
              <div className="movie-release-date">
                {formatDate(data.release_date, lang)}
              </div>
            ) : (
              "no release date"
            )}
            <div title={data.location} className="movie-location">
              {data.location.length >= 30
                ? data.location.slice(0, 30) + "..."
                : data.location}
            </div>
          </div>

          <div className="rating-box grid place-content-center text-5xl">
            <span className="relative">
              <span className="rating-text">{data.average_rating}</span>{" "}
              <span className="absolute bottom-0 ml-1 text-xl text-gray-300">
                ({data.ratings_count})
              </span>
            </span>
          </div>
        </div>

        <div className="mb-4 flex flex-col justify-between gap-6 lg:flex-row">
          <div className="pt-6">
            <ExpandableText text={data.description} />

            <MovieCrew
              avatarURL={AVATAR_URL || "NO URL!!!"}
              actors={data.actors}
              directors={data.directors}
            />
          </div>

          <div className="hidden lg:block">
            <MovieRateBox data={data} ratingData={data.user_rating} />
          </div>
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
  );
}
