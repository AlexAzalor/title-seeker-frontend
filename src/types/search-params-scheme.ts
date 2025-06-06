import { z } from "zod";
import { SortBy, SortOrder } from "@/orval_api/model";

export const PaginationParamsSchema = z.object({
  name: z.string().optional().default(""),
  page: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  size: z
    .string()
    .transform((val) => Number(val))
    .optional(),
  sort_order: z.nativeEnum(SortOrder).optional(),
  sort_by: z.nativeEnum(SortBy).optional(),
});

const stringOrStringArray = z
  .union([z.string(), z.array(z.string())])
  .transform((val): string[] => (typeof val === "string" ? [val] : val));

export const FilterSchema = z.object({
  genre: stringOrStringArray.optional(),
  subgenre: stringOrStringArray.optional(),
  specification: stringOrStringArray.optional(),
  keyword: stringOrStringArray.optional(),
  action_time: stringOrStringArray.optional(),
  actor: stringOrStringArray.optional(),
  director: stringOrStringArray.optional(),
  shared_universe: stringOrStringArray.optional(),
  visual_profile: stringOrStringArray.optional(),
});
