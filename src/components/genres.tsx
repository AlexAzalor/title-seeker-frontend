"use client";
import { cn } from "@/lib/utils";
import { GenreOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  genres: GenreOut[];
};

const GENRE = "genre_name";
const SUBGENRE = "subgenre_name";

export const Genres = ({ genres }: Props) => {
  const route = useRouter();

  const currentSearchParams = useSearchParams();
  const currentSelectedActors = currentSearchParams.getAll(GENRE);
  const currentSelectedSubgenres = currentSearchParams.getAll(SUBGENRE);

  const deleteGenreParam = (name: string, type: string) => {
    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );
    updatedSearchParams.delete(type, name);
    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    // route.refresh();
    route.replace("/super-search" + "?" + updatedSearchParams.toString(), {
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
    // updatedSearchParams.set("genre", query);
    if (genre && genreType && !currentSearchParams.has(genreType, genre)) {
      updatedSearchParams.append(genreType, genre);
    }
    updatedSearchParams.append(type, name);

    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    // route.refresh();
    route.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });

    // window.location.reload();
  }

  const clearAllFilters = () => {
    const updatedSearchParams = new URLSearchParams();
    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    route.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  };

  return (
    <div>
      <h1>Genres</h1>

      <button
        className="cursor-pointer bg-red-500 p-4"
        onClick={clearAllFilters}
      >
        Clear all filters
      </button>

      <div className="grid grid-cols-3 gap-4">
        {genres.map((genre) => (
          <div key={genre.key}>
            <div
              className={cn(
                "cursor-pointer border border-blue-300 p-3",
                currentSelectedActors.includes(genre.key) ? "bg-green-400" : "",
              )}
              onClick={() => updateSearchParameters(genre.key, GENRE)}
            >
              {genre.name}
            </div>

            <div className="">
              {genre.subgenres?.map((subgenre) => (
                <div
                  key={subgenre.key}
                  className={cn(
                    "cursor-pointer border border-red-300 p-1",
                    currentSelectedSubgenres.includes(subgenre.key)
                      ? "bg-red-200"
                      : "",
                  )}
                  onClick={() =>
                    updateSearchParameters(
                      subgenre.key,
                      SUBGENRE,
                      genre.key,
                      GENRE,
                    )
                  }
                >
                  {subgenre.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
