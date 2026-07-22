import { formatKey } from "@/lib/utils";
import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES } from "./general";
import { MIN_MOVIE_DESCR_LENGTH } from "@/lib/constants";

export const MovieSchema = z
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

export const MovieInfoSchema = z.object({
  description_uk: z
    .string()
    .min(MIN_MOVIE_DESCR_LENGTH, {
      message: `Minimum ${MIN_MOVIE_DESCR_LENGTH} required`,
    })
    .trim(),
  description_en: z
    .string()
    .min(MIN_MOVIE_DESCR_LENGTH, {
      message: `Minimum ${MIN_MOVIE_DESCR_LENGTH} required`,
    })
    .trim(),
  release_date: z.coerce.date().transform((date) => date.toISOString()),
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
    .optional(),
  worldwide_gross: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .optional(),
  location_uk: z.string().min(1, { message: "Value is required" }).trim(),
  location_en: z.string().min(1, { message: "Value is required" }).trim(),
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

export const SharedUniverseFields = z.object({
  shared_universe_key: z
    .string()
    .trim()
    .min(1, { message: "Value is required" }),
  shared_universe_order: z.coerce
    .number()
    .min(1, { message: "Value is required" }),
});

export const QuickMovieSchema = z
  .object({
    key: z.string().trim(),
    title_en: z.string().min(1, { message: "title_en is required" }).trim(),
  })
  .refine((data) => (data.key = formatKey([data.title_en])));

// Export types for the schemas
export type MovieSchemaType = z.infer<typeof MovieSchema>;
export type RelatedMovieType = z.infer<typeof RelatedMovieField>;
export type SharedUniverseType = z.infer<typeof SharedUniverseFields>;
export type QuickMovieType = z.infer<typeof QuickMovieSchema>;

// Edit forms

export const EditMovieDescriptionShema = z.object({
  description_uk: z
    .string()
    .min(MIN_MOVIE_DESCR_LENGTH, {
      message: `Minimum ${MIN_MOVIE_DESCR_LENGTH} required`,
    })
    .trim(),
  description_en: z
    .string()
    .min(MIN_MOVIE_DESCR_LENGTH, {
      message: `Minimum ${MIN_MOVIE_DESCR_LENGTH} required`,
    })
    .trim(),
});

export type EditMovieDescriptionType = z.infer<
  typeof EditMovieDescriptionShema
>;

export const EditMovieBoxOfficeShema = z.object({
  budget: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .min(1, { message: "Value is required" }),
  domestic_gross: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .optional(),
  worldwide_gross: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .optional(),
});

export type EditMovieBoxOfficeType = z.infer<typeof EditMovieBoxOfficeShema>;
