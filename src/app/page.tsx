import { useTranslations } from "next-intl";
import { ActorsCarousel } from "@/components/actors-carousel";
import { FetchWrapper } from "@/components/my-custom-ui/fetch-wrapper";
import { LastWatched } from "@/components/layout/last-watched";
import { MoviesCarousel } from "@/components/movie/movie-carousel";
import { AVATAR_URL, POSTER_URL } from "@/lib/constants";
import { getPeople } from "@/orval_api/people/people";
import {
  ActorsList,
  APIGetActorsWithMostMoviesParams,
  APIGetRandomListParams,
  MovieCarouselList,
} from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";

export default function Home() {
  const t = useTranslations("HomePage");
  const keyFeatures = Object.keys(t.raw("keyFeatures.keys"));
  const { aPIGetActorsWithMostMovies } = getPeople();
  const { aPIGetRandomList } = getMovies();
  return (
    <>
      <main className="container flex min-h-screen max-w-[1280px] flex-col items-center gap-5 p-4 lg:p-10">
        <h1 className="text-4xl lg:text-7xl">{t("title")}</h1>
        <h2 className="max-w-200 text-center">{t("subTitle")}</h2>
        <p className="text-2xl">{t("description")}</p>
        <h3>{t("solution")}</h3>

        <p className="text-2xl font-bold">{t("keyFeatures.title")}</p>
        <ul className="flex flex-wrap items-center justify-center gap-3">
          {keyFeatures.map((key) => (
            <li key={key}>
              <p className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border h-[158px] max-w-[340px] items-center gap-2 rounded-[34px] border p-6 font-bold">
                {t(`keyFeatures.keys.${key}`)}
              </p>
            </li>
          ))}
        </ul>

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
              movies={result.data.movies}
              lang={lang}
              posterURL={POSTER_URL || "NO URL!"}
              avatarURL={AVATAR_URL || "NO URL!"}
            />
          )}
        </FetchWrapper>

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
              actors={result.data.actors}
              lang={lang}
              avatarURL={AVATAR_URL || "NO URL!"}
            />
          )}
        </FetchWrapper>

        {/* <LastWatched posterURL={POSTER_URL || "NO URL!"} /> */}
      </main>
    </>
  );
}
