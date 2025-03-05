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
      (g) => currentSelectedGenres.includes(g.key) && g.subgenres?.length,
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

  const deleteGenreParam = (name: string, type: string) => {
    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );

    if (subgenres.length) {
      const filtredSubgenres = subgenres.filter(
        (subgenre) => subgenre.parent_genre_key === name,
      );
      if (filtredSubgenres.length) {
        for (const subgenre of filtredSubgenres) {
          updatedSearchParams.delete(SUBGENRE, subgenre.key);
        }

        setSubgenres((prev) =>
          prev.filter((subgenre) => subgenre.parent_genre_key !== name),
        );
      }
    }

    updatedSearchParams.delete(type, name);
    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    router.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  };

  function updateSearchParameters(
    name: string,
    type: string,
    genre?: string,
    genreType?: string,
  ) {
    if (currentSearchParams.has(type, name)) {
      deleteGenreParam(name, type);

      return;
    }

    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );

    if (genre && genreType && !currentSearchParams.has(genreType, genre)) {
      updatedSearchParams.append(genreType, genre);
    }
    updatedSearchParams.append(type, name);

    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    router.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  }

  const clearAllFilters = () => {
    const updatedSearchParams = new URLSearchParams();
    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    router.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });

    setSubgenres([]);
  };

  const checkGenreType = (item: GenreOut | SubgenreOut): item is GenreOut => {
    return (item as GenreOut).subgenres !== undefined;
  };

  function handleExactMatch() {
    if (currentSearchParams.has(EXACT_MATCH)) {
      deleteGenreParam("true", EXACT_MATCH);

      return;
    }

    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );

    updatedSearchParams.append(EXACT_MATCH, "true");

    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    router.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
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

            if (!currentSelectedGenres.find((genrePrev) => genrePrev === key)) {
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
          checkIconStyle={currentSelectedGenres}
        />

        <h1>Subgenres</h1>
        <ItemsListSelector
          items={subgenres}
          onOpenModal={() => setOpenSubgenreFormModal(true)}
          onSelect={(currentValue, key, subgenre) => {
            updateSearchParameters(
              key,
              SUBGENRE,
              (subgenre as SubgenreOut).parent_genre_key,
              GENRE,
            );
          }}
          checkIconStyle={currentSelectedSubgenres}
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
