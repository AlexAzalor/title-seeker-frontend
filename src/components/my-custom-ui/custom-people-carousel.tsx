import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PersonLink } from "@/components/movie/movie-page/people-link";
import type {
  FilterEnum,
  MovieActorOut,
  MoviePersonOut,
} from "@/orval_api/model";

type Props = {
  people: MovieActorOut[] | MoviePersonOut[];
  avatarURL: string;
  linkType: FilterEnum;
  type: "actors" | "directors";
};

export const CustomPeopleCarousel = ({
  people,
  avatarURL,
  linkType,
  type,
}: Props) => {
  return (
    <Carousel opts={{ dragFree: true }} className="w-full lg:max-w-[640px]">
      <CarouselContent className="-ml-1 max-w-[340px] lg:max-w-none">
        {people.map((person) => (
          <CarouselItem
            key={person.key}
            className="basis-auto pl-1 md:basis-1/2 lg:basis-1/5"
          >
            <PersonLink
              avatarURL={avatarURL}
              key={person.key}
              person={person}
              linkQueryParam={linkType}
              type={type}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="relative top-0 left-0 hidden translate-none lg:inline-flex" />
      <CarouselNext className="relative top-0 left-0 hidden translate-none lg:inline-flex" />
    </Carousel>
  );
};
