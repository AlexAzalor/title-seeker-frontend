"use client";

import { useState } from "react";
import type { MovieFilterItem } from "@/orval_api/model";
import { MovieFilter } from "./movie-filter";
import {
  GENRE_KEY,
  SUBGENRE_KEY,
} from "@/components/super-search/genre-selector";

type Props = {
  genres: MovieFilterItem[];
  subgenres?: MovieFilterItem[];
};

export const GenresList = ({ genres, subgenres }: Props) => {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const [hoveredSubgenre, setHoveredSubgenre] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-4" aria-label="genres-list">
      <MovieFilter
        movieKey={"movieKey"}
        data={genres}
        queryKey={GENRE_KEY}
        title="Genres"
        onMouseEnter={(key) => setHoveredGenre(key)}
        onMouseLeave={() => setHoveredGenre(null)}
        hoveredSubgenre={hoveredSubgenre}
      />

      {!!subgenres?.length && (
        <MovieFilter
          movieKey={"movieKey"}
          data={subgenres}
          queryKey={SUBGENRE_KEY}
          title="Subgenres"
          onMouseEnter={(parentKey) => setHoveredSubgenre(parentKey)}
          onMouseLeave={() => setHoveredSubgenre(null)}
          hoveredGenre={hoveredGenre}
        />
      )}
    </div>
  );
};
