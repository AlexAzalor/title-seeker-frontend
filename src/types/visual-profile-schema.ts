import { formatKey } from "@/lib/utils";
import { z } from "zod";

export const CategoryCriterion = z.object({
  key: z.string().trim().min(1, { message: "Value is required" }),
  rating: z.coerce.number().min(1, { message: "Value is required" }),
  name: z.string().trim(),
  description: z.string().trim(),
});

export const VisualProfileSchema = z.object({
  category_key: z.string().trim().min(1, { message: "Value is required" }),
  category_criteria: z
    .array(CategoryCriterion)
    .min(1, { message: "Visual Profile is required" }),
});

export const VisualProfileField = z.object({
  key: z.string().trim(),
  uuid: z.string().trim(),
  name_en: z.string().trim().min(1, { message: "Value is required" }),
  name_uk: z.string().trim().min(1, { message: "Value is required" }),
  description_en: z.string().trim().min(1, { message: "Value is required" }),
  description_uk: z.string().trim().min(1, { message: "Value is required" }),
});

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

// Export types for the schemas
export type VisualProfileType = z.infer<typeof VisualProfileSchema>;
export type VisualProfileFieldType = z.infer<typeof VisualProfileField>;
export type VisualProfileCreateType = z.infer<typeof VisualProfileCreate>;
