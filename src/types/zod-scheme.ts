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
