"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { ActionTimeOut, KeywordOut, SpecificationOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";
import { AddNewSpecification } from "./movie/add-movies-parts/add-new-specification";
import { DEFAULT_RANGE, extractWord } from "./super-search/enhance-search";
import { modifyGenresSearchParams } from "@/lib/utils";

const ModalMovie = dynamic(() => import("./movie/ui/modal-movie"));

type Props = {
  data: SpecificationOut[] | KeywordOut[] | ActionTimeOut[];
  param_key: string;
  title: string;
};

export const MovieFilters = ({ data, param_key, title }: Props) => {
  const router = useRouter();

  const [openFilterFormModal, setOpenFilterFormModal] = useState(false);

  const currentSearchParams = useSearchParams();
  const currentSelectedFilter = currentSearchParams.getAll(param_key);

  function onClick(name: string) {
    const item = currentSelectedFilter.find((e) => e.includes(name));
    modifyGenresSearchParams(
      param_key,
      name + `(${DEFAULT_RANGE.join()})`,
      item,
      currentSearchParams,
      router,
    );
  }

  return (
    <>
      <div>
        <h1>{title}</h1>

        <ItemsListSelector
          items={data}
          onOpenModal={() => setOpenFilterFormModal(true)}
          onSelect={(currentValue, key, genre) => {
            onClick(genre.key);
          }}
          checkIconStyle={currentSelectedFilter.map((e) => extractWord(e))}
        />
      </div>

      <Suspense>
        <ModalMovie
          title="Specification"
          open={openFilterFormModal}
          setOpen={setOpenFilterFormModal}
        >
          <AddNewSpecification appendSpecification={currentSelectedFilter} />
        </ModalMovie>
      </Suspense>
    </>
  );
};
