import { z } from "zod";
import { formatKey } from "@/lib/utils";

export type PageProps = {
  params: Promise<{ slug: string }>;
};

export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export type ValidationError = {
  errors: Record<string, string[]>;
  detail: string;
};

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/**This fields are required for items menu list */
export const BaseFormFields = z.object({
  name: z.string().trim(),
  key: z.string().trim(),
});

export const EntityFormSchema = z
  .object({
    key: z.string().trim(),
    name_uk: z.string().min(1, { message: "Name uk is required" }).trim(),
    name_en: z.string().min(1, { message: "Name en is required" }).trim(),
    description_uk: z.union([z.string().trim(), z.literal("")]),
    description_en: z.union([z.string().trim(), z.literal("")]),
    parent_genre_key: z
      .string({ message: "Choose a parent genre" })
      .trim()
      .optional(),
  })
  .refine((data) => (data.key = formatKey([data.name_en])));

export type EntityFormType = z.infer<typeof EntityFormSchema>;
