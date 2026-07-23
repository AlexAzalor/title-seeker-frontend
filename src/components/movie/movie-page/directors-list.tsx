"use client";

import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/use-media-query";

import { PersonLink } from "@/components/movie/movie-page/people-link";
import { CustomPeopleCarousel } from "@/components/my-custom-ui/custom-people-carousel";
import {
  FilterEnum,
  type MainItemMenu,
  type MoviePersonOut,
} from "@/orval_api/model";
import { checkIfAdmin } from "@/proxy";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { getMovieDirectors } from "@/app/(app)/services/admin-api";
import { useState } from "react";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";
import CustomModal from "@/components/my-custom-ui/custom-modal";
import { EditMovieDirectors } from "@/components/movie/movie-page/edit/movie-directors";
import { Spinner } from "@/components/my-custom-ui/spinner";

type Props = {
  movieKey: string;
  directors: MoviePersonOut[];
  avatarURL: string;
};

export const DirectorsList = ({
  movieKey,
  avatarURL,
  directors = [],
}: Props) => {
  const session = useSession();
  const t = useTranslations("Filters");
  const mq = useMediaQuery("(max-width: 1024px)");
  const actorsLength = mq ? 2 : 5;

  const { isOpen, open, close } = useModal();

  const [allDirectors, setAllDirectors] = useState<MainItemMenu[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    close();
    setAllDirectors([]);
  };

  const handleEditDirectors = async () => {
    open();
    setIsLoading(true);

    try {
      const res = await getMovieDirectors();

      if (res.status === 200 && res.data) {
        setAllDirectors(res.data.directors ?? []);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred while fetching directors");
      console.error("Fetch movie directors error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {checkIfAdmin(session.data?.user.role) && (
        <Button
          variant="link"
          className="h-7 p-0"
          onClick={handleEditDirectors}
        >
          Edit
        </Button>
      )}

      <p className="text-3xl font-bold">
        {directors.length > 1 ? t("directorPlural") : t("director")}
      </p>
      {directors.length > actorsLength ? (
        <CustomPeopleCarousel
          people={directors}
          avatarURL={avatarURL}
          linkType={FilterEnum.director}
          type="directors"
        />
      ) : (
        <div className="flex gap-3">
          {directors.map((director) => (
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

      {isOpen && (
        <CustomModal isOpen={isOpen} onClose={handleClose}>
          {!isLoading ? (
            <EditMovieDirectors
              movieKey={movieKey}
              allDirectors={allDirectors}
              currentDirectors={directors}
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
