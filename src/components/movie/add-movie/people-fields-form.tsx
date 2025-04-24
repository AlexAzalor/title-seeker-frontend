import { Suspense, use, useCallback, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import dynamic from "next/dynamic";
import { MovieFormContext } from "./utils";

import { createActor, createDirector } from "@/app/services/admin-api";
import { z } from "zod";
import { MovieCrewListScheme } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type {
  ActorOut,
  CharacterOut,
  DirectorOut,
  MovieFormData,
} from "@/orval_api/model";

import { AddNewPerson } from "../add-movies-parts/add-new-person";
import { ItemsListSelector } from "../ui/items-list-selector";
import { FormButtons } from "../ui/form-buttons";
import { FormField } from "../ui/form-field";
import { ResponsiveWrapper } from "../ui/responsive-wrapper";
import { AddNewCharacter } from "../add-movies-parts/add-new-character";

const ModalMovie = dynamic(() => import("../ui/modal-movie"));

type Props = {
  actors: ActorOut[];
  directors: DirectorOut[];
  characters: CharacterOut[];
};

export type MovieInfoFieldNames = Pick<
  MovieFormData,
  "actors_keys" | "directors_keys"
>;

export type PeopleSchemeType = z.infer<typeof MovieCrewListScheme>;

export const PeopleFieldsForm = ({ actors, directors, characters }: Props) => {
  const { setMovieFormData, handleNext, handlePrev } = use(MovieFormContext);

  const [openDirectorFormModal, setOpenDirectorFormModal] = useState(false);
  const [openActorFormModal, setOpenActorFormModal] = useState(false);
  const [openCharacterFormModal, setOpenCharacterFormModal] = useState<{
    open: boolean;
    index: number | null;
  }>({ open: false, index: null });

  const { data: parsedData } = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const defaultActors = useMemo(() => {
    return parsedData?.actors_keys?.map((a) => {
      return {
        name: actors.find((actor) => actor.key === a.key)?.name || "",
        character_key: a.character_key,
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
    setValue,
  } = useForm({
    resolver: zodResolver(MovieCrewListScheme),
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
          <div className="mb-5 flex w-full flex-col items-center gap-6">
            <h1 className="text-[#2D26A5]">Actors</h1>

            <ResponsiveWrapper title="Select Actor">
              <ItemsListSelector
                items={actors}
                onOpenModal={handleOpenActorFormModal}
                onSelect={handleSelectActor}
                checkIconStyle={actorFields}
              />
            </ResponsiveWrapper>

            {/* TODO: Implement Drag&Drop */}
            <span>
              Order of actors is important. The first actor will be the main,
              and so on.
            </span>

            {actorFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-4">
                <FormField
                  type="text"
                  label="Actor name"
                  name={`actors.${index}.name`}
                  register={register}
                  error={undefined}
                  disabled
                />

                <Controller
                  control={control}
                  name={`actors.${index}.character_key`}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <div className="relative">
                      <ResponsiveWrapper
                        title={
                          characters
                            .find((e) => e.key === value)
                            ?.name.slice(0, 20) || "Characters"
                        }
                      >
                        <ItemsListSelector
                          items={characters}
                          onOpenModal={() =>
                            setOpenCharacterFormModal({ open: true, index })
                          }
                          onSelect={(value, key) => {
                            if (
                              actorFields.find((e) => e.character_key === key)
                            ) {
                              return;
                            }
                            onChange(key);
                          }}
                          checkIconStyle={[
                            ...actorFields.map((e) => e.character_key),
                            value,
                          ]}
                        />
                      </ResponsiveWrapper>

                      <button
                        type="button"
                        className="ml-2 size-fit"
                        onClick={() => removeActor(index)}
                      >
                        X
                      </button>
                      {error && (
                        <span className="absolute -bottom-4 left-1 text-red-500">
                          {error.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
            ))}

            {errors.actors && errors.actors.message && (
              <span className="text-sm text-red-500">
                {errors.actors.message}
              </span>
            )}
          </div>

          <div className="mb-5 flex w-full flex-col items-center gap-6">
            <h1 className="text-[#2D26A5]">Directors</h1>

            <ResponsiveWrapper title="Select Director">
              <ItemsListSelector
                items={directors}
                onOpenModal={handleOpenDirectorFormModal}
                onSelect={handleSelectDerector}
                checkIconStyle={directorFields}
              />
            </ResponsiveWrapper>

            <div className="flex flex-wrap gap-2">
              {directorFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    type="text"
                    label="Director name"
                    name={`directors.${index}.name`}
                    register={register}
                    error={undefined}
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
          <AddNewPerson
            type="actors"
            appendPerson={appendActor}
            fetchApi={createActor}
          />
        </ModalMovie>

        <ModalMovie
          title="Add new Director"
          open={openDirectorFormModal}
          setOpen={setOpenDirectorFormModal}
        >
          <AddNewPerson
            type="directors"
            appendPerson={appendDirector}
            fetchApi={createDirector}
          />
        </ModalMovie>

        <ModalMovie
          title="Add new Character"
          open={openCharacterFormModal.open}
          setOpen={() =>
            setOpenCharacterFormModal({ open: false, index: null })
          }
        >
          <AddNewCharacter
            setValue={setValue}
            characterIndexField={openCharacterFormModal.index}
          />
        </ModalMovie>
      </Suspense>
    </>
  );
};
