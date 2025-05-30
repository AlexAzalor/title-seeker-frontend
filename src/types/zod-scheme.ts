import { formatKey } from "@/lib/utils";
import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const PersonScheme = z
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

export type PersonSchemeType = z.infer<typeof PersonScheme>;

export const GenreScheme = z
  .object({
    key: z.string().trim(),
    name_uk: z.string().min(1, { message: "name_uk is required" }).trim(),
    name_en: z.string().min(1, { message: "name_en is required" }).trim(),
    description_uk: z.union([z.string().trim(), z.literal("")]),
    description_en: z.union([z.string().trim(), z.literal("")]),
    parent_genre_key: z.string().trim().optional(),
  })
  .refine((data) => (data.key = formatKey([data.name_en])));

export const QuickMovieScheme = z
  .object({
    key: z.string().trim(),
    title_en: z.string().min(1, { message: "title_en is required" }).trim(),
  })
  .refine((data) => (data.key = formatKey([data.title_en])));

export type QuickMovieType = z.infer<typeof QuickMovieScheme>;

export const MovieScheme = z
  .object({
    key: z.string().trim(),
    title_en: z.string().min(1, { message: "Title EN is required" }).trim(),
    title_uk: z.string().min(1, { message: "Title UK is required" }).trim(),
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

export type MovieSchemeType = z.infer<typeof MovieScheme>;

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

export const ActorSchemeType = z.object({
  name: z.string().trim(),
  key: z.string().trim(),
  character_key: z.string().trim().min(1, {
    message: "Character is required",
  }),
});

export const DirectorSchemeType = z.object({
  name: z.string().trim(),
  key: z.string().trim(),
});

export const MovieCrewListScheme = z.object({
  actors: z
    .array(ActorSchemeType)
    .min(1, { message: "At least one Actor must be selected" }),
  directors: z
    .array(DirectorSchemeType)
    .min(1, { message: "At least one Director must be selected" }),
});

export type MovieCrewListScheme = z.infer<typeof MovieCrewListScheme>;

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
  genres: z
    .array(GenreSchemeField)
    .min(1, { message: "At least one Genre must be selected" }),
  subgenres: z.array(GenreSchemeField),
});

export type GenreSchemeListType = z.infer<typeof GenreSchemeList>;

export const MovieFilterField = z.object({
  key: z.string().trim(),
  name: z.string().trim(),
  percentage_match: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .min(1, { message: "Value is required" }),
});

export const MovieFilterList = z.object({
  specifications: z
    .array(MovieFilterField)
    .min(1, { message: "At least one Specification must be selected" }),
  keywords: z
    .array(MovieFilterField)
    .min(1, { message: "At least one Keyword must be selected" }),
  action_times: z
    .array(MovieFilterField)
    .min(1, { message: "At least one Action Time must be selected" }),
});

export type MovieFilterListType = z.infer<typeof MovieFilterList>;

export const MovieFilterListOnlySpec = MovieFilterList.pick({
  specifications: true,
});
export type FilterListType = z.infer<typeof MovieFilterListOnlySpec>;

export const EnhanceSearchField = z.object({
  name: z.string().trim(),
  percentage_match: z.array(z.number()),
});

export type EnhanceSearchType = z.infer<typeof EnhanceSearchField>;

export const EnhanceSearchScheme = z.object({
  genres: z.array(EnhanceSearchField),
  subgenres: z.array(EnhanceSearchField),
  specifications: z.array(EnhanceSearchField),
  keywords: z.array(EnhanceSearchField),
  action_times: z.array(EnhanceSearchField),
});

export const RelatedMovieField = z.object({
  base_movie_key: z.string().trim().min(1, { message: "Value is required" }),
  collection_order: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .min(1, { message: "Value is required" }),
  relation_type: z.string().min(1, { message: "Value is required" }),
});

export type RelatedMovieType = z.infer<typeof RelatedMovieField>;

export const SharedUniverseFields = z.object({
  shared_universe_key: z
    .string()
    .trim()
    .min(1, { message: "Value is required" }),
  shared_universe_order: z.coerce
    .number()
    .min(1, { message: "Value is required" }),
});

export type SharedUniverseType = z.infer<typeof SharedUniverseFields>;

export const CharacterFields = z
  .object({
    key: z.string().trim(),
    name_uk: z.string().trim().min(1, { message: "Value is required" }),
    name_en: z.string().trim().min(1, { message: "Value is required" }),
  })
  .refine((data) => (data.key = formatKey([data.name_en])));

export type CharacterType = z.infer<typeof CharacterFields>;

export const TitleCriterion = z.object({
  key: z.string().trim().min(1, { message: "Value is required" }),
  rating: z.coerce.number().min(1, { message: "Value is required" }),
  name: z.string().trim(),
  description: z.string().trim(),
});

export const EditTitleVisualProfile = z.object({
  criteria: z.array(TitleCriterion).min(1, {
    message: "At least one criterion is required",
  }),
});

export type EditTitleVisualProfileType = z.infer<typeof EditTitleVisualProfile>;

export const VisualProfileSchema = z.object({
  category_key: z.string().trim().min(1, { message: "Value is required" }),
  category_criteria: z
    .array(TitleCriterion)
    .min(1, { message: "At least one Actor must be selected" }),
});

export type VisualProfileType = z.infer<typeof VisualProfileSchema>;

export const VisualProfileField = z.object({
  key: z.string().trim(),
  uuid: z.string().trim(),
  name_en: z.string().trim().min(1, { message: "Value is required" }),
  name_uk: z.string().trim().min(1, { message: "Value is required" }),
  description_en: z.string().trim().min(1, { message: "Value is required" }),
  description_uk: z.string().trim().min(1, { message: "Value is required" }),
});

export type VisualProfileFieldType = z.infer<typeof VisualProfileField>;

export const VisualProfileUpdateSchema = VisualProfileField.refine(
  (data) => (data.key = formatKey([data.name_en])),
);

export const VisualProfileFieldCreateSchema = VisualProfileField.omit({
  uuid: true,
}).refine((data) => (data.key = formatKey([data.name_en])));

export const VisualProfileCreate = z
  .object({
    key: z.string().trim(),
    name_en: z.string().trim().min(1, { message: "Value is required" }),
    name_uk: z.string().trim().min(1, { message: "Value is required" }),
    description_en: z.string().trim().min(1, { message: "Value is required" }),
    description_uk: z.string().trim().min(1, { message: "Value is required" }),
    criteria: z
      .array(VisualProfileFieldCreateSchema)
      .min(5, {
        message: "At least one criterion is required",
      })
      .max(5, { message: "Should be 5 items" }),
  })
  .refine((data) => (data.key = formatKey([data.name_en])));

export type VisualProfileCreateType = z.infer<typeof VisualProfileCreate>;
