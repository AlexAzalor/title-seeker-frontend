import { FilterBrick } from "./filter-brick";
import { GENRE, SUBGENRE } from "./genres";
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
        type={GENRE}
        searchParamsList={genreItemsList}
        data={genres}
        deleteItem={deleteSearchParam}
        onMouseEnter={handleGenreHover}
        onMouseLeave={() => setHoveredGenre(null)}
        hoveredSubgenre={hoveredSubgenre}
      />

      <FilterBrick
        searchParamsList={subgenreItemsList}
        type={SUBGENRE}
        data={subgenres}
        deleteItem={deleteSearchParam}
        onMouseEnter={handleSubgenreHover}
        onMouseLeave={() => setHoveredSubgenre(null)}
        hoveredGenre={hoveredGenre}
      />
    </>
  );
};
