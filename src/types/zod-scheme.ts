import { formatKey } from "@/lib/utils";
import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ActorScheme = z
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

export const GenreScheme = z
  .object({
    key: z.string().trim(),
    name_uk: z.string().min(1, { message: "name_uk is required" }).trim(),
    name_en: z.string().min(1, { message: "name_en is required" }).trim(),
    description_uk: z.union([z.string().trim(), z.literal("")]).optional(),
    description_en: z.union([z.string().trim(), z.literal("")]).optional(),
  })
  .refine((data) => (data.key = formatKey([data.name_en])));

export const SubgenreScheme = z
  .object({
    key: z.string().trim(),
    name_uk: z.string().min(1, { message: "name_uk is required" }).trim(),
    name_en: z.string().min(1, { message: "name_en is required" }).trim(),
    description_uk: z.union([z.string().trim(), z.literal("")]).optional(),
    description_en: z.union([z.string().trim(), z.literal("")]).optional(),
    parent_genre_key: z.string().trim(),
  })
  .refine((data) => (data.key = formatKey([data.name_en])));

export const QuickMovieScheme = z
  .object({
    key: z.string().trim(),
    title_en: z.string().min(1, { message: "title_en is required" }).trim(),
  })
  .refine((data) => (data.key = formatKey([data.title_en])));

export const MovieScheme = z
  .object({
    key: z.string().trim(),
    title_en: z.string().min(1, { message: "title_en is required" }).trim(),
    title_uk: z.string().min(1, { message: "title_uk is required" }).trim(),
    file: z
      .instanceof(FileList)
      .refine(
        (file) => {
          return file[0] instanceof File || file[0] === null;
        },
        { message: "Poster is required" },
      )
      .refine((file) => {
        return file.length > 0 && ACCEPTED_IMAGE_TYPES.includes(file[0].type);
      }, "Only these types are allowed: .jpg, .jpeg, .png and .webp"),
  })
  .refine((data) => (data.key = formatKey([data.title_en])));

export const MovieInfoScheme = z.object({
  description_uk: z.string().min(10, { message: "Value is required" }).trim(),
  description_en: z.string().min(10, { message: "Value is required" }).trim(),
  // date: z.string().date().transform((date) => date.split("-").reverse().join(".")),
  release_date: z.coerce.date().transform((date) => date.toISOString()),
  // release_date: z.string().transform((str) => new Date(str).toISOString()),
  // .transform((date) => date.split("-").reverse().join(".")),
  duration: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .min(1, { message: "Value is required" }),
  budget: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .min(1, { message: "Value is required" }),
  domestic_gross: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .min(1, { message: "Value is required" }),
  worldwide_gross: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .min(1, { message: "Value is required" }),
  location_uk: z.string().min(1, { message: "Value is required" }).trim(),
  location_en: z.string().min(1, { message: "Value is required" }).trim(),
});

export const ActorSchemeType = z
  .object({
    actor_name: z.string().trim(),
    character_key: z.string().trim(),
    character_name_en: z
      .string()
      .min(1, { message: "character_name_en is required" })
      .trim(),
    character_name_uk: z
      .string()
      .min(1, { message: "character_name_uk is required" })
      .trim(),
    key: z.string().trim(),
  })
  .refine((data) => (data.character_key = formatKey([data.character_name_en])));

export const DirectorSchemeType = z.object({
  full_name: z.string().trim(),
  key: z.string().trim(),
});

export const ActorsListScheme = z.object({
  actors: z
    .array(ActorSchemeType)
    .min(1, { message: "At least one Actor must be selected" }),
  directors: z
    .array(DirectorSchemeType)
    .min(1, { message: "At least one Director must be selected" }),
});

export const GenreSchemeField = z.object({
  name: z.string().trim(),
  key: z.string().trim(),
  percentage_match: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .min(1, { message: "Value is required" }),
  subgenre_parent_key: z.string().trim().optional(),
});

export const GenreSchemeList = z.object({
  genres: z.array(GenreSchemeField).min(1),
  subgenres: z.array(GenreSchemeField),
});

export const MovieFeatureField = z.object({
  key: z.string().trim(),
  name: z.string().trim(),
  percentage_match: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .min(1, { message: "Value is required" }),
});

export const MovieFeatureList = z.object({
  specifications: z.array(MovieFeatureField).min(1),
  keywords: z.array(MovieFeatureField).min(1),
  action_times: z.array(MovieFeatureField).min(1),
});
