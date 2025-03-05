"use client";

import { Suspense, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { ActorOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";
import { AddNewActor } from "./movie/add-movies-parts/add-new-actor";

const ModalMovie = dynamic(() => import("./movie/ui/modal-movie"));

export const ACTOR = "actor_name";

type Props = {
  actors: ActorOut[];
};

export const Actors = ({ actors }: Props) => {
  const router = useRouter();

  const [openActorFormModal, setOpenActorFormModal] = useState(false);

  const currentSearchParams = useSearchParams();
  const currentSelectedActors = currentSearchParams.getAll(ACTOR);

  const deleteActorParam = (name: string) => {
    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );
    updatedSearchParams.delete(ACTOR, name);
    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    router.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  };

  function onClick(name: string) {
    const query = name;

    if (currentSearchParams.has(ACTOR, query)) {
      deleteActorParam(query);

      return;
    }

    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );

    updatedSearchParams.append(ACTOR, query);

    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    router.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  }

  const handleOpenActorFormModal = useCallback(() => {
    setOpenActorFormModal(true);
  }, []);

  return (
    <>
      <div>
        <h1>Actors</h1>

        <ItemsListSelector
          items={actors}
          onOpenModal={handleOpenActorFormModal}
          onSelect={(v, key) => onClick(key)}
          checkIconStyle={currentSelectedActors}
        />
      </div>

      <Suspense>
        <ModalMovie
          title="Add new Actor"
          open={openActorFormModal}
          setOpen={setOpenActorFormModal}
        >
          <AddNewActor appendActor={() => {}} />
        </ModalMovie>
      </Suspense>
    </>
  );
};
