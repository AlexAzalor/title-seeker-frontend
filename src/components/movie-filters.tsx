"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { ActionTimeOut, KeywordOut, SpecificationOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";
import { AddNewSpecification } from "./movie/add-movies-parts/add-new-specification";

const ModalMovie = dynamic(() => import("./movie/ui/modal-movie"));

type Props = {
  data: SpecificationOut[] | KeywordOut[] | ActionTimeOut[];
  param_key: string;
  title: string;
};

export const MovieFilters = ({ data, param_key, title }: Props) => {
  const route = useRouter();

  const [openSpecificationFormModal, setOpenSpecificationFormModal] =
    useState(false);

  const currentSearchParams = useSearchParams();
  const currentSelectedSpecifications = currentSearchParams.getAll(param_key);

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

    if (currentSearchParams.has(param_key, query)) {
      deleteSpecificationParam(query);

      return;
    }

    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );

    updatedSearchParams.append(param_key, query);

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
          onOpenModal={() => setOpenSpecificationFormModal(true)}
          onSelect={(currentValue, key, genre) => {
            onClick(genre.key);
          }}
          checkIconStyle={currentSelectedSpecifications}
        />
      </div>

      <Suspense>
        <ModalMovie
          title="Specification"
          open={openSpecificationFormModal}
          setOpen={setOpenSpecificationFormModal}
        >
          <AddNewSpecification
            appendSpecification={currentSelectedSpecifications}
          />
        </ModalMovie>
      </Suspense>
    </>
  );
};
