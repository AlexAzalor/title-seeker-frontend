"use client";

import { useSession } from "next-auth/react";
import { checkIfAdmin } from "@/proxy";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/my-custom-ui/custom-modal";
import { useModal } from "@/hooks/use-modal";
import { MovieCollectionManager } from "@/components/movie/movie-page/edit/movie-collection-manager";

type Props = {
  posterUrl: string;
  movieKey: string;
};

export const EditRelatedMovie = ({ posterUrl, movieKey }: Props) => {
  const session = useSession();
  const { isOpen, open, close } = useModal();
  return (
    <>
      {checkIfAdmin(session.data?.user.role) && (
        <Button variant="link" className="h-7 p-0" onClick={open}>
          Edit
        </Button>
      )}
      {isOpen && (
        <CustomModal isOpen={isOpen} onClose={close}>
          <MovieCollectionManager movieKey={movieKey} posterUrl={posterUrl} />
        </CustomModal>
      )}
    </>
  );
};
