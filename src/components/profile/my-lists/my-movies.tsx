import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";

import { POSTER_URL } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import { Language, MoviePreviewOut } from "@/orval_api/model";

type Props = {
  movies: MoviePreviewOut[];
};

export const MyMovies = ({ movies }: Props) => {
  const locale = useLocale() as Language;
  return (
    <div className="mb-2 flex flex-col gap-4">
      {movies.map((movie) => (
        <Link
          href={`/movies/${movie.key}`}
          key={movie.key}
          className={cn(
            "flex items-center gap-4 rounded-xl px-2 transition-all duration-200 select-none hover:bg-neutral-100 dark:hover:bg-[#1A183D]",
          )}
        >
          <Image
            src={`${POSTER_URL}/posters/${movie.poster}`}
            alt="Actor Avatar"
            height={60}
            width={40}
            className="rounded-lg"
          />
          <div>
            <h3 title={movie.title} className="xs:text-2xl text-lg">
              {movie.title}
            </h3>
            <div className="flex items-center gap-1 text-[16px] 2xl:flex-row 2xl:gap-3">
              <p className="xs:block hidden">
                {formatDate(movie.release_date, locale)}
              </p>
              <span className="xs:block hidden">|</span>
              <p>{movie.main_genre}</p>
              <span className="hidden sm:block">|</span>
              <p className="hidden sm:block">{movie.duration}</p>
            </div>
          </div>
          <div className="ml-auto text-xl font-bold italic">{movie.rating}</div>
        </Link>
      ))}
    </div>
  );
};
