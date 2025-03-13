"use client";

import { Suspense, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { DirectorOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";
import { AddNewDirector } from "./movie/add-movies-parts/add-new-director";
import { modifyGenresSearchParams } from "@/lib/utils";

const ModalMovie = dynamic(() => import("./movie/ui/modal-movie"));

export const DIRECTOR = "director_name";

type Props = {
  directors: DirectorOut[];
};

export const Directors = ({ directors }: Props) => {
  const router = useRouter();

  const [openDirectorFormModal, setOpenDirectorFormModal] = useState(false);

  const currentSearchParams = useSearchParams();
  const currentSelectedDirectors = currentSearchParams.getAll(DIRECTOR);

  function searchByDirectors(name: string) {
    modifyGenresSearchParams(
      DIRECTOR,
      name,
      currentSearchParams.has(DIRECTOR, name) ? name : undefined,
      currentSearchParams,
      router,
    );
  }

  const handleOpenDirectorFormModal = useCallback(() => {
    setOpenDirectorFormModal(true);
  }, []);

  return (
    <>
      <div>
        <h1>Directors</h1>

        <ItemsListSelector
          items={directors}
          onOpenModal={handleOpenDirectorFormModal}
          onSelect={(v, key) => searchByDirectors(key)}
          checkIconStyle={currentSelectedDirectors}
        />
      </div>

      <Suspense>
        <ModalMovie
          title="Add new Director"
          open={openDirectorFormModal}
          setOpen={setOpenDirectorFormModal}
        >
          <AddNewDirector appendDirector={() => {}} />
        </ModalMovie>
      </Suspense>
    </>
  );
};
