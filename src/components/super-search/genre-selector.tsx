"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { FilterEnum, GenreOut, SubgenreOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsSelector } from "../my-custom-ui/items-list-selector";

import {
  DEFAULT_RANGE,
  extractWord,
  manageSearchParameters,
} from "@/lib/utils";
import { ResponsiveWrapper } from "../my-custom-ui/responsive-wrapper";

type Props = {
  genres: GenreOut[];
};

export const EXACT_MATCH_KEY = "exact_match";

export const GenreSelector = ({ genres }: Props) => {
  const router = useRouter();
  const tFilters = useTranslations("Filters");

  const currentSearchParams = useSearchParams();
  const currentSelectedGenres = currentSearchParams.getAll(FilterEnum.genre);
  const currentSelectedSubgenres = currentSearchParams.getAll(
    FilterEnum.subgenre,
  );

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

  // Reset subgenres when genres are cleared (Clear all filters button)
  useEffect(() => {
    if (!currentSelectedGenres.length && subgenres.length) {
      setSubgenres([]);
      return;
    }
  }, [currentSelectedGenres.length, subgenres.length]);

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
            urlSearchParams.delete(FilterEnum.subgenre, subgenreKey);
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

    if (key === FilterEnum.genre) {
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

    if (key === FilterEnum.subgenre) {
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

  const checkGenreType = (item: GenreOut | SubgenreOut): item is GenreOut => {
    return (item as GenreOut).subgenres !== undefined;
  };

  return (
    <div className="flex flex-col gap-4">
      <ResponsiveWrapper title={tFilters("genre.name")}>
        <ItemsSelector
          items={genres}
          emptyText={tFilters("genreNotFound")}
          onSelect={(currentValue, key, genre) => {
            updateSearchParameters(genre.key, FilterEnum.genre);

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

      <ResponsiveWrapper title={tFilters("subgenre.name")}>
        <ItemsSelector
          items={subgenres}
          emptyText={tFilters("subgenreNotFound")}
          onSelect={(currentValue, key) => {
            updateSearchParameters(key, FilterEnum.subgenre);
          }}
          checkIconStyle={currentSelectedSubgenres.map((e) => extractWord(e))}
        />
      </ResponsiveWrapper>
    </div>
  );
};
