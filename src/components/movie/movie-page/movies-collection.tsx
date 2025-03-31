"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { TooltipWrapper } from "@/components/custom/tooltip-wrapper";
import { cn } from "@/lib/utils";
import { SharedUniverseOut } from "@/orval_api/model";

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
    <>
      <div className="shadow-form-layout dark:shadow-dark-form-layout mb-4 flex flex-grow-1 flex-col rounded-[34px] border border-[#EFF0F7] p-5 dark:border-[#211979]">
        <Link
          href={`/super-search/?universe=${data.key}`}
          scroll={false}
          className="flex items-center gap-4 p-2 text-2xl"
        >
          {data.name}

          <TooltipWrapper content={data.description} className="text-center" />
        </Link>

        <div ref={listRef} className="flex h-43 flex-col gap-1 overflow-y-auto">
          {data.movies.map((movie, i) => (
            <Link
              ref={index === i ? activeItemRef : null}
              href={`/movies/${movie.key}`}
              key={movie.key}
              scroll={false}
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
              />

              <div className="text-lg">
                {movie.order}. {movie.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
