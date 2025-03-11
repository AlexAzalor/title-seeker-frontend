"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { ActionTimeOut, KeywordOut, SpecificationOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";
import { AddNewSpecification } from "./movie/add-movies-parts/add-new-specification";
import { DEFAULT_RANGE, extractWord } from "./super-search/enhance-search";

const ModalMovie = dynamic(() => import("./movie/ui/modal-movie"));

type Props = {
  data: SpecificationOut[] | KeywordOut[] | ActionTimeOut[];
  param_key: string;
  title: string;
};

export const MovieFilters = ({ data, param_key, title }: Props) => {
  const route = useRouter();

  const [openFilterFormModal, setOpenFilterFormModal] = useState(false);

  const currentSearchParams = useSearchParams();
  const currentSelectedFilter = currentSearchParams.getAll(param_key);

  const deleteSpecificationParam = (name: string) => {
    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );
    updatedSearchParams.delete(param_key, name);
    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    route.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  };

  function onClick(name: string) {
    const query = name;

    const item = currentSelectedFilter.find((e) => e.includes(name));
    if (item) {
      deleteSpecificationParam(item);

      return;
    }

    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );

    updatedSearchParams.append(param_key, query + `(${DEFAULT_RANGE.join()})`);

    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    route.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
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
