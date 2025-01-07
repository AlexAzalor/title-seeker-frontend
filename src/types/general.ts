import { FieldError, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import {
  ActorScheme,
  GenreScheme,
  MovieScheme,
  SubgenreScheme,
} from "./zod-scheme";
import {
  BodyAPICreateActor,
  BodyAPICreateGenre,
  BodyAPICreateSubgenre,
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

export type MovieFieldNames = keyof Pick<
  QuickMovieFormData,
  "title_en" | "key"
>;

export type TypeMovieScheme = z.infer<typeof MovieScheme>;

export type MovieFormFieldProps = {
  type: HTMLInputTypeAttribute;
  name: MovieFieldNames;
  register: UseFormRegister<TypeMovieScheme>;
  error: FieldError | undefined;
  labelWidth?: number;
  label: string;
  value?: string;
};
