import { FilterBrick } from "./filter-brick";
import { GENRE_KEY, SUBGENRE_KEY } from "./genre-selector";
import { useState } from "react";
import { GenreOut, SubgenreOut } from "@/orval_api/model";

type Props = {
  genres: GenreOut[];
  subgenres: SubgenreOut[];
  genreItemsList: string[];
  subgenreItemsList: string[];
  deleteSearchParam: (genre: string, type: string) => void;
};

export const HoverBrick = ({
  genreItemsList,
  subgenreItemsList,
  genres,
  subgenres,
  deleteSearchParam,
}: Props) => {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const [hoveredSubgenre, setHoveredSubgenre] = useState<string | null>(null);

  const handleGenreHover = (genre: string) => {
    setHoveredGenre(genre);
  };
  const handleSubgenreHover = (subgenre: string) => {
    setHoveredSubgenre(subgenre);
  };

  return (
    <>
      <FilterBrick
        type={GENRE_KEY}
        searchParamsList={genreItemsList}
        data={genres}
        deleteItem={deleteSearchParam}
        onMouseEnter={handleGenreHover}
        onMouseLeave={() => setHoveredGenre(null)}
        hoveredSubgenre={hoveredSubgenre}
      />

      <FilterBrick
        searchParamsList={subgenreItemsList}
        type={SUBGENRE_KEY}
        data={subgenres}
        deleteItem={deleteSearchParam}
        onMouseEnter={handleSubgenreHover}
        onMouseLeave={() => setHoveredSubgenre(null)}
        hoveredGenre={hoveredGenre}
      />
    </>
  );
};
