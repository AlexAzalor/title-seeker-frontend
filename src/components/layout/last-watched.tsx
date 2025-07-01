"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/use-media-query";

import { Card, CardContent } from "@/components/ui/card";
import { useLastWatchedStore } from "@/lib/store";
import { ReusableSimpleCarousel } from "@/components/my-custom-ui/reusable-simple-carousel";

type Props = {
  posterURL: string;
};

export const LastSeenTitles = ({ posterURL }: Props) => {
  const t = useTranslations("Other");
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const movies = useLastWatchedStore((s) => s.movies);
  const loadFromStorage = useLastWatchedStore((s) => s.loadFromStorage);

  useEffect(() => {
    if (movies.length === 0) {
      loadFromStorage();
    }
  }, [loadFromStorage, movies.length]);

  if (movies.length === 0) return null;

  return (
    <div className="mx-auto my-2 max-w-320 text-center">
      <h2 className="mb-3 text-2xl font-bold">{t("lastSeenTitles")}</h2>

      {isMobile ? (
        <ReusableSimpleCarousel items={movies}>
          {(title) => (
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-2">
                  <Link
                    href={`/movies/${title.key}#movie`}
                    scroll={true}
                    key={title.key}
                    className="flex flex-col items-center justify-start gap-3"
                  >
                    <Image
                      src={`${posterURL}/posters/${title.poster}`}
                      alt="Title Poster"
                      height={100}
                      width={80}
                      blurDataURL="/static/blur-image.webp"
                      placeholder="blur"
                      loading="lazy"
                    />
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </ReusableSimpleCarousel>
      ) : (
        <div className="flex flex-row justify-center gap-1 lg:gap-5">
          {movies.map((title) => (
            <Link key={title.key} href={`/movies/${title.key}#movie`}>
              <Image
                src={`${posterURL}/posters/${title.poster}`}
                alt="Title Poster"
                className="h-auto w-auto"
                height={100}
                width={80}
                blurDataURL="/static/blur-image.webp"
                placeholder="blur"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
