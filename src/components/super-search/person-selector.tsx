"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ActorOut, DirectorOut } from "@/orval_api/model";
import { ItemsSelector } from "../my-custom-ui/items-list-selector";
import { manageSearchParameters } from "@/lib/utils";
import { ResponsiveWrapper } from "../my-custom-ui/responsive-wrapper";

type Props = {
  peopleList: ActorOut[] | DirectorOut[];
  personKey: string;
};

export const PersonSelector = ({ peopleList, personKey }: Props) => {
  const router = useRouter();
  const t = useTranslations("Filters");

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
    <ResponsiveWrapper title={t(`${personKey}`)}>
      <ItemsSelector
        items={peopleList}
        emptyText={t("peopleNotFound")}
        onSelect={(v, key) => selectPerson(key)}
        checkIconStyle={selectedPersons}
      />
    </ResponsiveWrapper>
  );
};
