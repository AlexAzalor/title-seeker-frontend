import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type IntlOptions = Intl.DateTimeFormatOptions;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(createdAt: string, locale: string) {
  const date = new Date(createdAt);

  const options: IntlOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);

  return formattedDate;
}
