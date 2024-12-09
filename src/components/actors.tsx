"use client";

import { cn } from "@/lib/utils";
import { ActorOut } from "@/orval_api/model";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  actors: ActorOut[];
};

export const Actors = ({ actors }: Props) => {
  const route = useRouter();

  const currentSearchParams = useSearchParams();
  const currentSelectedActors = currentSearchParams.getAll("actor_name");

  const deleteActorParam = (name: string) => {
    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );
    updatedSearchParams.delete("actor_name", name);
    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    // route.refresh();
    route.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  };

  function onClick(name: string) {
    const query = name;

    if (currentSearchParams.has("actor_name", query)) {
      deleteActorParam(query);

      return;
    }

    const updatedSearchParams = new URLSearchParams(
      currentSearchParams.toString(),
    );
    // updatedSearchParams.set("genre", query);
    updatedSearchParams.append("actor_name", query);

    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    // route.refresh();
    route.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });

    // window.location.reload();
  }

  return (
    <div>
      <h1>Actors</h1>

      <div className="grid grid-cols-4 gap-4">
        {actors
          .sort((a, b) => a.full_name.localeCompare(b.full_name))
          .map((actor) => (
            <div
              key={actor.key}
              className={cn(
                "cursor-pointer border border-blue-300 p-1",
                currentSelectedActors.includes(actor.key)
                  ? "bg-purple-400"
                  : "",
              )}
              onClick={() => onClick(actor.key)}
            >
              {actor.full_name}
            </div>
          ))}
      </div>
    </div>
  );
};
