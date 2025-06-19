"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/use-media-query";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useLastWatchedStore } from "@/lib/store";

type Props = {
  posterURL: string;
};

export const LastSeenTitles = ({ posterURL }: Props) => {
  const t = useTranslations("Other");
  const isMobile = useMediaQuery("(max-width: 640px)");

  const movies = useLastWatchedStore((s) => s.movies);
  const loadFromStorage = useLastWatchedStore((s) => s.loadFromStorage);

  useEffect(() => {
    if (movies.length === 0) {
      loadFromStorage();
    }
  }, [loadFromStorage, movies.length]);

  if (movies.length === 0) return null;

  return (
    <div className="mx-auto my-2 max-w-[1280px] text-center">
      <h2 className="mb-3 text-2xl font-bold">{t("lastSeenTitles")}</h2>

      {isMobile ? (
        <Carousel className="w-full" opts={{ dragFree: true }}>
          <CarouselContent className="-ml-1 max-w-[340px] lg:max-w-none">
            {movies.map((title) => (
              <CarouselItem
                key={title.key}
                className="basis-auto pl-1 md:basis-1/2 lg:basis-1/10"
              >
                <div className="p-1">
                  <Card className="">
                    <CardContent className="flex aspect-square items-center justify-center p-2">
                      <Link
                        href={`/movies/${title.key}`}
                        scroll
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
      ) : (
        <div className="flex flex-row justify-center gap-1 lg:gap-5">
          {movies.map((title) => (
            <Link key={title.key} href={`/movies/${title.key}`}>
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
