"use client";

import { Suspense, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { GenreOut, SubgenreOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";

import { AddNewGenre } from "./movie/add-movies-parts/add-new-genre";
import { AddNewSubgenre } from "./movie/add-movies-parts/add-new-subgenre";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

import {
  DEFAULT_RANGE,
  extractWord,
  handleSearchParams,
  modifyGenresSearchParams,
} from "@/lib/utils";

const ModalMovie = dynamic(() => import("./movie/ui/modal-movie"));

type Props = {
  genres: GenreOut[];
  subgenres: SubgenreOut[];
};

export const GENRE = "genre_name";
export const SUBGENRE = "subgenre_name";
export const EXACT_MATCH = "exact_match";

export const Genres = ({ genres }: Props) => {
  const router = useRouter();

  const [openGenreFormModal, setOpenGenreFormModal] = useState(false);
  const [openSubgenreFormModal, setOpenSubgenreFormModal] = useState(false);

  const currentSearchParams = useSearchParams();
  const currentSelectedGenres = currentSearchParams.getAll(GENRE);
  const currentSelectedSubgenres = currentSearchParams.getAll(SUBGENRE);
  const currentExactMatch = currentSearchParams.get(EXACT_MATCH);

  const selectedGenres = useMemo(() => {
    return genres.filter(
      (g) =>
        currentSelectedGenres.map((e) => extractWord(e)).includes(g.key) &&
        g.subgenres?.length,
    );
  }, [currentSelectedGenres, genres]);

  const availableSubgenres = useMemo(() => {
    if (!currentSelectedGenres.length) {
      return [];
    }

    const subgenres = selectedGenres.map((e) => e.subgenres).flat();

    return subgenres;
  }, [currentSelectedGenres.length, selectedGenres]);

  const [subgenres, setSubgenres] = useState<SubgenreOut[]>(
    availableSubgenres || [],
  );

  const deleteSubgenresParams = (
    value: string,
    urlSearchParams: URLSearchParams,
  ) => {
    if (subgenres.length) {
      const filtredSubgenres = subgenres.filter((subgenre) =>
        value.includes(subgenre.parent_genre_key),
      );

      if (filtredSubgenres.length) {
        for (const subgenre of filtredSubgenres) {
          const subgenreKey = currentSelectedSubgenres.find((e) =>
            e.includes(subgenre.key),
          );

          if (subgenreKey) {
            urlSearchParams.delete(SUBGENRE, subgenreKey);
          }
        }

        setSubgenres((prev) =>
          prev.filter((subgenre) => subgenre.parent_genre_key !== value),
        );
      }
    }
  };

  function updateSearchParameters(value: string, key: string) {
    const genreToDelete = currentSelectedGenres.find((e) => e.includes(value));
    const subgenreToDelete = currentSelectedSubgenres.find((e) =>
      e.includes(value),
    );

    if (key === GENRE) {
      modifyGenresSearchParams(
        key,
        // action(10,100)
        value + `(${DEFAULT_RANGE.join()})`,
        genreToDelete,
        currentSearchParams,
        router,
        deleteSubgenresParams,
      );
      return;
    }

    if (key === SUBGENRE) {
      modifyGenresSearchParams(
        key,
        value + `(${DEFAULT_RANGE.join()})`,
        subgenreToDelete,
        currentSearchParams,
        router,
        deleteSubgenresParams,
      );
      return;
    }
  }

  const clearAllFilters = () => {
    const { refreshPage } = handleSearchParams(router);
    refreshPage();

    setSubgenres([]);
  };

  const checkGenreType = (item: GenreOut | SubgenreOut): item is GenreOut => {
    return (item as GenreOut).subgenres !== undefined;
  };

  function handleExactMatch() {
    modifyGenresSearchParams(
      EXACT_MATCH,
      "true",
      currentSearchParams.has(EXACT_MATCH) ? "true" : "",
      currentSearchParams,
      router,
      deleteSubgenresParams,
    );
  }

  return (
    <>
      <div>
        <Button
          className="mb-4 cursor-pointer"
          variant="destructive"
          onClick={clearAllFilters}
        >
          Clear all filters
        </Button>

        <Label
          onClick={handleExactMatch}
          className="my-2 flex cursor-pointer items-center gap-3 text-xl"
        >
          <span>Exact match</span>
          <Checkbox checked={!!currentExactMatch} className="cursor-pointer" />
        </Label>

        <h1>Genres</h1>

        <ItemsListSelector
          items={genres}
          onOpenModal={() => setOpenGenreFormModal(true)}
          onSelect={(currentValue, key, genre) => {
            updateSearchParameters(genre.key, GENRE);

            if (
              !currentSelectedGenres
                .map((e) => extractWord(e))
                .find((genrePrev) => genrePrev === key)
            ) {
              if (genre && checkGenreType(genre) && genre.subgenres?.length) {
                setSubgenres((prev) => [...prev, ...(genre.subgenres || [])]);
              }
            } else {
              setSubgenres((prev) =>
                prev.filter(
                  (subgenrePrev) => subgenrePrev.parent_genre_key !== key,
                ),
              );
            }
          }}
          checkIconStyle={currentSelectedGenres.map((e) => extractWord(e))}
        />

        <h1>Subgenres</h1>
        <ItemsListSelector
          items={subgenres}
          onOpenModal={() => setOpenSubgenreFormModal(true)}
          onSelect={(currentValue, key) => {
            updateSearchParameters(key, SUBGENRE);
          }}
          checkIconStyle={currentSelectedSubgenres.map((e) => extractWord(e))}
        />
      </div>

      <Suspense>
        <ModalMovie
          title="Genre"
          open={openGenreFormModal}
          setOpen={setOpenGenreFormModal}
        >
          <AddNewGenre appendGenre={() => {}} />
        </ModalMovie>

        <ModalMovie
          title="Subgenre"
          open={openSubgenreFormModal}
          setOpen={setOpenSubgenreFormModal}
        >
          <AddNewSubgenre
            appendSubgenre={() => {}}
            setSubgenres={setSubgenres}
            genresList={selectedGenres}
          />
        </ModalMovie>
      </Suspense>
    </>
  );
};
