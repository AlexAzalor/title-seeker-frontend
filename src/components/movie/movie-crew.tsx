import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { PersonLink } from "./people-link";
import { MovieActor, MovieDirector } from "@/orval_api/model";

type Props = {
  actors: MovieActor[];
  directors: MovieDirector[];
};

export const MovieCrew = ({ actors, directors }: Props) => {
  return (
    <>
      <div className="my-4">
        {actors?.length > 5 ? (
          <Carousel opts={{ dragFree: true }} className="w-full max-w-[640px]">
            <CarouselContent className="-ml-1">
              {actors?.map((actor) => (
                <CarouselItem
                  key={actor.key}
                  className="pl-1 md:basis-1/2 lg:basis-1/5"
                >
                  <PersonLink
                    key={actor.key}
                    person={actor}
                    linkQueryParam="actor_name"
                    type="actors"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="relative top-0 left-0 translate-none" />
            <CarouselNext className="relative top-0 left-0 translate-none" />
          </Carousel>
        ) : (
          <div className="flex gap-3">
            {actors?.map((actor) => (
              <PersonLink
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
      <div className="flex gap-3">
        {directors?.map((director) => (
          <PersonLink
            key={director.key}
            person={director}
            linkQueryParam="director_name"
            type="directors"
          />
        ))}
      </div>
    </>
  );
};
