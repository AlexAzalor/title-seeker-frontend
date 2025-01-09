import { FieldError, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import {
  ActorScheme,
  GenreScheme,
  MovieScheme,
  QuickMovieScheme,
  SubgenreScheme,
} from "./zod-scheme";
import {
  BodyAPICreateActor,
  BodyAPICreateGenre,
  BodyAPICreateSubgenre,
  MovieFormData,
  QuickMovieFormData,
} from "@/orval_api/model";
import { HTMLInputTypeAttribute } from "react";

export type PageProps = {
  params: Promise<{ slug: string }>;
};

// This use for the direcors too
export type ActorFieldNames = keyof BodyAPICreateActor;

export type TypeActorScheme = z.infer<typeof ActorScheme>;

export type FormFieldProps = {
  type: HTMLInputTypeAttribute;
  name: ActorFieldNames;
  register: UseFormRegister<TypeActorScheme>;
  error: FieldError | undefined;
  labelWidth?: number;
  label: string;
  value?: string;
};

// Genres
export type GenreFieldNames = keyof BodyAPICreateGenre;

export type TypeGenreScheme = z.infer<typeof GenreScheme>;

export type GenreFormFieldProps = {
  type: HTMLInputTypeAttribute;
  name: GenreFieldNames;
  register: UseFormRegister<TypeGenreScheme>;
  error: FieldError | undefined;
  labelWidth?: number;
  label: string;
  value?: string;
};

// Subenres
export type SubgenreFieldNames = keyof BodyAPICreateSubgenre;

export type TypeSubgenreScheme = z.infer<typeof SubgenreScheme>;

export type SubgenreFormFieldProps = {
  type: HTMLInputTypeAttribute;
  name: SubgenreFieldNames;
  register: UseFormRegister<TypeSubgenreScheme>;
  error: FieldError | undefined;
  labelWidth?: number;
  label: string;
  value?: string;
};

//////////// Quick Movie Form Field //////////////

export type QuickMovieFieldNames = keyof Pick<
  QuickMovieFormData,
  "title_en" | "key"
>;

export type QuickMovieType = z.infer<typeof QuickMovieScheme>;

export type QuickMovieFormFieldProps = {
  type: HTMLInputTypeAttribute;
  name: QuickMovieFieldNames;
  register: UseFormRegister<QuickMovieType>;
  error: FieldError | undefined;
  labelWidth?: number;
  label: string;
  value?: string;
};

///// Move
export type MovieFieldNames =
  | keyof Pick<MovieFormData, "key" | "title_en" | "title_uk">
  | "file";

export type MovieSchemeType = z.infer<typeof MovieScheme>;

export type MovieFormFieldProps = {
  type: HTMLInputTypeAttribute;
  name: MovieFieldNames;
  register: UseFormRegister<MovieSchemeType>;
  error: FieldError | undefined;
  labelWidth?: number;
  label: string;
  value?: string;
};
