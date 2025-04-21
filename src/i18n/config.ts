import { Language } from "@/orval_api/model";

export const locales = [Language.uk, Language.en] as const;
export const defaultLocale: Language = Language.uk;
