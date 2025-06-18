import { POSTER_URL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Language, MoviePreviewOut } from "@/orval_api/model";
import Image from "next/image";
import Link from "next/link";

const MAX_LENGTH = 40;

type Props = {
  movies: MoviePreviewOut[];
  lang: Language;
};

export const MovieList = ({ movies, lang }: Props) => {
  return movies.map((movie, i) => (
    <Link
      aria-label={"movie-link" + "-" + i}
      key={movie.key}
      className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border grid h-[158px] w-[340px] grid-cols-[1fr_3fr] items-center gap-2 rounded-[34px] border p-6"
      href={`/movies/${movie.key}`}
    >
      <Image
        src={`${POSTER_URL}/posters/${movie.poster}`}
        alt="Movie poster"
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
          {movie.release_date
            ? formatDate(movie.release_date, lang)
            : "no date"}
        </div>
        <div className="flex gap-1">
          <div>{movie.duration}</div>|<div>{movie.main_genre}</div>
        </div>
      </div>
    </Link>
  ));
};
