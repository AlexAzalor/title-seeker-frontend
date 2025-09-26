import { formatKey } from "@/lib/utils";
import { z } from "zod";

export const KBCategorySchema = z
  .object({
    key: z.string().trim(),
    name: z.string().min(1, { message: "Name is required" }).trim(),
    description: z.union([z.string().trim(), z.literal("")]),
  })
  .refine((data) => (data.key = formatKey([data.name])));

export type KBCategoryType = z.infer<typeof KBCategorySchema>;

export const KBTechnologySchema = z
  .object({
    key: z.string().trim(),
    name: z.string().min(1, { message: "Name is required" }).trim(),
    description: z.union([z.string().trim(), z.literal("")]),
    category_key: z.string().min(1, { message: "Category key is required" }),
  })
  .refine((data) => (data.key = formatKey([data.name])));

export type KBTechnologyType = z.infer<typeof KBTechnologySchema>;

export const KBQuestionSchema = z.object({
  question: z.string().min(1, { message: "Name is required" }).trim(),
  technology_key: z.string().min(1, { message: "Technology key is required" }),
});

export type KBQuestionType = z.infer<typeof KBQuestionSchema>;
