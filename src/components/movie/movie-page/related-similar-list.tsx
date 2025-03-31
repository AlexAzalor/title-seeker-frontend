import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { RelatedMovie } from "@/orval_api/model";

type Props = {
  name: string;
  movies: {
    key: string;
    poster: string;
    relation_type?: RelatedMovie;
    title: string;
  }[];
  posterUrl: string;
  currentMovieKey: string;
  type: "related" | "similar";
  bottom?: boolean;
};

export const RelatedSimilarList = ({
  type,
  name,
  movies,
  posterUrl,
  currentMovieKey,
  bottom,
}: Props) => {
  return (
    <div
      className={cn(
        "shadow-form-layout dark:shadow-dark-form-layout w-76 rounded-[34px] border border-[#EFF0F7] p-5 dark:border-[#211979]",
        bottom && "mb-4 w-auto min-w-76",
      )}
    >
      <h4 className="text-lg">{name}</h4>

      <div className="flex max-h-80 flex-grow-1 flex-col gap-1 overflow-y-auto">
        {movies.map((movie) => (
          <Link
            href={`/movies/${movie.key}`}
            key={movie.key}
            className={cn(
              "flex items-center gap-4 rounded-xl transition-all duration-200 select-none hover:bg-neutral-100 dark:hover:bg-[#1A183D]",
              currentMovieKey === movie.key &&
                "pointer-events-none bg-neutral-100 dark:bg-[#1A183D]",
            )}
          >
            <Image
              src={`${posterUrl}/posters/${movie.poster}`}
              alt="Actor Avatar"
              height={60}
              width={40}
              className="rounded-lg"
            />
            <div>
              <div className="text-[16px]">{movie.title}</div>
              {type === "related" && (
                <div className="italic">{movie.relation_type}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
