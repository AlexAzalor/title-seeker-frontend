"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { FilterEnum, type GenreOut } from "@/orval_api/model";

import {
  DEFAULT_RANGE,
  extractWord,
  manageSearchParameters,
} from "@/lib/utils";
import { ResponsiveWrapper } from "../my-custom-ui/responsive-wrapper";
import { useSubgenreStore } from "@/lib/store";

// const checkGenreType = (item: GenreOut | SubgenreOut): item is GenreOut => {
//   return (item as GenreOut).subgenres !== undefined;
// };

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

  const subgenres = useSubgenreStore((state) => state.subgenres);
  const setSubgenres = useSubgenreStore((state) => state.setSubgenres);

  const availableSubgenres = useCallback(() => {
    if (!currentSelectedGenres.length) {
      setSubgenres([]);
      return [];
    }

    const subgenres = selectedGenres.map((e) => e.subgenres).flat();
    setSubgenres(subgenres);
  }, [currentSelectedGenres.length, selectedGenres, setSubgenres]);

  // The state of subgenres is managed in other components (e.g. Clear all filters),
  // so search params and state need to be synchronized.
  useEffect(() => {
    if (currentSelectedGenres.length) {
      availableSubgenres();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteSubgenresParams = useCallback(
    (value: string, urlSearchParams: URLSearchParams) => {
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

          setSubgenres(
            subgenres.filter((subgenre) => subgenre.parent_genre_key !== value),
          );
        }
      }
    },
    [currentSelectedSubgenres, setSubgenres, subgenres],
  );

  const updateSearchParameters = useCallback(
    (value: string, key: string) => {
      const genreToDelete = currentSelectedGenres.find((e) =>
        e.includes(value),
      );
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
    },
    [
      currentSearchParams,
      currentSelectedGenres,
      currentSelectedSubgenres,
      deleteSubgenresParams,
      router,
    ],
  );

  const updateSubgenreList = useCallback(
    (genre: GenreOut) => {
      updateSearchParameters(genre.key, FilterEnum.genre);

      if (genre.subgenres.length) {
        const isSubgenreSelected = genre.subgenres.every((currentSubgenre) =>
          subgenres.some(
            (newSubgenre) => newSubgenre.key === currentSubgenre.key,
          ),
        );

        const newSubgenres = isSubgenreSelected ? [] : genre.subgenres;
        setSubgenres([...subgenres, ...newSubgenres]);
      } else {
        setSubgenres(
          subgenres.filter(
            (subgenrePrev) => subgenrePrev.parent_genre_key !== genre.key,
          ),
        );
      }
    },
    [updateSearchParameters, setSubgenres, subgenres],
  );

  const selectedGenresKeys = currentSelectedGenres.map((e) => extractWord(e));
  const selectedSubgenresKeys = currentSelectedSubgenres.map((e) =>
    extractWord(e),
  );

  return (
    <div className="flex flex-col gap-4">
      <ResponsiveWrapper title={tFilters("genre.name")}>
        <ItemsSelector<GenreOut>
          items={genres}
          emptyText={tFilters("genreNotFound")}
          onSelect={updateSubgenreList}
          checkIconStyle={selectedGenresKeys}
        />
      </ResponsiveWrapper>

      <ResponsiveWrapper title={tFilters("subgenre.name")}>
        <ItemsSelector
          items={subgenres}
          emptyText={tFilters("subgenreNotFound")}
          onSelect={({ key }) => {
            updateSearchParameters(key, FilterEnum.subgenre);
          }}
          checkIconStyle={selectedSubgenresKeys}
        />
      </ResponsiveWrapper>
    </div>
  );
};
