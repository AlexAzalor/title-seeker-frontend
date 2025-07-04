import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { RelatedMovie } from "@/orval_api/model";

type Props = {
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

export const RelatedSimilarMovieList = ({
  type,
  movies,
  posterUrl,
  currentMovieKey,
  bottom,
}: Props) => {
  const t = useTranslations("MovieParts");

  return (
    <>
      <h4 className={cn("text-lg", bottom && "p-2 text-2xl")}>
        {type === "related" ? t("related") : t("similar")}
      </h4>

      <div
        aria-label="related-similar-list"
        className="custom-scrollbar mx-2 flex max-h-80 flex-grow-1 flex-row gap-2 overflow-visible overflow-y-auto md:m-0 xl:max-w-none xl:flex-col"
      >
        {movies.map((movie) => (
          <Link
            href={`/movies/${movie.key}#movie`}
            key={movie.key}
            className={cn(
              "dark:hover:bg-main-dark-hover mb-2 flex items-center gap-4 rounded-xl transition-all duration-200 select-none hover:bg-neutral-100 md:m-0",
              currentMovieKey === movie.key &&
                "dark:bg-main-dark-hover pointer-events-none bg-neutral-100",
            )}
          >
            <Image
              src={`${posterUrl}/posters/${movie.poster}`}
              alt="Movie poster"
              height={120}
              width={80}
              className="shrink-0 grow-0 basis-auto rounded-lg xl:h-15 xl:w-10"
              blurDataURL="/static/blur-image.webp"
              placeholder="blur"
              loading="lazy"
            />
            <div className="hidden xl:block">
              <div className="text-[16px]">{movie.title}</div>
              {type === "related" && (
                <div className="italic">{movie.relation_type}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
