import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import { type FieldArrayWithId, useFieldArray, useForm } from "react-hook-form";
import { InfoIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { FormField } from "@/components/my-custom-ui/form-ui-parts/form-field";
import { SliderFormField } from "@/components/my-custom-ui/form-ui-parts/slider-form-field";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import { FormWrapper } from "@/components/my-custom-ui/form-ui-parts/form-wrapper";
import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import { AddNewGenre } from "@/components/movie/add-movie/connected-parts/add-new-genre";

import {
  createGenre,
  createSubgenre,
  updateGenresSubgenres,
} from "@/app/services/admin-api";

import {
  GenreSchemaList,
  type GenreSchemaListType,
} from "@/types/genre-filter-schema";

import type {
  GenreFormOut,
  GenreItemFieldEditFormIn,
  GenreOut,
  MovieFilterField,
  MovieFormData,
  SubgenreOut,
} from "@/orval_api/model";

const ModalMovie = dynamic(
  () => import("@/components/my-custom-ui/modal-window"),
  {
    ssr: false,
  },
);

// const checkGenreType = (item: GenreOut | SubgenreOut): item is GenreOut => {
//   return (item as GenreOut).subgenres !== undefined;
// };

type Props = {
  movieKey: string;
  allGenres: GenreOut[];
  selectedGenres: MovieFilterField[];
  selectedSubgenres: MovieFilterField[];
};

export type GenreType = "genres" | "subgenres";
export type MovieInfoFieldNames = Pick<MovieFormData, GenreType>;

export type GenreSchemeType = z.infer<typeof GenreSchemaList>;

export const GenreEditForm = ({
  movieKey,
  allGenres,
  selectedGenres,
  selectedSubgenres,
}: Props) => {
  const router = useRouter();

  const t = useTranslations("Form.stepper.genres");
  const tSelect = useTranslations("Form");
  const tFilters = useTranslations("Filters");

  const [openGenreFormModal, setOpenGenreFormModal] = useState(false);
  const [openSubgenreFormModal, setOpenSubgenreFormModal] = useState(false);

  const genresKeys = selectedGenres?.map((g) => g.key);
  const subgenresData = genresKeys
    ? allGenres
        .map(
          (g) =>
            g.subgenres?.filter((e) =>
              genresKeys.includes(e.parent_genre_key),
            ) || [],
        )
        .flat()
    : [];

  const [subgenres, setSubgenres] = useState<GenreFormOut[]>(subgenresData);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    resolver: zodResolver(GenreSchemaList),
    defaultValues: {
      genres: selectedGenres,
      subgenres: selectedSubgenres,
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

  const onSubmit = async (formData: GenreItemFieldEditFormIn) => {
    const res = await updateGenresSubgenres(movieKey, formData);

    if (res.status === 204) {
      toast.success(res.message);
      router.refresh();
      return;
    }
    toast.error(`${res.status}: ${res.message}`);
  };

  const handleSelectGenre = useCallback(
    ({ key, name, subgenres }: GenreOut) => {
      if (!genreFields.find((genrePrev) => genrePrev.key === key)) {
        appendGenre({
          key,
          name,
          percentage_match: 0,
        });

        if (subgenres.length) {
          setSubgenres((prev) => [...prev, ...subgenres]);
        }
      } else {
        removeGenre(
          genreFields.findIndex((genrePrev) => genrePrev.key === key),
        );

        setSubgenres((prev) =>
          prev.filter((subgenrePrev) => subgenrePrev.parent_genre_key !== key),
        );
        const indices = subgenreFields.flatMap((val, index) =>
          val.subgenre_parent_key === key ? index : [],
        );

        if (indices.length) {
          removeSubgenre(indices);
        }
      }
    },
    [appendGenre, genreFields, removeGenre, removeSubgenre, subgenreFields],
  );

  const handleRemoveGenre = useCallback(
    (field: FieldArrayWithId<GenreSchemaListType, "genres">, index: number) => {
      removeGenre(index);

      setSubgenres((prev) =>
        prev.filter(
          (subgenrePrev) => subgenrePrev.parent_genre_key !== field.key,
        ),
      );

      const indices = subgenreFields.flatMap((val, index) =>
        val.subgenre_parent_key === field.key ? index : [],
      );

      if (indices.length) {
        removeSubgenre(indices);
      }
    },
    [removeGenre, removeSubgenre, subgenreFields],
  );

  const handleSubgenreSelect = useCallback(
    ({ key, name, parent_genre_key }: SubgenreOut) => {
      if (!subgenreFields.find((subgenrePrev) => subgenrePrev.key === key)) {
        appendSubgenre({
          key,
          name,
          percentage_match: 0,
          subgenre_parent_key: parent_genre_key,
        });
      } else {
        removeSubgenre(
          subgenreFields.findIndex((subgenrePrev) => subgenrePrev.key === key),
        );
      }
    },
    [appendSubgenre, removeSubgenre, subgenreFields],
  );

  const handleOpenGenreModal = () => {
    setOpenGenreFormModal(true);
  };

  const handleOpenSubgenreModal = () => {
    setOpenSubgenreFormModal(true);
  };

  const selectedGenreskeys = genreFields.map((field) => field.key);
  const selectedSubgenresKeys = subgenreFields.map((field) => field.key);

  return (
    <>
      <FormWrapper
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
      >
        <div
          aria-label="genre-edit-form"
          className="mb-5 flex w-full flex-col items-center gap-6"
        >
          <ResponsiveWrapper title={`${tSelect("menuSelect")} ${t("name")}`}>
            <ItemsSelector
              items={allGenres}
              onOpenModal={handleOpenGenreModal}
              onSelect={handleSelectGenre}
              checkIconStyle={selectedGenreskeys}
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
                removItem={() => handleRemoveGenre(field, index)}
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
          <div className="mb-2 flex items-center justify-center gap-2 font-medium">
            <p className="base-neon-text movie-subgenre-text text-2xl">
              {t("subgenres")}
            </p>
            <TooltipWrapper content={tFilters(`subgenre.description`)}>
              <InfoIcon className="h-4 w-4" />
            </TooltipWrapper>
          </div>

          <ResponsiveWrapper
            title={`${tSelect("menuSelect")} ${t("subgenres")}`}
          >
            <ItemsSelector<SubgenreOut>
              items={subgenres as SubgenreOut[]}
              onOpenModal={handleOpenSubgenreModal}
              onSelect={handleSubgenreSelect}
              checkIconStyle={selectedSubgenresKeys}
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
                <p>{errors.subgenres[index].percentage_match?.message}</p>
              )}
            </div>
          ))}
        </div>
      </FormWrapper>

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
