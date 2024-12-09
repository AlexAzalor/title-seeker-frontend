"use client";

import { cn } from "@/lib/utils";
import { DirectorOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  directors: DirectorOut[];
};

export const Directors = ({ directors }: Props) => {
  const route = useRouter();

  const currentSearchParams = useSearchParams();
  const currentSelectedDirectors = currentSearchParams.getAll("director_name");

  const deleteDirectorParam = (name: string) => {
    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );
    updatedSearchParams.delete("director_name", name);
    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    // route.refresh();
    route.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  };

  function onClick(name: string) {
    const query = name;

    if (currentSearchParams.has("director_name", query)) {
      deleteDirectorParam(query);

      return;
    }

    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );
    // updatedSearchParams.set("genre", query);
    updatedSearchParams.append("director_name", query);

    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    // route.refresh();
    route.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });

    // window.location.reload();
  }

  return (
    <div>
      <h1>Directors</h1>

      <div className="grid grid-cols-1 gap-4">
        {directors
          .sort((a, b) => a.full_name.localeCompare(b.full_name))
          .map((director) => (
            <div
              key={director.key}
              className={cn(
                "cursor-pointer border border-black p-1",
                currentSelectedDirectors.includes(director.key)
                  ? "bg-gray-400"
                  : "",
              )}
              onClick={() => onClick(director.key)}
            >
              {director.full_name}
            </div>
          ))}
      </div>
    </div>
  );
};
