"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Info, Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Language } from "@/orval_api/model";
import { getTournamentMovieDetails } from "./actions";
import type { Movie, MovieDetails } from "./types";

export function Poster({
  movie,
  posterUrl,
}: {
  movie: Movie;
  posterUrl: string;
  sizes: string;
}) {
  const [failed, setFailed] = useState(false);
  const t = useTranslations("MovieTournament");
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800">
      {movie.poster && posterUrl && !failed ? (
        <Image
          src={`${posterUrl}/posters/${movie.poster}`}
          alt={t("posterAlt", { title: movie.title })}
          width={300}
          height={450}
          // sizes={sizes}
          className="inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full items-center justify-center p-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          {t("posterUnavailable")}
        </div>
      )}
    </div>
  );
}

function MovieInfo({ movie, lang }: { movie: Movie; lang: Language }) {
  const t = useTranslations("MovieTournament");
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  async function load() {
    setLoading(true);
    setError(false);
    try {
      setDetails(await getTournamentMovieDetails(movie.key, lang));
    } catch (err) {
      console.error("Movie details could not be loaded", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Popover
      onOpenChange={(open) => {
        if (open && !details && !loading && !error) void load();
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative z-10 size-11 shrink-0"
          aria-label={t("movieInfo", { title: movie.title })}
        >
          <Info className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={12}
        className="max-h-[70dvh] w-[min(22rem,calc(100vw-24px))] space-y-3 overflow-y-auto text-sm break-words"
      >
        {/* <h3 className="font-semibold">{movie.title}</h3> */}

        <div className="flex gap-1 text-lg">
          <p className="movie-release-date">
            {new Date(movie.release_date).getFullYear()}
          </p>{" "}
          | <p className="movie-duration">{movie.duration}</p>
        </div>
        {loading && (
          <p role="status" className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
            {t("loadingDetails")}
          </p>
        )}
        {error && (
          <div role="alert">
            {t("detailsError")}{" "}
            <Button variant="link" onClick={() => void load()}>
              {t("retry")}
            </Button>
          </div>
        )}
        {details && (
          <>
            <p className="text-base">
              {details.description || t("noDescription")}
            </p>
            <p className="text-lg">
              <strong className="text-genre">{t("genres")}:</strong>{" "}
              {details.genres.join(", ") || t("none")}
            </p>
            <p className="text-lg">
              <strong className="text-specification">
                {t("specifications")}:
              </strong>{" "}
              {details.specifications.join(", ") || t("none")}
            </p>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function MovieCard({
  movie,
  posterUrl,
  lang,
  onSelect,
  selected,
  locked,
}: {
  movie: Movie;
  posterUrl: string;
  lang: Language;
  onSelect: () => void;
  selected: boolean;
  locked: boolean;
}) {
  const t = useTranslations("MovieTournament");
  const reduced = useReducedMotion();
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{
        opacity: locked && !selected ? 0.45 : 1,
        y: 0,
        scale: selected && !reduced ? 1.02 : 1,
      }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: selected ? -10 : 10 }}
      transition={{ duration: reduced ? 0 : 0.2 }}
      className={cn(
        "relative w-full max-w-[326px] min-w-0 rounded-lg border bg-white p-2 shadow-sm transition-colors motion-reduce:transition-none sm:p-3 dark:bg-neutral-950",
        selected
          ? "border-main-ui-purple ring-main-ui-purple/40 ring-2 dark:border-indigo-400"
          : "hover:border-main-ui-purple border-neutral-200 dark:border-neutral-800 dark:hover:border-indigo-400",
      )}
    >
      <div className="flex h-20 min-w-0 items-center justify-between gap-0 sm:gap-1">
        <h1
          className="line-clamp-3 min-w-0 px-1 text-base font-semibold break-words sm:text-xl"
          title={movie.title}
        >
          {movie.title}
        </h1>
        <MovieInfo movie={movie} lang={lang} />
      </div>
      <Poster
        movie={movie}
        posterUrl={posterUrl}
        sizes="(max-width: 640px) calc((100vw - 66px) / 2), 300px"
      />
      <button
        type="button"
        onClick={onSelect}
        disabled={locked}
        aria-label={t("chooseMovie", { title: movie.title })}
        className="focus-visible:outline-main-ui-purple absolute inset-0 w-full cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-default"
      />
    </motion.article>
  );
}
