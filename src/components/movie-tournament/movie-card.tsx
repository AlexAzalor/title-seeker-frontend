"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Language, MovieDetailOut } from "@/orval_api/model";

export function Poster({
  movie,
  posterUrl,
}: {
  movie: MovieDetailOut;
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

function MovieInfo({ movie }: { movie: MovieDetailOut; lang: Language }) {
  const t = useTranslations("MovieTournament");

  return (
    <Popover>
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
        <div className="flex gap-1 text-lg">
          <p className="movie-release-date">
            {new Date(movie.release_date).getFullYear()}
          </p>{" "}
          | <p className="movie-duration">{movie.duration}</p>
        </div>

        <p className="text-base">{movie.description || t("noDescription")}</p>
        <p className="text-lg">
          <strong className="text-genre">{t("genres")}:</strong>{" "}
          {movie.genres.join(", ") || t("none")}
        </p>
        <p className="text-lg">
          <strong className="text-specification">{t("specifications")}:</strong>{" "}
          {movie.specifications.join(", ") || t("none")}
        </p>
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
  movie: MovieDetailOut;
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
