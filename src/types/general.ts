import { FieldError, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { ActorScheme, GenreScheme } from "./zod-scheme";
import { BodyAPICreateActor, BodyAPICreateGenre } from "@/orval_api/model";
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
