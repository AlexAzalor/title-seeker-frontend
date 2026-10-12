import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { AVATAR_URL, POSTER_URL } from "@/lib/constants";

import { RevealOnScroll } from "@/components/my-custom-ui/reveal-on-scroll";
import { PeopleCarousel } from "@/components/actors-carousel";
import { FetchWrapper } from "@/components/my-custom-ui/fetch-wrapper";
import { MoviesCarousel } from "@/components/movie/movie-carousel";
import { Spinner } from "@/components/my-custom-ui/spinner";

import { getPeople } from "@/orval_api/people/people";
import { getMovies } from "@/orval_api/movies/movies";
import type {
  APIGetActorsWithMostMoviesParams,
  APIGetDirectorsWithMostMoviesParams,
  APIGetRandomListParams,
  MovieCarouselList,
  PeopleList,
} from "@/orval_api/model";
import { getFilters } from "@/orval_api/filters/filters";

export default function Home() {
  const t = useTranslations("HomePage");

  const { aPIGetActorsWithMostMovies, aPIGetDirectorsWithMostMovies } =
    getPeople();
  const { aPIGetRandomList } = getMovies();
  const {
    aPIGetTopMoviesBySpecification,
    aPIGetTopMoviesByKeyword,
    aPIGetTopMoviesByVisualProfile,
  } = getFilters();

  return (
    <>
      <main className="container flex min-h-screen flex-col items-center gap-5 p-4 lg:px-10 lg:py-8">
        <h1 className="to-main-ui-purple bg-gradient-to-r from-blue-600 via-purple-700 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-lg transition-transform duration-900 ease-in-out lg:text-7xl">
          {t("title")}
        </h1>

        <h2 className="max-w-210 text-center text-lg leading-relaxed font-semibold tracking-wide text-gray-700 lg:text-2xl dark:text-gray-300">
          {t("subTitle")}
        </h2>

        <RevealOnScroll>
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
              typeof aPIGetTopMoviesByVisualProfile
            >
              apiFetch={aPIGetTopMoviesByVisualProfile}
              params={{}}
            >
              {({ result }) => (
                <MoviesCarousel
                  name={t("randomMovies")}
                  movies={result.data.movies}
                  movieFilter={result.data.movie_filter}
                  type={t(`filterItems.${result.data.movie_filter?.type}`)}
                  posterURL={POSTER_URL || "NO URL!"}
                  avatarURL={AVATAR_URL || "NO URL!"}
                  delay={15000}
                />
              )}
            </FetchWrapper>
          </Suspense>
        </RevealOnScroll>
        <RevealOnScroll>
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
              typeof aPIGetTopMoviesBySpecification
            >
              apiFetch={aPIGetTopMoviesBySpecification}
              params={{}}
            >
              {({ result }) => (
                <MoviesCarousel
                  name={t("randomMovies")}
                  movies={result.data.movies}
                  movieFilter={result.data.movie_filter}
                  type={t(`filterItems.${result.data.movie_filter?.type}`)}
                  posterURL={POSTER_URL || "NO URL!"}
                  avatarURL={AVATAR_URL || "NO URL!"}
                  delay={15000}
                />
              )}
            </FetchWrapper>
          </Suspense>
        </RevealOnScroll>

        <RevealOnScroll>
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
              typeof aPIGetTopMoviesByKeyword
            >
              apiFetch={aPIGetTopMoviesByKeyword}
              params={{}}
            >
              {({ result }) => (
                <MoviesCarousel
                  name={t("randomMovies")}
                  movies={result.data.movies}
                  movieFilter={result.data.movie_filter}
                  type={t(`filterItems.${result.data.movie_filter?.type}`)}
                  posterURL={POSTER_URL || "NO URL!"}
                  avatarURL={AVATAR_URL || "NO URL!"}
                  delay={15000}
                />
              )}
            </FetchWrapper>
          </Suspense>
        </RevealOnScroll>

        <RevealOnScroll>
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
              {({ result }) => (
                <MoviesCarousel
                  name={t("randomMovies")}
                  movies={result.data.movies}
                  posterURL={POSTER_URL || "NO URL!"}
                  avatarURL={AVATAR_URL || "NO URL!"}
                />
              )}
            </FetchWrapper>
          </Suspense>
        </RevealOnScroll>

        <RevealOnScroll>
          <Suspense
            fallback={
              <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border w-full rounded-xl border p-5">
                <Spinner className="mx-auto w-fit" />
              </div>
            }
          >
            <FetchWrapper<
              PeopleList,
              APIGetActorsWithMostMoviesParams,
              typeof aPIGetActorsWithMostMovies
            >
              apiFetch={aPIGetActorsWithMostMovies}
              params={{}}
            >
              {({ result, lang }) => (
                <PeopleCarousel
                  type="actor"
                  name={t("topActorsCarousel")}
                  people={result.data.people}
                  lang={lang}
                  avatarURL={AVATAR_URL || "NO URL!"}
                />
              )}
            </FetchWrapper>
          </Suspense>
        </RevealOnScroll>

        <RevealOnScroll>
          <Suspense
            fallback={
              <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border w-full rounded-xl border p-5">
                <Spinner className="mx-auto w-fit" />
              </div>
            }
          >
            <FetchWrapper<
              PeopleList,
              APIGetDirectorsWithMostMoviesParams,
              typeof aPIGetDirectorsWithMostMovies
            >
              apiFetch={aPIGetDirectorsWithMostMovies}
              params={{}}
            >
              {({ result, lang }) => (
                <PeopleCarousel
                  type="director"
                  name={t("topDirectorsCarousel")}
                  people={result.data.people}
                  lang={lang}
                  avatarURL={AVATAR_URL || "NO URL!"}
                />
              )}
            </FetchWrapper>
          </Suspense>
        </RevealOnScroll>
      </main>
    </>
  );
}
