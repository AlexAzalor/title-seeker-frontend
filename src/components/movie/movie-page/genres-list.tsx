"use client";

import { useState, createContext } from "react";
import type { MovieFilterItem } from "@/orval_api/model";
import { MovieFilter } from "./movie-filter";
import {
  GENRE_KEY,
  SUBGENRE_KEY,
} from "@/components/super-search/genre-selector";

type Props = {
  movieKey: string;
  genres: MovieFilterItem[];
  subgenres?: MovieFilterItem[];
};
export const GenreContext = createContext<{
  onMouseEnter: (key: string) => void;
  onMouseLeave: (key: null) => void;
  hoveredGenre?: string | null;
  hoveredSubgenre?: string | null;
}>({
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  hoveredGenre: null,
  hoveredSubgenre: null,
});
export const GenresList = ({ movieKey, genres, subgenres }: Props) => {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const [hoveredSubgenre, setHoveredSubgenre] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-4" aria-label="genres-list">
      <GenreContext
        value={{
          onMouseEnter: (key: string) => setHoveredGenre(key),
          onMouseLeave: () => setHoveredGenre(null),
          hoveredSubgenre,
        }}
      >
        <MovieFilter
          movieKey={movieKey}
          data={genres}
          filterKey={GENRE_KEY}
          subgenres={subgenres}
        />
      </GenreContext>

      {!!subgenres?.length && (
        <GenreContext
          value={{
            onMouseEnter: (key: string) => setHoveredSubgenre(key),
            onMouseLeave: () => setHoveredSubgenre(null),
            hoveredGenre,
          }}
        >
          <MovieFilter
            movieKey={movieKey}
            data={subgenres}
            filterKey={SUBGENRE_KEY}
          />
        </GenreContext>
      )}
    </div>
  );
};
