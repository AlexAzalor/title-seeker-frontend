"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  type UseFieldArrayAppend,
  type UseFormSetValue,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CircleArrowDown, CircleArrowUp, CircleX } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";

import { createActor, editMovieActors } from "@/app/(app)/services/admin-api";
import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import { Button } from "@/components/ui/button";
import { AddNewPerson } from "@/components/movie/add-movie/connected-parts/add-new-person";
import { AddNewCharacter } from "@/components/movie/add-movie/connected-parts/add-new-character";

import type { MainItemMenu, MovieActorOut } from "@/orval_api/model";
import type { PeopleSchemeType } from "@/components/movie/add-movie/people-fields-form";
import type { PeopleListSchemaType } from "@/types/people-schema";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";

const ModalMovie = dynamic(
  () => import("@/components/my-custom-ui/modal-window"),
  { ssr: false },
);

const ActorEntrySchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  character_key: z.string().min(1, { message: "Character is required" }),
});

const EditActorsSchema = z.object({
  actors: z.array(ActorEntrySchema),
});

type EditActorsFormType = z.infer<typeof EditActorsSchema>;

type Props = {
  movieKey: string;
  allActors: MainItemMenu[];
  allCharacters: MainItemMenu[];
  currentActors: MovieActorOut[];
  onClose: () => void;
};

export const EditMovieActors = ({
  movieKey,
  allActors,
  allCharacters,
  currentActors,
  onClose,
}: Props) => {
  const router = useRouter();

  const [openActorFormModal, setOpenActorFormModal] = useState(false);
  const [openCharacterFormModal, setOpenCharacterFormModal] = useState<{
    open: boolean;
    index: number | null;
  }>({ open: false, index: null });
  const [characters, setCharacters] = useState(allCharacters);

  const defaultActors = useMemo(() => {
    return currentActors.map((actor) => {
      const character = characters.find((c) => c.name === actor.character_name);
      return {
        key: actor.key,
        name: actor.full_name,
        character_key: character?.key ?? "",
      };
    });
  }, [currentActors, characters]);

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<EditActorsFormType>({
    resolver: zodResolver(EditActorsSchema),
    defaultValues: {
      actors: defaultActors,
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

  const handleSelectActor = useCallback(
    (item: MainItemMenu) => {
      const existingIndex = actorFields.findIndex((f) => f.key === item.key);
      if (existingIndex === -1) {
        appendActor({ key: item.key, name: item.name, character_key: "" });
      } else {
        removeActor(existingIndex);
      }
    },
    [actorFields, appendActor, removeActor],
  );

  const handleMoveUp = (index: number) => {
    if (index > 0) move(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index < actorFields.length - 1) move(index, index + 1);
  };

  const selectedActorKeys = actorFields.map((f) => f.key);

  const onSubmit = async (data: EditActorsFormType) => {
    try {
      const res = await editMovieActors(
        movieKey,
        data.actors.map(({ key, character_key }) => ({ key, character_key })),
      );

      if (res.status === 200) {
        toast.success(res.message);
        onClose();
        router.refresh();
      } else {
        toast.error(res.message ?? "Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred while updating actors");
      console.error("Edit movie actors error:", error);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-center">
        <p className="base-neon-text text-2xl">Actors</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-6"
      >
        <ResponsiveWrapper title="Select Actors">
          <ItemsSelector
            items={allActors}
            onSelect={handleSelectActor}
            onOpenModal={() => setOpenActorFormModal(true)}
            checkIconStyle={selectedActorKeys}
          />
        </ResponsiveWrapper>

        <AnimatePresence>
          {actorFields.map((field, index) => (
            <motion.div
              key={field.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="grid w-full grid-cols-2 gap-4"
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
                          .find((c) => c.key === value)
                          ?.name.slice(0, 20) ?? "Character"
                      }
                    >
                      <ItemsSelector
                        items={characters}
                        onOpenModal={() =>
                          setOpenCharacterFormModal({ open: true, index })
                        }
                        onSelect={({ key }) => {
                          const alreadyUsed = actorFields.find(
                            (f, i) => i !== index && f.character_key === key,
                          );
                          if (!alreadyUsed) onChange(key);
                        }}
                        checkIconStyle={[
                          ...actorFields
                            .filter((_, i) => i !== index)
                            .map((f) => f.character_key),
                          value,
                        ]}
                      />
                    </ResponsiveWrapper>

                    <button type="button" onClick={() => handleMoveUp(index)}>
                      <CircleArrowUp className="h-6 w-6 transition-transform hover:scale-110" />
                    </button>

                    <button type="button" onClick={() => handleMoveDown(index)}>
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
                      <span className="absolute -bottom-4 left-1 text-sm text-red-500">
                        {error.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {errors.actors?.message && (
          <span className="text-sm text-red-500">{errors.actors.message}</span>
        )}

        <Button type="submit">Save</Button>
      </form>

      {openActorFormModal && (
        <ModalMovie
          title="Add Actor"
          open={openActorFormModal}
          setOpen={setOpenActorFormModal}
        >
          <AddNewPerson
            type="actors"
            appendPerson={
              appendActor as unknown as UseFieldArrayAppend<
                PeopleListSchemaType,
                "actors"
              >
            }
            fetchApi={createActor}
          />
        </ModalMovie>
      )}

      {openCharacterFormModal.open && (
        <ModalMovie
          title="Add Character"
          open={openCharacterFormModal.open}
          setOpen={() =>
            setOpenCharacterFormModal({ open: false, index: null })
          }
        >
          <AddNewCharacter
            setValue={setValue as unknown as UseFormSetValue<PeopleSchemeType>}
            characterIndexField={openCharacterFormModal.index}
            onCharacterCreated={(newCharacter) => {
              setCharacters((prev) => {
                if (prev.find((item) => item.key === newCharacter.key)) {
                  return prev;
                }

                return [
                  ...prev,
                  {
                    key: newCharacter.key,
                    name: newCharacter.name,
                    another_lang_name: newCharacter.name,
                    movie_count: newCharacter.movie_count,
                  },
                ];
              });

              setOpenCharacterFormModal({ open: false, index: null });
            }}
          />
        </ModalMovie>
      )}
    </>
  );
};
