"use client";

import { Suspense, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { ActorOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";
import { AddNewActor } from "./movie/add-movies-parts/add-new-actor";
import { modifyGenresSearchParams } from "@/lib/utils";
import { ResponsiveWrapper } from "./movie/ui/responsive-wrapper";

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

  function searchByActors(name: string) {
    modifyGenresSearchParams(
      ACTOR,
      name,
      currentSearchParams.has(ACTOR, name) ? name : undefined,
      currentSearchParams,
      router,
    );
  }

  const handleOpenActorFormModal = useCallback(() => {
    setOpenActorFormModal(true);
  }, []);

  return (
    <>
      <div>
        <ResponsiveWrapper title="Actors">
          <ItemsListSelector
            title="Actors"
            items={actors}
            onOpenModal={handleOpenActorFormModal}
            onSelect={(v, key) => searchByActors(key)}
            checkIconStyle={currentSelectedActors}
          />
        </ResponsiveWrapper>
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
