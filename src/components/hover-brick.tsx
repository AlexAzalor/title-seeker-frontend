import { cleanString } from "@/lib/utils";
import { FilterBrick } from "./filter-brick";
import { GENRE, SUBGENRE } from "./genres";
import { useState } from "react";
import { GenreOutPlus, SubgenreOutPlus } from "@/orval_api/model";

type Props = {
  genres: GenreOutPlus[];
  subgenres: SubgenreOutPlus[];
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

  return (
    <>
      {genreItemsList.map((g) => {
        const genre = cleanString(g);
        const genreData = genres.find((g) => g.key === genre);
        if (!genreData) {
          return null;
        }

        return (
          <FilterBrick
            type={GENRE}
            key={genre}
            searchParam={g}
            cleanSearchParam={genre}
            deleteItem={deleteSearchParam}
            itemData={genreData}
            onMouseEnter={() => setHoveredGenre(genre)}
            onMouseLeave={() => setHoveredGenre(null)}
            hoveredSubgenre={hoveredSubgenre}
          />
        );
      })}

      {subgenreItemsList.map((subg) => {
        const subgenre = cleanString(subg);
        const subgenreData = subgenres.find((s) => s.key === subgenre);
        if (!subgenreData) {
          return null;
        }

        return (
          <FilterBrick
            type={SUBGENRE}
            key={subgenre}
            searchParam={subg}
            deleteItem={deleteSearchParam}
            itemData={subgenreData}
            onMouseEnter={() =>
              setHoveredSubgenre(subgenreData.parent_genre_key)
            }
            onMouseLeave={() => setHoveredSubgenre(null)}
            hoveredGenre={hoveredGenre}
          />
        );
      })}
    </>
  );
};
