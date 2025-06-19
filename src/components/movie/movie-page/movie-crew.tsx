"use client";

import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PersonLink } from "@/components/movie/movie-page/people-link";
import {
  FilterEnum,
  type MovieActorOut,
  type MoviePersonOut,
} from "@/orval_api/model";

type Props = {
  actors: MovieActorOut[];
  directors: MoviePersonOut[];
  avatarURL: string;
};

export const MovieCrew = ({ actors, avatarURL, directors }: Props) => {
  const t = useTranslations("Filters");
  const mq = useMediaQuery("(max-width: 1024px)");
  const actorsLength = mq ? 2 : 5;
  return (
    <>
      <span className="sr-only" aria-label="movie-crew"></span>
      <div className="my-4 select-none">
        {actors?.length > actorsLength ? (
          <Carousel
            opts={{ dragFree: true }}
            className="w-full lg:max-w-[640px]"
          >
            <CarouselContent className="-ml-1 max-w-[340px] lg:max-w-none">
              {actors?.map((actor) => (
                <CarouselItem
                  key={actor.key}
                  className="basis-auto pl-1 md:basis-1/2 lg:basis-1/5"
                >
                  <PersonLink
                    avatarURL={avatarURL}
                    key={actor.key}
                    person={actor}
                    linkQueryParam={FilterEnum.actor}
                    type="actors"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="relative top-0 left-0 hidden translate-none lg:inline-flex" />
            <CarouselNext className="relative top-0 left-0 hidden translate-none lg:inline-flex" />
          </Carousel>
        ) : (
          <div className="flex gap-3">
            {actors?.map((actor) => (
              <PersonLink
                avatarURL={avatarURL}
                key={actor.key}
                person={actor}
                linkQueryParam={FilterEnum.actor}
                type="actors"
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-3xl font-bold">
        {directors?.length > 1 ? t("directorPlural") : t("director")}
      </p>
      {directors?.length > actorsLength ? (
        <Carousel opts={{ dragFree: true }} className="w-full lg:max-w-[640px]">
          <CarouselContent className="-ml-1 max-w-[340px] lg:max-w-none">
            {directors?.map((director) => (
              <CarouselItem
                key={director.key}
                className="basis-auto pl-1 md:basis-1/2 lg:basis-1/5"
              >
                <PersonLink
                  avatarURL={avatarURL}
                  key={director.key}
                  person={director}
                  linkQueryParam={FilterEnum.director}
                  type="directors"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="relative top-0 left-0 hidden translate-none lg:inline-flex" />
          <CarouselNext className="relative top-0 left-0 hidden translate-none lg:inline-flex" />
        </Carousel>
      ) : (
        <div className="flex gap-3">
          {directors?.map((director) => (
            <PersonLink
              avatarURL={avatarURL}
              key={director.key}
              person={director}
              linkQueryParam={FilterEnum.director}
              type="directors"
            />
          ))}
        </div>
      )}
    </>
  );
};
