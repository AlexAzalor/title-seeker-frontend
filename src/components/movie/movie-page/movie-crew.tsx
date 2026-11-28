"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

import { PersonLink } from "@/components/movie/movie-page/people-link";
import { CustomPeopleCarousel } from "@/components/my-custom-ui/custom-people-carousel";
import {
  FilterEnum,
  type MovieActorOut,
  type MoviePersonOut,
} from "@/orval_api/model";
import { CopyButton } from "./components/copy-button";
import { DirectorsList } from "./directors-list";

type Props = {
  movieKey: string;
  actors: MovieActorOut[];
  directors: MoviePersonOut[];
  avatarURL: string;
};

export const MovieCrew = ({
  movieKey,
  actors,
  avatarURL,
  directors,
}: Props) => {
  const mq = useMediaQuery("(max-width: 1024px)");
  const actorsLength = mq ? 2 : 5;

  return (
    <>
      <span className="sr-only" aria-label="movie-crew"></span>
      <div className="my-4 select-none">
        {actors.length > actorsLength ? (
          <CustomPeopleCarousel
            people={actors}
            avatarURL={avatarURL}
            linkType={FilterEnum.actor}
            type="actors"
          />
        ) : (
          <div className="flex gap-3">
            {actors.map((actor) => (
              <div key={actor.key} className="relative">
                <CopyButton label={actor.full_name} className="absolute" />
                <PersonLink
                  avatarURL={avatarURL}
                  person={actor}
                  linkQueryParam={FilterEnum.actor}
                  type="actors"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <DirectorsList
        movieKey={movieKey}
        avatarURL={avatarURL}
        directors={directors}
      />
    </>
  );
};
