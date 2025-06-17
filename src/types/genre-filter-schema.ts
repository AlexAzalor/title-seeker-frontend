import { z } from "zod";
import { BaseFormFields } from "./general";

export const GenreSchemaField = BaseFormFields.extend({
  percentage_match: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .min(1, { message: "Value is required" }),
  subgenre_parent_key: z.string().trim().optional(),
});

export const GenreSchemaList = z.object({
  genres: z
    .array(GenreSchemaField)
    .min(1, { message: "At least one Genre must be selected" }),
  subgenres: z.array(GenreSchemaField),
});

export const TitleFilterField = BaseFormFields.extend({
  percentage_match: z.coerce
    .number({
      invalid_type_error: "Value must be a number",
    })
    .min(1, { message: "Value is required" }),
});

export const TitleFilterList = z.object({
  specifications: z
    .array(TitleFilterField)
    .min(1, { message: "At least one Specification must be selected" }),
  keywords: z
    .array(TitleFilterField)
    .min(1, { message: "At least one Keyword must be selected" }),
  action_times: z
    .array(TitleFilterField)
    .min(1, { message: "At least one Action Time must be selected" }),
});

export const TitleFilterListOnlySpec = TitleFilterList.pick({
  specifications: true,
});

// Export types for the schemas
export type GenreSchemaListType = z.infer<typeof GenreSchemaList>;
export type TitleFilterListType = z.infer<typeof TitleFilterList>;
export type FilterListType = z.infer<typeof TitleFilterListOnlySpec>;
