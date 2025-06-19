import { use, useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CircleArrowDown, CircleArrowUp, CircleX } from "lucide-react";
import { MovieFormContext } from "@/components/movie/add-movie/utils";

import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { FormButtons } from "@/components/my-custom-ui/form-ui-parts/form-buttons";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import { AddNewCharacter } from "@/components/movie/add-movie/connected-parts/add-new-character";
import { AddNewPerson } from "@/components/movie/add-movie/connected-parts/add-new-person";

import { createActor, createDirector } from "@/app/services/admin-api";
import { PeopleListSchema } from "@/types/people-schema";

import type {
  PersonBase,
  CharacterOut,
  MovieFormData,
} from "@/orval_api/model";

const ModalMovie = dynamic(
  () => import("@/components/my-custom-ui/modal-window"),
  {
    ssr: false,
  },
);

type Props = {
  actors: PersonBase[];
  directors: PersonBase[];
  characters: CharacterOut[];
};

export type MovieInfoFieldNames = Pick<
  MovieFormData,
  "actors_keys" | "directors_keys"
>;

export type PeopleSchemeType = z.infer<typeof PeopleListSchema>;

export const PeopleFieldsForm = ({ actors, directors, characters }: Props) => {
  const t = useTranslations("Form.stepper.people");

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
    resolver: zodResolver(PeopleListSchema),
    defaultValues: {
      actors: defaultActors || undefined,
      directors: defaultDirectors || undefined,
    },
  });

  const {
    fields: actorFields,
    append: appendActor,
    remove: removeActor,
    move,
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

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < actorFields.length - 1) {
      move(index, index + 1);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-3 font-bold">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="mb-5 flex w-full flex-col items-center gap-6">
            <h1 className="text-main-ui-purple">{t("actors")}</h1>

            <ResponsiveWrapper title={t("selectActors")}>
              <ItemsSelector
                items={actors}
                onOpenModal={handleOpenActorFormModal}
                onSelect={handleSelectActor}
                checkIconStyle={actorFields.map((field) => field.key)}
              />
            </ResponsiveWrapper>

            <span className="text-gray-purple">{t("orderInfo")}</span>

            <AnimatePresence>
              {actorFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <FormField
                    type="text"
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
                      <div className="relative flex items-center gap-2">
                        <ResponsiveWrapper
                          title={
                            characters
                              .find((e) => e.key === value)
                              ?.name.slice(0, 20) || "Characters"
                          }
                        >
                          <ItemsSelector
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
                          className=""
                          onClick={() => handleMoveUp(index)}
                        >
                          <CircleArrowUp className="h-6 w-6 transition-transform hover:scale-110" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                        >
                          <CircleArrowDown className="h-6 w-6 transition-transform hover:scale-110" />
                        </button>

                        <button
                          type="button"
                          className="ml-2 size-fit"
                          onClick={() => removeActor(index)}
                        >
                          <CircleX
                            color="red"
                            className="h-5 w-5 transition-transform hover:scale-110"
                          />
                        </button>

                        {error && (
                          <span className="absolute -bottom-4 left-1 text-red-500">
                            {error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {errors.actors && errors.actors.message && (
              <span className="text-sm text-red-500">
                {errors.actors.message}
              </span>
            )}
          </div>

          <div className="mb-5 flex w-full flex-col items-center gap-6">
            <h1 className="text-main-ui-purple">{t("directors")}</h1>

            <ResponsiveWrapper title={t("selectDirectors")}>
              <ItemsSelector
                items={directors}
                onOpenModal={handleOpenDirectorFormModal}
                onSelect={handleSelectDerector}
                checkIconStyle={directorFields.map((field) => field.key)}
              />
            </ResponsiveWrapper>

            <div className="flex flex-wrap gap-2">
              {directorFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormField
                    type="text"
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

      {openActorFormModal && (
        <ModalMovie
          title={t("addActor")}
          open={openActorFormModal}
          setOpen={setOpenActorFormModal}
        >
          <AddNewPerson
            type="actors"
            appendPerson={appendActor}
            fetchApi={createActor}
          />
        </ModalMovie>
      )}

      {openDirectorFormModal && (
        <ModalMovie
          title={t("addDirector")}
          open={openDirectorFormModal}
          setOpen={setOpenDirectorFormModal}
        >
          <AddNewPerson
            type="directors"
            appendPerson={appendDirector}
            fetchApi={createDirector}
          />
        </ModalMovie>
      )}

      {openCharacterFormModal.open && (
        <ModalMovie
          title={t("addChar")}
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
      )}
    </>
  );
};
