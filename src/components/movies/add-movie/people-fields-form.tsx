import { use, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import dynamic from "next/dynamic";

import { z } from "zod";
import { ActorsListScheme } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { ActorOut, DirectorOut, MovieFormData } from "@/orval_api/model";

import { Button } from "@/components/ui/button";
import { formatKey } from "@/lib/utils";
import { AddNewDirector } from "../add-new-director";
import { AddNewActor } from "../add-new-actor";
import { MovieFormContext } from "./movie-form-wizard";
import { ItemsListSelector } from "../ui/items-list-selector";
const ModalMovie = dynamic(() => import("./modal-movie"));

type Props = {
  actors: ActorOut[];
  directors: DirectorOut[];
};

export type MovieInfoFieldNames = Pick<
  MovieFormData,
  "actors_keys" | "directors_keys"
>;

export type PeopleSchemeType = z.infer<typeof ActorsListScheme>;

export const PeopleFieldsForm = ({ actors, directors }: Props) => {
  const { setMovieFormData, handleNext, handlePrev } = use(MovieFormContext);

  const [openDirectorFormModal, setOpenDirectorFormModal] = useState(false);
  const [openActorFormModal, setOpenActorFormModal] = useState(false);

  const parsedData = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const defaultActors = useMemo(() => {
    return parsedData?.actors_keys?.map((a) => {
      return {
        actor_name:
          actors.find((actor) => actor.key === a.key)?.full_name || "",
        character_key: a.character_key,
        character_name_en: a.character_name_en,
        character_name_uk: a.character_name_uk,
        key: a.key,
      };
    });
  }, [actors, parsedData?.actors_keys]);

  const defaultDirectors = useMemo(() => {
    return parsedData?.directors_keys?.map((d) => {
      return {
        full_name:
          directors.find((director) => director.key === d)?.full_name || "",
        key: d,
      };
    });
  }, [directors, parsedData?.directors_keys]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(ActorsListScheme),
    defaultValues: {
      actors: defaultActors || undefined,
      directors: defaultDirectors || undefined,
    },
  });

  const {
    fields: actorFields,
    append: appendActor,
    remove: removeActor,
  } = useFieldArray({
    control,
    name: "actors",
  });

  const watchFields = watch("actors");

  const {
    fields: directorFields,
    append: appendDirector,
    remove: removeDirector,
  } = useFieldArray({
    control,
    name: "directors",
  });

  const onSubmit = (data: PeopleSchemeType) => {
    const dataToSend: MovieInfoFieldNames = {
      actors_keys: data.actors,
      directors_keys: data.directors.map((director) => director.key),
    };

    setMovieFormData((prev) => ({
      ...prev,
      form_data: {
        ...prev.form_data,
        ...dataToSend,
      },
    }));

    try {
      localStorage.setItem(
        "new-movie-data",
        JSON.stringify({
          ...parsedData,
          ...dataToSend,
        }),
      );

      handleNext();
    } catch (error) {
      console.error("Error saving data to local storage", error);
      toast.error("Error saving data to local storage");
    }
  };

  return (
    <>
      <div className="text-textOrange flex items-center gap-3 font-bold">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <h2>Actors</h2>
          {actorFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`actors.${index}.actor_name`)} disabled />
              <input
                {...register(`actors.${index}.character_name_en`)}
                placeholder="Character name EN"
              />
              <input
                {...register(`actors.${index}.character_name_uk`)}
                placeholder="Character name uk"
              />
              <input
                {...register(`actors.${index}.character_key`)}
                value={formatKey([watchFields[index].character_name_en])}
                disabled
              />
              <button type="button" onClick={() => removeActor(index)}>
                Remove Actor
              </button>
              {errors.actors?.[index]?.character_name_en && (
                <p>{errors.actors[index].character_name_en.message}</p>
              )}
              {errors.actors?.[index]?.character_name_uk && (
                <p>{errors.actors[index].character_name_uk.message}</p>
              )}
            </div>
          ))}

          {errors.actors && errors.actors.message && (
            <span className="text-sm text-red-500">
              {errors.actors.message}
            </span>
          )}

          <ItemsListSelector
            items={actors}
            onOpenModal={() => setOpenActorFormModal(true)}
            onSelect={(currentValue, actorKey) => {
              const is_actor_selected = actorFields.find(
                (actor) => actor.key === actorKey,
              );

              if (!is_actor_selected) {
                appendActor({
                  actor_name: currentValue,
                  character_key: "",
                  character_name_en: "",
                  character_name_uk: "",
                  key: actorKey,
                });
              } else {
                removeActor(
                  actorFields.findIndex(
                    (actorPrev) => actorPrev.key === actorKey,
                  ),
                );
              }
            }}
            checkIconStyle={actorFields}
          />

          <h2>Directors</h2>
          {directorFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`directors.${index}.full_name`)} disabled />
              <input {...register(`directors.${index}.key`)} disabled />

              <button type="button" onClick={() => removeDirector(index)}>
                Remove Director
              </button>
            </div>
          ))}

          {errors.directors && (
            <span className="text-sm text-red-500">
              {errors.directors.message}
            </span>
          )}

          <ItemsListSelector
            items={directors}
            onOpenModal={() => setOpenDirectorFormModal(true)}
            onSelect={(currentValue, key) => {
              const is_director_selected = directorFields.find(
                (director) => director.key === key,
              );

              if (!is_director_selected) {
                appendDirector({
                  full_name: currentValue,
                  key: key,
                });
              } else {
                removeDirector(
                  directorFields.findIndex((director) => director.key === key),
                );
              }
            }}
            checkIconStyle={directorFields}
          />

          <Button
            type="submit"
            className="mt-7 h-12 w-full cursor-pointer rounded-xl border-0 text-center text-lg transition-all duration-200 hover:rounded-md"
          >
            Submit
          </Button>

          <Button type="button" variant="link" onClick={handlePrev}>
            back
          </Button>
        </form>
      </div>

      <ModalMovie
        title="Actors"
        open={openActorFormModal}
        setOpen={setOpenActorFormModal}
      >
        <AddNewActor appendActor={appendActor} />
      </ModalMovie>

      <ModalMovie
        title="Director"
        open={openDirectorFormModal}
        setOpen={setOpenDirectorFormModal}
      >
        <AddNewDirector appendDirector={appendDirector} />
      </ModalMovie>
    </>
  );
};
