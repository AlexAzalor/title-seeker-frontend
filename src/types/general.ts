import { FieldError, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { ActorScheme } from "./zod-scheme";
import { BodyAPICreateActor } from "@/orval_api/model";
import { HTMLInputTypeAttribute } from "react";

export type PageProps = {
  params: Promise<{ slug: string }>;
};

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
