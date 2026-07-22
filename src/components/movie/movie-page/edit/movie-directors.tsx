"use client";

import { useCallback, useMemo, useState } from "react";
import {
  useFieldArray,
  useForm,
  type UseFieldArrayAppend,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CircleArrowDown, CircleArrowUp, CircleX } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";

import {
  createDirector,
  editMovieDirectors,
} from "@/app/(app)/services/admin-api";
import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import { Button } from "@/components/ui/button";
import { AddNewPerson } from "@/components/movie/add-movie/connected-parts/add-new-person";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";

import type { MainItemMenu, MoviePersonOut } from "@/orval_api/model";
import type { PeopleListSchemaType } from "@/types/people-schema";

const ModalMovie = dynamic(
  () => import("@/components/my-custom-ui/modal-window"),
  { ssr: false },
);

const DirectorEntrySchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
});

const EditDirectorsSchema = z.object({
  directors: z.array(DirectorEntrySchema).min(1, {
    message: "At least one Director must be selected",
  }),
});

type EditDirectorsFormType = z.infer<typeof EditDirectorsSchema>;

type Props = {
  movieKey: string;
  allDirectors: MainItemMenu[];
  currentDirectors?: MoviePersonOut[];
  onClose: () => void;
};

export const EditMovieDirectors = ({
  movieKey,
  allDirectors,
  currentDirectors = [],
  onClose,
}: Props) => {
  const router = useRouter();

  const [openDirectorFormModal, setOpenDirectorFormModal] = useState(false);

  const defaultDirectors = useMemo(() => {
    return currentDirectors.map((director) => ({
      key: director.key,
      name: director.full_name,
    }));
  }, [currentDirectors]);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EditDirectorsFormType>({
    resolver: zodResolver(EditDirectorsSchema),
    defaultValues: {
      directors: defaultDirectors,
    },
  });

  const {
    fields: directorFields,
    append: appendDirector,
    remove: removeDirector,
    move,
  } = useFieldArray({
    control,
    name: "directors",
  });

  const handleSelectDirector = useCallback(
    (item: MainItemMenu) => {
      const existingIndex = directorFields.findIndex((f) => f.key === item.key);

      if (existingIndex === -1) {
        appendDirector({ key: item.key, name: item.name });
      } else {
        removeDirector(existingIndex);
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
    if (index < directorFields.length - 1) {
      move(index, index + 1);
    }
  };

  const selectedDirectorKeys = directorFields.map((f) => f.key);

  const onSubmit = async (data: EditDirectorsFormType) => {
    try {
      const res = await editMovieDirectors(
        movieKey,
        data.directors.map((director) => director.key),
      );

      if (res.status === 200) {
        toast.success(res.message);
        onClose();
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating directors");
      console.error("Edit movie directors error:", error);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-center">
        <p className="base-neon-text text-2xl">Directors</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-6"
      >
        <ResponsiveWrapper title="Select Directors">
          <ItemsSelector
            items={allDirectors ?? []}
            onSelect={handleSelectDirector}
            onOpenModal={() => setOpenDirectorFormModal(true)}
            checkIconStyle={selectedDirectorKeys}
          />
        </ResponsiveWrapper>

        <AnimatePresence>
          {directorFields.map((field, index) => (
            <motion.div
              key={field.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="grid w-full grid-cols-[1fr_auto_auto_auto] items-center gap-2"
            >
              <FormField
                type="text"
                name={`directors.${index}.name`}
                register={register}
                error={undefined}
                disabled
              />

              <button type="button" onClick={() => handleMoveUp(index)}>
                <CircleArrowUp className="h-6 w-6 transition-transform hover:scale-110" />
              </button>

              <button type="button" onClick={() => handleMoveDown(index)}>
                <CircleArrowDown className="h-6 w-6 transition-transform hover:scale-110" />
              </button>

              <button
                type="button"
                className="ml-2 size-fit"
                onClick={() => removeDirector(index)}
              >
                <CircleX
                  color="red"
                  className="h-5 w-5 transition-transform hover:scale-110"
                />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {errors.directors?.message && (
          <span className="text-sm text-red-500">
            {errors.directors.message}
          </span>
        )}

        <Button type="submit">Save</Button>
      </form>

      {openDirectorFormModal && (
        <ModalMovie
          title="Add Director"
          open={openDirectorFormModal}
          setOpen={setOpenDirectorFormModal}
        >
          <AddNewPerson
            type="directors"
            appendPerson={
              appendDirector as unknown as UseFieldArrayAppend<
                PeopleListSchemaType,
                "directors"
              >
            }
            fetchApi={createDirector}
          />
        </ModalMovie>
      )}
    </>
  );
};
