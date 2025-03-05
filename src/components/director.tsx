"use client";

import { Suspense, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { DirectorOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";
import { AddNewDirector } from "./movie/add-movies-parts/add-new-director";

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

  const deleteDirectorParam = (name: string) => {
    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );
    updatedSearchParams.delete(DIRECTOR, name);
    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    router.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  };

  function onClick(name: string) {
    const query = name;

    if (currentSearchParams.has(DIRECTOR, query)) {
      deleteDirectorParam(query);

      return;
    }

    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );

    updatedSearchParams.append(DIRECTOR, query);

    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    router.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
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
          onSelect={(v, key) => onClick(key)}
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
