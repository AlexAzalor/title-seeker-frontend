import Image from "next/image";
import Link from "next/link";
import { POSTER_URL } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import type { Language, MoviePreviewOut } from "@/orval_api/model";

const MAX_LENGTH = 30;

type Props = {
  movies: MoviePreviewOut[];
  lang: Language;
};

export const MovieList = ({ movies, lang }: Props) => {
  return movies.map((movie, i) => (
    <Link
      aria-label={"movie-link" + "-" + i}
      key={movie.key}
      className={cn(
        "shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border flex h-[158px] w-76 items-center gap-2 rounded-[34px] border p-6 lg:w-86",
        !!movie.rating && "users-rated-movie p-2",
      )}
      href={`/movies/${movie.key}`}
    >
      <Image
        src={`${POSTER_URL}/posters/${movie.poster}`}
        alt="Movie poster"
        // remove warning about width and height
        style={{
          height: "104px",
          width: "70px",
        }}
        height={104}
        width={70}
        blurDataURL="/static/blur-image.webp"
        placeholder="blur"
      />

      <div className="my-auto flex flex-col justify-between gap-2 self-start">
        <p title={movie.title} className="text-xl font-bold">
          {movie.title.length > MAX_LENGTH
            ? movie.title.slice(0, MAX_LENGTH) + "..."
            : movie.title}
        </p>
        <div>
          <span>
            {movie.release_date
              ? formatDate(movie.release_date, lang)
              : "no date"}
          </span>
          {!movie.main_genre ? (
            <div>{movie.duration}</div>
          ) : (
            <div className="flex gap-1">
              <div>{movie.duration}</div>|<div>{movie.main_genre}</div>
            </div>
          )}
        </div>
      </div>
      {!!movie.rating && (
        <div className="user-rating-text ml-auto text-3xl">{movie.rating}</div>
      )}
    </Link>
  ));
};
