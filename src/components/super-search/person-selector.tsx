"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ActorOut, DirectorOut } from "@/orval_api/model";
import { ItemsSelector } from "../my-custom-ui/items-list-selector";
import { manageSearchParameters } from "@/lib/utils";
import { ResponsiveWrapper } from "../my-custom-ui/responsive-wrapper";

type Props = {
  title: string;
  peopleList: ActorOut[] | DirectorOut[];
  personKey: string;
};

export const PersonSelector = ({ peopleList, title, personKey }: Props) => {
  const router = useRouter();

  const currentSearchParams = useSearchParams();
  const selectedPersons = currentSearchParams.getAll(personKey);

  function selectPerson(name: string) {
    manageSearchParameters(
      personKey,
      name,
      currentSearchParams.has(personKey, name) ? name : undefined,
      currentSearchParams,
      router,
    );
  }

  return (
    <ResponsiveWrapper title={title}>
      <ItemsSelector
        items={peopleList}
        emptyText="No people found"
        onSelect={(v, key) => selectPerson(key)}
        checkIconStyle={selectedPersons}
      />
    </ResponsiveWrapper>
  );
};
