"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { useMediaQuery } from "@/hooks/use-media-query";

import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import type { Language, MovieCarousel } from "@/orval_api/model";

type Props = {
  name: string;
  movies: MovieCarousel[];
  lang: Language;
  posterURL: string;
  avatarURL: string;
};
export function MoviesCarousel({
  name,
  movies,
  lang,
  posterURL,
  avatarURL,
}: Props) {
  // wrapper?
  const plugin = useRef(Autoplay({ delay: 10000 }));
  const isMobile = useMediaQuery("(max-width: 640px)");
  const textLength = isMobile ? 20 : 40;
  return (
    <div className="w-full" aria-label="movies-carousel">
      <h2 className="mb-3">{name}</h2>
      <Carousel
        className="xl:w-full"
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={() => plugin.current.play()}
        opts={{ loop: true }}
      >
        <CarouselContent className="max-w-[340px] xl:max-w-none">
          {movies.map((movie) => (
            <CarouselItem key={movie.key} className="">
              <div className="p-1">
                <Link
                  key={movie.key}
                  className=" "
                  href={`/movies/${movie.key}`}
                >
                  <Card className="dark:border-dark-border">
                    <CardContent className="flex aspect-square h-52 w-full items-center justify-center gap-2 p-2">
                      {movie.poster && (
                        <Image
                          src={`${posterURL}/posters/${movie.poster}`}
                          alt="Movie poster"
                          className="h-auto w-auto"
                          height={230}
                          width={110}
                        />
                      )}
                      <div className="flex h-full flex-col justify-center gap-2 self-start">
                        <h3 title={movie.title} className="text-xl font-bold">
                          {movie.title.length > textLength
                            ? movie.title.slice(0, textLength) + "..."
                            : movie.title}
                        </h3>

                        <div className="flex flex-col gap-1 xl:flex-row">
                          <div>
                            {movie.release_date
                              ? formatDate(movie.release_date, lang)
                              : "no date"}
                          </div>
                          <span className="hidden xl:inline">|</span>
                          <div>{movie.duration}</div>
                          <span className="hidden xl:inline">|</span>
                          <div className="hidden xl:block">
                            {movie.location}
                          </div>
                        </div>

                        <p className="hidden xl:block">
                          {movie.description.length >= 100
                            ? movie.description.slice(0, 100) + "..."
                            : movie.description}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {movie.genres.map((genre) => (
                            <div
                              key={genre.key}
                              className="flex gap-1 rounded-lg border p-1"
                            >
                              {genre.name}
                            </div>
                          ))}
                        </div>

                        <div className="hidden gap-1 xl:flex">
                          <div className="flex gap-1">
                            {movie.directors.map((director) => (
                              <Image
                                key={director.key}
                                title={director.full_name}
                                src={`${avatarURL}/directors/${director.avatar_url}`}
                                alt="Director Avatar"
                                className="size-12 rounded-full object-cover"
                                height={50}
                                width={50}
                                blurDataURL="/static/blur-image.webp"
                                placeholder="blur"
                                loading="lazy"
                              />
                            ))}
                          </div>
                          <Separator
                            className="mx-2 h-auto"
                            orientation="vertical"
                          />
                          <div className="flex gap-1">
                            {movie.actors.slice(0, 5).map((actor) => (
                              <Image
                                key={actor.key}
                                title={actor.full_name}
                                src={`${avatarURL}/actors/${actor.avatar_url}`}
                                alt="Actor Avatar"
                                className="size-12 rounded-full object-cover"
                                height={50}
                                width={50}
                                blurDataURL="/static/blur-image.webp"
                                placeholder="blur"
                                loading="lazy"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden xl:flex" />
        <CarouselNext className="hidden xl:flex" />
      </Carousel>
    </div>
  );
}
