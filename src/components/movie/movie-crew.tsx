"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { PersonLink } from "./people-link";
import { MovieActor, MovieDirector } from "@/orval_api/model";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type Props = {
  actors: MovieActor[];
  directors: MovieDirector[];
  avatarURL: string;
};

export const MovieCrew = ({ actors, avatarURL, directors }: Props) => {
  const mq = useMediaQuery("(max-width: 1024px)");
  const actorsLength = mq ? 2 : 5;
  return (
    <>
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
                    linkQueryParam="actor_name"
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
                linkQueryParam="actor_name"
                type="actors"
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-3xl font-bold">Directors</p>
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
                  linkQueryParam="director_name"
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
              linkQueryParam="director_name"
              type="directors"
            />
          ))}
        </div>
      )}
    </>
  );
};
