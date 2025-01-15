import { Suspense, use, useState } from "react";
import dynamic from "next/dynamic";
import { useFieldArray, useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenreSchemeList } from "@/types/zod-scheme";
import type { GenreOut, MovieFormData, SubgenreOut } from "@/orval_api/model";

import { Button } from "@/components/ui/button";
import { MovieFormContext } from "./movie-form-wizard";
import { AddNewGenre } from "../add-new-genre";
import { AddNewSubgenre } from "../add-new-subgenre";
import { ItemsListSelector } from "../ui/items-list-selector";
import { useLocalStorage } from "@/hooks/useLocalStorage";
const ModalMovie = dynamic(() => import("./modal-movie"));

const checkGenreType = (item: GenreOut | SubgenreOut): item is GenreOut => {
  return (item as GenreOut).subgenres !== undefined;
};

type Props = {
  genres: GenreOut[];
};

export type MovieInfoFieldNames = Pick<MovieFormData, "genres" | "subgenres">;

export type GenreSchemeType = z.infer<typeof GenreSchemeList>;

export const GenreFieldsForm = ({ genres }: Props) => {
  const { setMovieFormData, handleNext, handlePrev } = use(MovieFormContext);

  const [openGenreFormModal, setOpenGenreFormModal] = useState(false);
  const [openSubgenreFormModal, setOpenSubgenreFormModal] = useState(false);

  const parsedData = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const genresKeys = parsedData.genres?.map((g) => g.key);

  const [subgenres, setSubgenres] = useState<SubgenreOut[]>(
    genresKeys
      ? genres
          .map(
            (g) =>
              g.subgenres?.filter((e) =>
                genresKeys.includes(e.parent_genre_key),
              ) || [],
          )
          .flat()
      : [],
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(GenreSchemeList),
    defaultValues: {
      genres: parsedData.genres,
      subgenres: parsedData.subgenres,
    },
  });

  const {
    fields: genreFields,
    append: appendGenre,
    remove: removeGenre,
  } = useFieldArray({
    control,
    name: "genres",
  });

  const {
    fields: subgenreFields,
    append: appendSubgenre,
    remove: removeSubgenre,
  } = useFieldArray({
    control,
    name: "subgenres",
  });

  const onSubmit = async (data: GenreSchemeType) => {
    const dataToSend: MovieInfoFieldNames = {
      genres: data.genres,
      subgenres: data.subgenres,
    };

    setMovieFormData((prev) => ({
      ...prev,
      form_data: {
        ...prev.form_data,
        ...dataToSend,
      },
    }));

    localStorage.setItem(
      "new-movie-data",
      JSON.stringify({
        ...parsedData,
        ...dataToSend,
      }),
    );

    handleNext();
  };

  return (
    <>
      <div className="text-textOrange flex items-center gap-3 font-bold">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <h2>Genres</h2>
          {genreFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`genres.${index}.name`)} disabled />
              <input
                {...register(`genres.${index}.percentage_match`)}
                placeholder="Percentage match"
              />

              {errors.genres?.[index]?.percentage_match && (
                <p>{errors.genres[index].percentage_match.message}</p>
              )}

              <button
                type="button"
                onClick={() => {
                  removeGenre(index);
                  setSubgenres((prev) =>
                    prev.filter(
                      (subgenrePrev) =>
                        subgenrePrev.parent_genre_key !== field.key,
                    ),
                  );

                  const indices = subgenreFields.flatMap((val, index) =>
                    val.subgenre_parent_key === field.key ? index : [],
                  );

                  if (indices.length) {
                    removeSubgenre(indices);
                  }
                }}
              >
                Remove Actor
              </button>

              {errors.genres && errors.genres.message && (
                <p>{errors.genres.message}</p>
              )}
            </div>
          ))}

          {errors.genres && errors.genres.message && (
            <span className="text-sm text-red-500">
              {errors.genres.message}
            </span>
          )}

          <ItemsListSelector
            items={genres}
            onOpenModal={() => setOpenGenreFormModal(true)}
            onSelect={(currentValue, key, genre) => {
              if (!genreFields.find((genrePrev) => genrePrev.key === key)) {
                appendGenre({
                  name: currentValue,
                  percentage_match: 0,
                  key: key,
                });

                if (genre && checkGenreType(genre) && genre.subgenres?.length) {
                  setSubgenres((prev) => [...prev, ...(genre.subgenres || [])]);
                }
              } else {
                removeGenre(
                  genreFields.findIndex((genrePrev) => genrePrev.key === key),
                );

                setSubgenres((prev) =>
                  prev.filter(
                    (subgenrePrev) => subgenrePrev.parent_genre_key !== key,
                  ),
                );
              }
            }}
            checkIconStyle={genreFields}
          />

          <h2>Subgenres</h2>
          {subgenreFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`subgenres.${index}.name`)} disabled />
              <input
                {...register(`subgenres.${index}.percentage_match`)}
                placeholder="Percentage match"
              />

              {errors.subgenres?.[index]?.percentage_match && (
                <p>{errors.subgenres[index].percentage_match.message}</p>
              )}

              <button type="button" onClick={() => removeSubgenre(index)}>
                Remove Subgenre
              </button>
              {errors.subgenres?.[index]?.name && (
                <p>{errors.subgenres[index].name.message}</p>
              )}
            </div>
          ))}

          <ItemsListSelector
            items={subgenres}
            onOpenModal={() => setOpenSubgenreFormModal(true)}
            onSelect={(currentValue, key, subgenre) => {
              if (
                !subgenreFields.find(
                  (subgenrePrev) => subgenrePrev.key === key,
                ) &&
                subgenre
              ) {
                appendSubgenre({
                  name: currentValue,
                  percentage_match: 0,
                  subgenre_parent_key: !checkGenreType(subgenre)
                    ? subgenre.parent_genre_key
                    : "",
                  key: key,
                });
              } else {
                removeSubgenre(
                  subgenreFields.findIndex(
                    (subgenrePrev) => subgenrePrev.key === key,
                  ),
                );
              }
            }}
            checkIconStyle={subgenreFields}
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

      <Suspense>
        <ModalMovie
          title="Genre"
          open={openGenreFormModal}
          setOpen={setOpenGenreFormModal}
        >
          <AddNewGenre appendGenre={appendGenre} />
        </ModalMovie>

        <ModalMovie
          title="Subgenre"
          open={openSubgenreFormModal}
          setOpen={setOpenSubgenreFormModal}
        >
          <AddNewSubgenre
            appendSubgenre={appendSubgenre}
            setSubgenres={setSubgenres}
            genresList={genreFields}
          />
        </ModalMovie>
      </Suspense>
    </>
  );
};
