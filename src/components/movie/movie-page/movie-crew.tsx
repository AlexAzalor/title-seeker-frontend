"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";

import { PersonLink } from "@/components/movie/movie-page/people-link";
import { CustomPeopleCarousel } from "@/components/my-custom-ui/custom-people-carousel";
import {
  FilterEnum,
  type MainItemMenu,
  type MovieActorOut,
  type MoviePersonOut,
} from "@/orval_api/model";
import { CopyButton } from "./components/copy-button";
import { checkIfAdmin } from "@/proxy";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { getMovieActors } from "@/app/(app)/services/admin-api";
import { useModal } from "@/hooks/use-modal";
import CustomModal from "@/components/my-custom-ui/custom-modal";
import { EditMovieActors } from "@/components/movie/movie-page/edit/movie-actors";
import { DirectorsList } from "./directors-list";
import { Spinner } from "@/components/my-custom-ui/spinner";

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
  const session = useSession();
  const mq = useMediaQuery("(max-width: 1024px)");
  const actorsLength = mq ? 2 : 5;

  const { isOpen, open, close } = useModal();
  const [allActors, setAllActors] = useState<MainItemMenu[]>([]);
  const [allCharacters, setAllCharacters] = useState<MainItemMenu[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditActors = async () => {
    open();
    setIsLoading(true);

    try {
      const res = await getMovieActors();

      if (res.status === 200 && res.data) {
        setAllActors(res.data.actors);
        setAllCharacters(res.data.characters);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred while fetching actors");
      console.error("Fetch movie actors error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    close();
    setAllActors([]);
    setAllCharacters([]);
  };

  return (
    <>
      {checkIfAdmin(session.data?.user.role) && (
        <Button variant="link" className="h-7 p-0" onClick={handleEditActors}>
          Edit
        </Button>
      )}

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

      {isOpen && (
        <CustomModal isOpen={isOpen} onClose={handleClose}>
          {!isLoading ? (
            <EditMovieActors
              movieKey={movieKey}
              allActors={allActors}
              allCharacters={allCharacters}
              currentActors={actors}
              onClose={handleClose}
            />
          ) : (
            <Spinner className="grid size-36 place-items-center" />
          )}
        </CustomModal>
      )}
    </>
  );
};
