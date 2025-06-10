import { FilterBrick } from "./filter-brick";
import { useState } from "react";
import { FilterEnum, GenreOut, SubgenreOut } from "@/orval_api/model";

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
      <span aria-label="hover-brick" className="sr-only"></span>
      <FilterBrick
        type={FilterEnum.genre}
        searchParamsList={genreItemsList}
        data={genres}
        deleteItem={deleteSearchParam}
        onMouseEnter={handleGenreHover}
        onMouseLeave={() => setHoveredGenre(null)}
        hoveredSubgenre={hoveredSubgenre}
      />

      <FilterBrick
        searchParamsList={subgenreItemsList}
        type={FilterEnum.subgenre}
        data={subgenres}
        deleteItem={deleteSearchParam}
        onMouseEnter={handleSubgenreHover}
        onMouseLeave={() => setHoveredSubgenre(null)}
        hoveredGenre={hoveredGenre}
      />
    </>
  );
};
