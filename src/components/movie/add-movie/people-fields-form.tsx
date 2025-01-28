import { Suspense, use, useCallback, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import dynamic from "next/dynamic";

import { z } from "zod";
import { ActorsListScheme } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { ActorOut, DirectorOut, MovieFormData } from "@/orval_api/model";

import { formatKey } from "@/lib/utils";
import { AddNewDirector } from "../add-movies-parts/add-new-director";
import { AddNewActor } from "../add-movies-parts/add-new-actor";
import { MovieFormContext } from "./movie-form-wizard";
import { ItemsListSelector } from "../ui/items-list-selector";
import { FormButtons } from "../ui/form-buttons";
import { FormField } from "../ui/form-field";
const ModalMovie = dynamic(() => import("../ui/modal-movie"));

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
        name: actors.find((actor) => actor.key === a.key)?.name || "",
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
        name: directors.find((director) => director.key === d)?.name || "",
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

  const handleOpenDirectorFormModal = useCallback(() => {
    setOpenDirectorFormModal(true);
  }, []);

  const handleOpenActorFormModal = useCallback(() => {
    setOpenActorFormModal(true);
  }, []);

  const handleSelectActor = useCallback(
    (currentValue: string, key: string) => {
      const is_actor_selected = actorFields.find((actor) => actor.key === key);

      if (!is_actor_selected) {
        appendActor({
          name: currentValue,
          character_key: "",
          character_name_en: "",
          character_name_uk: "",
          key: key,
        });
      } else {
        removeActor(
          actorFields.findIndex((actorPrev) => actorPrev.key === key),
        );
      }
    },
    [actorFields, appendActor, removeActor],
  );

  const handleSelectDerector = useCallback(
    (currentValue: string, key: string) => {
      const is_director_selected = directorFields.find(
        (director) => director.key === key,
      );

      if (!is_director_selected) {
        appendDirector({
          name: currentValue,
          key: key,
        });
      } else {
        removeDirector(
          directorFields.findIndex((director) => director.key === key),
        );
      }
    },
    [directorFields, appendDirector, removeDirector],
  );

  return (
    <>
      <div className="flex items-center justify-center gap-3 font-bold">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="mb-5 flex w-full flex-col items-center gap-2">
            <h1 className="text-[#2D26A5]">Actors</h1>
            <ItemsListSelector
              items={actors}
              onOpenModal={handleOpenActorFormModal}
              onSelect={handleSelectActor}
              checkIconStyle={actorFields}
            />

            {actorFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-4 gap-4">
                <FormField
                  type="text"
                  label="Actor name"
                  name={`actors.${index}.name`}
                  register={register}
                  error={undefined}
                  labelWidth={64}
                  disabled
                />

                <FormField
                  type="text"
                  label="Character name en"
                  name={`actors.${index}.character_name_en`}
                  register={register}
                  error={
                    errors.actors?.[index]?.character_name_en &&
                    errors.actors[index].character_name_en
                  }
                  labelWidth={64}
                />

                <FormField
                  type="text"
                  label="Character name uk"
                  name={`actors.${index}.character_name_uk`}
                  register={register}
                  error={
                    errors.actors?.[index]?.character_name_uk &&
                    errors.actors[index].character_name_uk
                  }
                  labelWidth={64}
                />

                <div className="flex items-center gap-2">
                  <FormField
                    type="text"
                    label="Character key"
                    name={`actors.${index}.character_key`}
                    register={register}
                    error={undefined}
                    value={formatKey([watchFields[index].character_name_en])}
                    labelWidth={64}
                    disabled
                  />

                  <button type="button" onClick={() => removeActor(index)}>
                    X
                  </button>
                </div>
              </div>
            ))}

            {errors.actors && errors.actors.message && (
              <span className="text-sm text-red-500">
                {errors.actors.message}
              </span>
            )}
          </div>

          <div className="mb-5 flex w-full flex-col items-center gap-2">
            <h1 className="text-[#2D26A5]">Directors</h1>
            <ItemsListSelector
              items={directors}
              onOpenModal={handleOpenDirectorFormModal}
              onSelect={handleSelectDerector}
              checkIconStyle={directorFields}
            />

            <div className="flex flex-wrap gap-2">
              {directorFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    type="text"
                    label="Director name"
                    name={`directors.${index}.name`}
                    register={register}
                    error={undefined}
                    labelWidth={64}
                    disabled
                  />

                  <button type="button" onClick={() => removeDirector(index)}>
                    X
                  </button>
                </div>
              ))}
            </div>

            {errors.directors && (
              <span className="text-sm text-red-500">
                {errors.directors.message}
              </span>
            )}
          </div>
          <FormButtons handlePrev={handlePrev} />
        </form>
      </div>

      <Suspense>
        <ModalMovie
          title="Add new Actor"
          open={openActorFormModal}
          setOpen={setOpenActorFormModal}
        >
          <AddNewActor appendActor={appendActor} />
        </ModalMovie>

        <ModalMovie
          title="Add new Director"
          open={openDirectorFormModal}
          setOpen={setOpenDirectorFormModal}
        >
          <AddNewDirector appendDirector={appendDirector} />
        </ModalMovie>
      </Suspense>
    </>
  );
};
