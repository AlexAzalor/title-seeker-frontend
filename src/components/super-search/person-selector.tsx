"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { manageSearchParameters } from "@/lib/utils";
import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import type { PersonBase } from "@/orval_api/model";

type Props = {
  peopleList: PersonBase[];
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
        onSelect={({ key }) => selectPerson(key)}
        checkIconStyle={selectedPersons}
      />
    </ResponsiveWrapper>
  );
};
