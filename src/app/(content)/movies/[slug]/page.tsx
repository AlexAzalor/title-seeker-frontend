import { backendURL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";

import { PageProps } from "@/types/general";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { MovieRateBox } from "@/components/movie/movie-rate-box";
import { GenresList } from "@/components/movie/movie-page/genres-list";
import { FeaturesList } from "@/components/movie/movie-page/features-list";
import { ExpandableText } from "@/components/custom/expandable-text";
import { MovieCrew } from "@/components/movie/movie-crew";
import { MovieMoney } from "@/components/movie/movie-money";

export default async function DynamicPage({ params }: PageProps) {
  const { slug: movie_key } = await params;

  const t = await getTranslations("HomePage");
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetMovie } = getMovies();
  const { data } = await aPIGetMovie(movie_key, { lang }, backendURL);

  return (
    <div className="min-h-screen max-w-[1280px]">
      <h1 className="py-5 text-3xl">{data.title}</h1>

      <div className="flex items-center">
        <Image
          src={`http://127.0.0.1:5002/api/movies/poster/${data.poster}`}
          alt="Actor Avatar"
          height={400}
          width={300}
        />

        <div className="mx-6">
          <GenresList data={data} />

          <FeaturesList
            specifications={data.specifications}
            keywords={data.keywords}
            action_times={data.action_times}
          />
        </div>

        {/* some text that say about absence of related movie, because it may be confusing sometimes */}
        {/* different box color? */}
        <div className="border-cold9 flex flex-grow-1 flex-col items-center border-1">
          <div>Some related movie 1</div>
          <div>Some related movie 2</div>
          <div>Some related movie 3</div>
        </div>
      </div>

      <div className="my-4 grid w-full grid-cols-3 place-items-center">
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

      <div className="flex justify-between gap-6">
        <div className="pt-6">
          <ExpandableText text={data.description} />

          <MovieCrew actors={data.actors} directors={data.directors} />
        </div>

        <MovieRateBox data={data} ratingData={data.user_rating} />
      </div>
    </div>
  );
}
