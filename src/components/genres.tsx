"use client";
import { GenreOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  genres: GenreOut[];
};
export const Genres = ({ genres }: Props) => {
  const route = useRouter();

  const currentSearchParams = useSearchParams();

  const deleteGenreParam = (name: string) => {
    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );
    updatedSearchParams.delete("genre_name", name);
    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    // route.refresh();
    route.replace("/super-search" + "?" + updatedSearchParams.toString());
  };

  function onClick(name: string) {
    const query = name;

    if (currentSearchParams.has("genre_name", query)) {
      deleteGenreParam(query);

      return;
    }

    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );
    // updatedSearchParams.set("genre", query);
    updatedSearchParams.append("genre_name", query);

    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    // route.refresh();
    route.replace("/super-search" + "?" + updatedSearchParams.toString());

    // window.location.reload();
  }

  return (
    <div>
      <h1>Genres</h1>

      <div className="flex flex-col gap-2">
        {genres.map((genre) => (
          <div key={genre.key}>
            <div
              className="border border-blue-300 p-3"
              onClick={() => onClick(genre.key)}
            >
              {genre.name}
            </div>

            <div className="translate-x-5">
              {genre.subgenres?.map((subgenre) => (
                <div
                  key={subgenre.key}
                  className="border border-red-300 p-1"
                  onClick={() => onClick(subgenre.key)}
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
