"use client";

import { useSession } from "next-auth/react";
import { checkIfAdmin } from "@/proxy";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/my-custom-ui/custom-modal";
import { useModal } from "@/hooks/use-modal";
import { MovieCollectionForm } from "@/components/movie/movie-page/edit/movie-collection-form";
import { RelatedMovie, type RelatedMovieOut } from "@/orval_api/model";

type Props = {
  posterUrl: string;
  movieKey: string;
  baseMoviePosterKey: string;
  baseMovieTitle: string;
  relatedMovies?: RelatedMovieOut[] | null;
};

export const EditRelatedMovie = ({
  posterUrl,
  movieKey,
  baseMoviePosterKey,
  baseMovieTitle,
  relatedMovies,
}: Props) => {
  const session = useSession();
  const { isOpen, open, close } = useModal();

  // Only a base or a standalone movie can manage its related movies
  const own = relatedMovies?.find((m) => m.key === movieKey);
  const canEdit = !own || own.relation_type === RelatedMovie.base;

  if (!canEdit) return null;

  return (
    <>
      {checkIfAdmin(session.data?.user.role) && (
        <Button variant="link" className="h-7 p-0" onClick={open}>
          Edit
        </Button>
      )}
      {isOpen && (
        <CustomModal isOpen={isOpen} onClose={close}>
          <MovieCollectionForm
            movieKey={movieKey}
            posterUrl={posterUrl}
            baseMoviePosterKey={baseMoviePosterKey}
            baseMovieTitle={baseMovieTitle}
            relatedMovies={relatedMovies}
          />
        </CustomModal>
      )}
    </>
  );
};
