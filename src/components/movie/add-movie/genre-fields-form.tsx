import { use, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { MovieFormContext } from "@/components/movie/add-movie/utils";
import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { FormButtons } from "@/components/my-custom-ui/form-ui-parts/form-buttons";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { SliderFormField } from "@/components/my-custom-ui/form-ui-parts/slider-form-field";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import { AddNewGenre } from "@/components/movie/add-movie/connected-parts/add-new-genre";

import { createGenre, createSubgenre } from "@/app/services/admin-api";

import { GenreSchemaList } from "@/types/genre-filter-schema";
import type {
  GenreFormOut,
  GenreOut,
  MovieFormData,
  SubgenreOut,
} from "@/orval_api/model";

const ModalMovie = dynamic(
  () => import("@/components/my-custom-ui/modal-window"),
  {
    ssr: false,
  },
);

const checkGenreType = (item: GenreOut | SubgenreOut): item is GenreOut => {
  return (item as GenreOut).subgenres !== undefined;
};

type Props = {
  genres: GenreOut[];
};

export type GenreType = "genres" | "subgenres";
export type MovieInfoFieldNames = Pick<MovieFormData, GenreType>;

export type GenreSchemeType = z.infer<typeof GenreSchemaList>;

export const GenreFieldsForm = ({ genres }: Props) => {
  const t = useTranslations("Form.stepper.genres");
  const tSelect = useTranslations("Form");
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
    resolver: zodResolver(GenreSchemaList),
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
            <h1 className="text-main-ui-purple">{t("name")}</h1>
            <ResponsiveWrapper title={`${tSelect("menuSelect")} ${t("name")}`}>
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
                  removItem={() => {
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
            <h1 className="text-main-ui-purple">{t("subgenres")}</h1>
            <ResponsiveWrapper
              title={`${tSelect("menuSelect")} ${t("subgenres")}`}
            >
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
                  removItem={() => removeSubgenre(index)}
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

      {openGenreFormModal && (
        <ModalMovie
          title={t("addNewGenre")}
          open={openGenreFormModal}
          setOpen={setOpenGenreFormModal}
        >
          <AddNewGenre
            type="genres"
            appendItem={appendGenre}
            fetchApi={createGenre}
          />
        </ModalMovie>
      )}

      {openSubgenreFormModal && (
        <ModalMovie
          title={t("addNewSubgenre")}
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
      )}
    </>
  );
};
