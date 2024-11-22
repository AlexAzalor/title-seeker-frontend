import { Language } from "@/orval_api/model";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLanguage(locale: string) {
  return locale === "uk" ? Language.ua : Language.en;
}
