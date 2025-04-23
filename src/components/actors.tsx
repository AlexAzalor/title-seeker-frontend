"use client";

import { ActorOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";
import { manageSearchParameters } from "@/lib/utils";
import { ResponsiveWrapper } from "./movie/ui/responsive-wrapper";

export const ACTOR_KEY = "actor";

type Props = {
  actors: ActorOut[];
};

export const Actors = ({ actors }: Props) => {
  const router = useRouter();

  const currentSearchParams = useSearchParams();
  const currentSelectedActors = currentSearchParams.getAll(ACTOR_KEY);

  function searchByActors(name: string) {
    manageSearchParameters(
      ACTOR_KEY,
      name,
      currentSearchParams.has(ACTOR_KEY, name) ? name : undefined,
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
