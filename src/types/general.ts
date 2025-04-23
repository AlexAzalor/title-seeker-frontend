import { z } from "zod";
import { GenreScheme } from "./zod-scheme";

export type PageProps = {
  params: Promise<{ slug: string }>;
};

export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export type TypeGenreScheme = z.infer<typeof GenreScheme>;

export type ValidationError = {
  errors: Record<string, string[]>;
  detail: string;
};
