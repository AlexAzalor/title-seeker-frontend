"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatDate } from "@/lib/utils";
import { MovieSearchOut } from "@/orval_api/model";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
type Props = {
  posterURL: string;
};
export const LastWatched = ({ posterURL }: Props) => {
  const lang = useLocale();

  const parsedData = useLocalStorage<MovieSearchOut[]>(
    "recent_search",
    [] as MovieSearchOut[],
  );

  return (
    parsedData.length > 0 && (
      <>
        <h2 className="text-2xl font-bold">Last Watched</h2>

        <div className="flex flex-col gap-5 lg:flex-row">
          {parsedData.reverse().map((title) => (
            <Link
              key={title.key}
              href={`/movies/${title.key}`}
              className="flex w-full items-center gap-2"
            >
              <Image
                src={`${posterURL}/posters/${title.poster}`}
                alt="Title Poster"
                height={100}
                width={80}
              />
              <div>
                <p className="text-lg font-bold">{`${title.title_en} (${title.title_uk})`}</p>
                <span>{formatDate(title.release_date, lang)}</span>
                {" | "}
                <span>{title.main_genre}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    )
  );
};
