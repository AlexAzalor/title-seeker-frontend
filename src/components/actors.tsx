"use client";

import { ActorOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";
import { modifyGenresSearchParams } from "@/lib/utils";
import { ResponsiveWrapper } from "./movie/ui/responsive-wrapper";

export const ACTOR = "actor_name";

type Props = {
  actors: ActorOut[];
};

export const Actors = ({ actors }: Props) => {
  const router = useRouter();

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

  return (
    <ResponsiveWrapper title="Actors">
      <ItemsListSelector
        title="Actors"
        items={actors}
        emptyText="No actors found"
        onSelect={(v, key) => searchByActors(key)}
        checkIconStyle={currentSelectedActors}
      />
    </ResponsiveWrapper>
  );
};
