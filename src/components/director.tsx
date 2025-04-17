"use client";

import { DirectorOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";
import { modifyGenresSearchParams } from "@/lib/utils";
import { ResponsiveWrapper } from "./movie/ui/responsive-wrapper";

export const DIRECTOR = "director_name";

type Props = {
  directors: DirectorOut[];
};

export const Directors = ({ directors }: Props) => {
  const router = useRouter();

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

  return (
    <ResponsiveWrapper title="Directors">
      <ItemsListSelector
        title="Directors"
        items={directors}
        emptyText="No directors found"
        onSelect={(v, key) => searchByDirectors(key)}
        checkIconStyle={currentSelectedDirectors}
      />
    </ResponsiveWrapper>
  );
};
