import { Suspense, use, useState } from "react";
import dynamic from "next/dynamic";
import { useFieldArray, useForm } from "react-hook-form";
import { MovieFormContext } from "./utils";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenreSchemeList } from "@/types/zod-scheme";

import { createGenre, createSubgenre } from "@/app/services/admin-api";
import type {
  GenreFormOut,
  GenreOut,
  MovieFormData,
  SubgenreOut,
} from "@/orval_api/model";

import { AddNewGenre } from "./connected-parts/add-new-genre";
import { ItemsSelector } from "../../my-custom-ui/items-list-selector";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { FormButtons } from "@/components/my-custom-ui/form-ui-parts/form-buttons";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { SliderFormField } from "@/components/my-custom-ui/form-ui-parts/slider-form-field";
import { ResponsiveWrapper } from "../../my-custom-ui/responsive-wrapper";

const ModalMovie = dynamic(() => import("../../my-custom-ui/modal-window"));

const checkGenreType = (item: GenreOut | SubgenreOut): item is GenreOut => {
  return (item as GenreOut).subgenres !== undefined;
};

type Props = {
  genres: GenreOut[];
};

export type GenreType = "genres" | "subgenres";
export type MovieInfoFieldNames = Pick<MovieFormData, GenreType>;

export type GenreSchemeType = z.infer<typeof GenreSchemeList>;

export const GenreFieldsForm = ({ genres }: Props) => {
  const { setMovieFormData, handleNext, handlePrev } = use(MovieFormContext);

  const [openGenreFormModal, setOpenGenreFormModal] = useState(false);
  const [openSubgenreFormModal, setOpenSubgenreFormModal] = useState(false);

  const { data: parsedData } = useLocalStorage<MovieFormData>(
    "new-movie-data",
    {} as MovieFormData,
  );

  const genresKeys = parsedData.genres?.map((g) => g.key);

  const [subgenres, setSubgenres] = useState<GenreFormOut[]>(
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
    getValues,
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
      <div className="text-textOrange flex items-center justify-center gap-3 font-bold">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="mb-5 flex w-full flex-col items-center gap-6">
            <h1 className="text-main-ui-purple">Genres</h1>
            <ResponsiveWrapper title="Genres">
              <ItemsSelector<GenreOut>
                items={genres}
                onOpenModal={() => setOpenGenreFormModal(true)}
                onSelect={(currentValue, key, genre) => {
                  if (!genreFields.find((genrePrev) => genrePrev.key === key)) {
                    appendGenre({
                      name: currentValue,
                      percentage_match: 0,
                      key: key,
                    });

                    if (
                      genre &&
                      checkGenreType(genre) &&
                      genre.subgenres?.length
                    ) {
                      setSubgenres((prev) => [
                        ...prev,
                        ...(genre.subgenres || []),
                      ]);
                    }
                  } else {
                    removeGenre(
                      genreFields.findIndex(
                        (genrePrev) => genrePrev.key === key,
                      ),
                    );

                    setSubgenres((prev) =>
                      prev.filter(
                        (subgenrePrev) => subgenrePrev.parent_genre_key !== key,
                      ),
                    );
                  }
                }}
                checkIconStyle={genreFields.map((field) => field.key)}
              />
            </ResponsiveWrapper>

            {genreFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-4">
                <FormField
                  type="text"
                  label="Name"
                  name={`genres.${index}.name`}
                  register={register}
                  error={undefined}
                  disabled
                />

                <SliderFormField
                  name={`genres.${index}.percentage_match`}
                  register={register}
                  defaultValue={getValues}
                  error={
                    errors.genres?.[index]?.percentage_match &&
                    errors.genres[index].percentage_match
                  }
                  onClickButton={() => {
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
                />

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
          </div>

          <div className="mb-5 flex w-full flex-col items-center gap-6">
            <h1 className="text-main-ui-purple">Subgenres</h1>
            <ResponsiveWrapper title="Subgenres">
              <ItemsSelector<SubgenreOut>
                items={subgenres as SubgenreOut[]}
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
                checkIconStyle={subgenreFields.map((field) => field.key)}
              />
            </ResponsiveWrapper>

            {subgenreFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-4">
                <FormField
                  type="text"
                  label="Name"
                  name={`subgenres.${index}.name`}
                  register={register}
                  error={undefined}
                  disabled
                />

                <SliderFormField
                  name={`subgenres.${index}.percentage_match`}
                  register={register}
                  defaultValue={getValues}
                  error={
                    errors.subgenres?.[index]?.percentage_match &&
                    errors.subgenres[index].percentage_match
                  }
                  onClickButton={() => removeSubgenre(index)}
                />

                {errors.subgenres?.[index]?.name && (
                  <p>{errors.subgenres[index].name.message}</p>
                )}
              </div>
            ))}
          </div>

          <FormButtons handlePrev={handlePrev} />
        </form>
      </div>

      <Suspense>
        <ModalMovie
          title="Add new genre"
          open={openGenreFormModal}
          setOpen={setOpenGenreFormModal}
        >
          <AddNewGenre
            type="genres"
            appendItem={appendGenre}
            fetchApi={createGenre}
          />
        </ModalMovie>

        <ModalMovie
          title="Add new subgenre"
          open={openSubgenreFormModal}
          setOpen={setOpenSubgenreFormModal}
        >
          <AddNewGenre
            type="subgenres"
            appendItem={appendSubgenre}
            fetchApi={createSubgenre}
            setSubgenres={setSubgenres}
            genresList={genreFields}
          />
        </ModalMovie>
      </Suspense>
    </>
  );
};
