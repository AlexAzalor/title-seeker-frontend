import { useTranslations } from "next-intl";
import { cn, formatDate } from "@/lib/utils";
import { MovieMoney } from "@/components/movie/movie-page/movie-money";
import type { Language, MovieOut } from "@/orval_api/model";

type Props = {
  data: MovieOut;
  isOwner?: boolean;
  lang: Language;
};

const TEXT_LIMIT = 30;

export const MovieInfo = ({ data, isOwner, lang }: Props) => {
  const t = useTranslations("Rating.ratingType");

  const filmingLocation =
    data.location.length >= TEXT_LIMIT
      ? data.location.slice(0, TEXT_LIMIT) + "..."
      : data.location;

  const rating = isOwner
    ? data.owner_rating
    : data.user_rating || data.overall_average_rating;

  const blueBoxRating =
    data.user_rating || (data.owner_rating && isOwner) ? t("my") : t("overall");

  return (
    <div className="my-4 grid w-full grid-cols-1 place-items-center gap-3 xl:grid-cols-3">
      <MovieMoney
        budget={data.budget}
        domesticGross={data.domestic_gross}
        worldwideGross={data.worldwide_gross}
      />

      <div className="text-center text-2xl">
        <div className="movie-duration">{data.duration}</div>
        {data.release_date ? (
          <div className="movie-release-date">
            {formatDate(data.release_date, lang)}
          </div>
        ) : (
          "no release date"
        )}
        <div title={data.location} className="movie-location">
          {filmingLocation}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          title={blueBoxRating}
          className="rating-box grid place-content-center text-5xl"
        >
          <span className="relative">
            <span className="rating-text">{rating}</span>{" "}
            {!data.user_rating && !isOwner && (
              <span className="absolute bottom-0 ml-1 text-xl text-gray-300">
                ({data.ratings_count})
              </span>
            )}
          </span>
        </div>

        <div>
          {(data.user_rating || isOwner) && (
            <div
              title={t("overall")}
              className={cn(
                "user-rating-box relative mb-3 grid h-[46px] w-[124px] place-content-center text-2xl",
                isOwner && "mb-0 h-[100px] text-3xl",
              )}
            >
              <span className="relative">
                <span className="rating-text">
                  {data.overall_average_rating}
                </span>{" "}
                <span className="absolute bottom-0 ml-1 text-sm text-gray-400 dark:text-gray-300">
                  ({data.ratings_count})
                </span>
              </span>
            </div>
          )}

          {!isOwner && (
            <div
              title={t("owner")}
              className={cn(
                "owner-rating-box rating-text relative grid h-[100px] w-[124px] place-content-center text-3xl",
                data.user_rating && "h-[46px] text-2xl",
              )}
            >
              {data.owner_rating}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
