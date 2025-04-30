import { POSTER_URL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Language, MoviePreviewOut } from "@/orval_api/model";
import Image from "next/image";
import Link from "next/link";

type Props = {
  movies: MoviePreviewOut[];
  lang: Language;
};

export const MovieList = ({ movies, lang }: Props) => {
  return movies.map((movie) => (
    <Link
      key={movie.key}
      className="shadow-form-layout dark:shadow-dark-form-layout grid h-[158px] w-[340px] grid-cols-[1fr_3fr] items-center gap-2 rounded-[34px] border border-[#EFF0F7] p-6 dark:border-[#211979]"
      href={`/movies/${movie.key}`}
    >
      {movie.poster && (
        <Image
          src={`${POSTER_URL}/posters/${movie.poster}`}
          alt="Movie poster"
          height={200}
          width={100}
        />
      )}
      <div className="flex h-full flex-col justify-between self-start">
        <p title={movie.title} className="text-xl font-bold">
          {movie.title.length > 40
            ? movie.title.slice(0, 40) + "..."
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
