import { backendURL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";

import { PageProps } from "@/types/general";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { RateCriteria } from "@/components/rate-criteria";

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
      <div className="flex items-center justify-between">
        {data.poster && (
          <Image
            src={`http://127.0.0.1:5002/api/movies/poster/${data.poster}`}
            alt="Actor Avatar"
            height={300}
            width={200}
          />
        )}

        <div className="text-3xl">
          <div className="">Rating: {data.average_rating}</div>
          <div>Count: {data.ratings_count}</div>
        </div>
      </div>
      <div>{data.budget}</div>
      {data.release_date ? (
        <div>{formatDate(data.release_date, lang)}</div>
      ) : (
        "no release date"
      )}
      <div>{data.duration}</div>
      <div>{data.domestic_gross}</div>
      <div>{data.worldwide_gross}</div>

      <div className="flex items-center justify-between gap-6">
        <div>
          <div className="flex gap-4 border">
            {data.genres?.map((genre) => (
              <Link
                href={`/super-search/?genre_name=${genre.key}`}
                className="border border-red-400 p-2"
                key={genre.key}
              >
                {genre.name}
              </Link>
            ))}
          </div>

          <div className="flex gap-4 border">
            {data.subgenres?.map((subgenre) => (
              <Link
                href={`/super-search/?subgenre_name=${subgenre.key}`}
                className="border border-red-400 p-2"
                key={subgenre.key}
              >
                {subgenre.name}
              </Link>
            ))}
          </div>

          <p>{data.description}</p>

          <div className="flex gap-3">
            {data.actors?.map((actor) => (
              <Link
                href={`/super-search/?actor_name=${actor.key}`}
                key={actor.key}
              >
                <h1 className="text-xl font-bold">
                  {actor.first_name + " " + actor.last_name}
                </h1>
                <span>{actor.character_name}</span>
                <Image
                  src={`http://127.0.0.1:5002/api/avatars/actors/${actor.avatar_url}`}
                  alt="Actor Avatar"
                  height={50}
                  width={50}
                />
              </Link>
            ))}
          </div>

          <div className="flex gap-3">
            {data.directors?.map((director) => (
              <Link
                href={`/super-search/?director_name=${director.key}`}
                key={director.key}
              >
                <h1 className="text-xl font-bold">
                  {director.first_name + " " + director.last_name}
                </h1>

                {director.avatar_url && (
                  <Image
                    src={`http://127.0.0.1:5002/api/avatars/directors/${director.avatar_url}`}
                    alt="Director Avatar"
                    height={100}
                    width={50}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <RateCriteria
            movieKey={data.key}
            ratingCriteria={data.user_rating}
            criteriaType={data.rating_criterion}
          />

          {data.ratings?.map((rating) => (
            <div key={rating.rating}>
              <div>{rating.rating}</div>
              <div>{rating.comment}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
