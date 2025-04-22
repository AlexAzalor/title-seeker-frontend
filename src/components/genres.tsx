"use client";

import { useMemo, useState } from "react";
import { GenreOut, SubgenreOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsListSelector } from "./movie/ui/items-list-selector";

import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

import {
  DEFAULT_RANGE,
  extractWord,
  syncSearchParameters,
  manageSearchParameters,
} from "@/lib/utils";
import { ResponsiveWrapper } from "./movie/ui/responsive-wrapper";

type Props = {
  genres: GenreOut[];
  subgenres: SubgenreOut[];
};

export const GENRE = "genre_name";
export const SUBGENRE = "subgenre_name";
export const EXACT_MATCH = "exact_match";

export const Genres = ({ genres }: Props) => {
  const router = useRouter();

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
      manageSearchParameters(
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
      manageSearchParameters(
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
    const { refreshPage } = syncSearchParameters(router);
    refreshPage();

    setSubgenres([]);
  };

  const checkGenreType = (item: GenreOut | SubgenreOut): item is GenreOut => {
    return (item as GenreOut).subgenres !== undefined;
  };

  function handleExactMatch() {
    manageSearchParameters(
      EXACT_MATCH,
      "true",
      currentSearchParams.has(EXACT_MATCH) ? "true" : "",
      currentSearchParams,
      router,
      deleteSubgenresParams,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        className="mb-4 cursor-pointer"
        variant="destructive"
        onClick={clearAllFilters}
      >
        Clear all filters
      </Button>

      <Label
        onClick={handleExactMatch}
        className="my-2 flex w-max cursor-pointer items-center gap-3 text-xl"
      >
        <span>Exact match</span>
        <Checkbox checked={!!currentExactMatch} className="cursor-pointer" />
      </Label>

      <ResponsiveWrapper title="Genres">
        <ItemsListSelector
          title="Genres"
          items={genres}
          emptyText="No genres found"
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
      </ResponsiveWrapper>

      <ResponsiveWrapper title="Subgenres">
        <ItemsListSelector
          title="Subgenres"
          items={subgenres}
          emptyText="No subgenres found OR select a genre first."
          onSelect={(currentValue, key) => {
            updateSearchParameters(key, SUBGENRE);
          }}
          checkIconStyle={currentSelectedSubgenres.map((e) => extractWord(e))}
        />
      </ResponsiveWrapper>
    </div>
  );
};
