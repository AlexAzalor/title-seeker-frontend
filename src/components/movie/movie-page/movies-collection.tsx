"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SharedUniverseOut } from "@/orval_api/model";

type Props = {
  data: SharedUniverseOut;
  posterUrl: string;
  currentMovieKey: string;
  index: number;
};

export const MoviesCollection = ({
  data,
  posterUrl,
  currentMovieKey,
  index,
}: Props) => {
  const activeItemRef = useRef<HTMLAnchorElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current && activeItemRef.current) {
      const list = listRef.current;
      const activeItem = activeItemRef.current;

      // Calculate offset of active item relative to list
      const offsetTop = activeItem.offsetTop - list.offsetTop;

      // Center the active item in the scrollable container
      list.scrollTop =
        offsetTop - list.clientHeight / 2 + activeItem.clientHeight / 2;
    }
  }, []);

  return (
    <div
      aria-label="movies-collection"
      ref={listRef}
      className="flex max-h-80 flex-col gap-1 overflow-y-auto"
    >
      {data.movies.map((movie, i) => (
        <Link
          ref={index === i ? activeItemRef : null}
          href={`/movies/${movie.key}`}
          key={movie.key}
          scroll={false}
          className={cn(
            "dark:hover:bg-main-dark-hover flex items-center gap-4 rounded-xl transition-all duration-200 select-none hover:bg-neutral-100",
            currentMovieKey === movie.key &&
              "dark:bg-main-dark-hover pointer-events-none bg-neutral-100",
          )}
        >
          <Image
            src={`${posterUrl}/posters/${movie.poster}`}
            alt="Movie poster"
            className="rounded-lg"
            // remove warning about width and height
            style={{
              height: "60px",
              width: "40px",
            }}
            height={60}
            width={40}
            blurDataURL="/static/blur-image.webp"
            placeholder="blur"
            loading="lazy"
          />

          <div className="text-lg">
            {movie.order}. {movie.title}
          </div>
        </Link>
      ))}
    </div>
  );
};
