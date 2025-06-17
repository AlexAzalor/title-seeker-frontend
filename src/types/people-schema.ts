import { formatKey } from "@/lib/utils";
import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, BaseFormFields } from "./general";

export const PersonSchema = z
  .object({
    key: z.string().trim(),
    first_name_uk: z
      .string()
      .min(1, { message: "first_name_uk is required" })
      .trim(),
    last_name_uk: z
      .string()
      .min(1, { message: "last_name_uk is required" })
      .trim(),
    first_name_en: z
      .string()
      .min(1, { message: "first_name_en is required" })
      .trim(),
    last_name_en: z
      .string()
      .min(1, { message: "last_name_en is required" })
      .trim(),
    born: z
      .string()
      .date()
      .transform((date) => date.split("-").reverse().join(".")),
    died: z
      .union([
        z
          .string()
          .date()
          .transform((date) => date.split("-").reverse().join(".")),
        z.literal(""),
      ])
      .optional(),
    born_in_uk: z
      .string()
      .min(1, { message: "Address born is required" })
      .trim()
      .min(3, { message: "Address born must be at least 3 characters long" }),
    born_in_en: z
      .string()
      .min(1, { message: "Address born is required" })
      .trim()
      .min(3, { message: "Address born must be at least 3 characters long" }),
    file: z
      .instanceof(FileList)
      .refine(
        (file) => {
          return file[0] instanceof File || file[0] === null;
        },
        { message: "Avatar is required" },
      )
      .refine((file) => {
        return file.length > 0 && ACCEPTED_IMAGE_TYPES.includes(file[0].type);
      }, "Only these types are allowed: .jpg, .jpeg, .png and .webp"),
  })
  .refine(
    (data) => (data.key = formatKey([data.first_name_en, data.last_name_en])),
  );

export const ActorSchemaType = BaseFormFields.extend({
  character_key: z.string().trim().min(1, {
    message: "Character is required",
  }),
});

export const PeopleListSchema = z.object({
  actors: z
    .array(ActorSchemaType)
    .min(1, { message: "At least one Actor must be selected" }),
  directors: z
    .array(BaseFormFields)
    .min(1, { message: "At least one Director must be selected" }),
});

export const CharacterFields = z
  .object({
    key: z.string().trim(),
    name_uk: z.string().trim().min(1, { message: "Value is required" }),
    name_en: z.string().trim().min(1, { message: "Value is required" }),
  })
  .refine((data) => (data.key = formatKey([data.name_en])));

// Export types for the schemas
export type PersonSchemaType = z.infer<typeof PersonSchema>;
export type PeopleListSchemaType = z.infer<typeof PeopleListSchema>;
export type CharacterType = z.infer<typeof CharacterFields>;
