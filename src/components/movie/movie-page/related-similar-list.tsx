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

export const RelatedSimilarList = ({
  type,
  movies,
  posterUrl,
  currentMovieKey,
  bottom,
}: Props) => {
  const t = useTranslations("MovieParts");

  return (
    <div
      aria-label="related-similar-list"
      className={cn(
        "shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border max-w-84 rounded-lg border p-2 lg:w-76 lg:rounded-[34px] lg:p-5",
        bottom && "mb-4 w-full min-w-76",
      )}
    >
      <h4 className={cn("text-lg", bottom && "p-2 text-2xl")}>
        {type === "related" ? t("related") : t("similar")}
      </h4>

      <div className="flex max-h-80 flex-grow-1 flex-row gap-1 overflow-y-auto xl:max-w-none xl:flex-col">
        {movies.map((movie) => (
          <Link
            href={`/movies/${movie.key}`}
            key={movie.key}
            className={cn(
              "dark:hover:bg-main-dark-hover flex items-center gap-4 rounded-xl transition-all duration-200 select-none hover:bg-neutral-100",
              currentMovieKey === movie.key &&
                "dark:bg-main-dark-hover pointer-events-none bg-neutral-100",
            )}
          >
            <Image
              src={`${posterUrl}/posters/${movie.poster}`}
              alt="Movie poster"
              // remove warning about width and height
              style={{
                height: "60px",
                width: "40px",
              }}
              height={60}
              width={40}
              className="shrink-0 grow-0 basis-auto rounded-lg md:basis-1/2 xl:basis-1/10"
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
    </div>
  );
};
