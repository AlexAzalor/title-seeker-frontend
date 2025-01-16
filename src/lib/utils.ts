import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
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

export function convertToSlug(text: string) {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/'/g, "") // Remove apostrophes
    .replace(/[^a-z0-9]+/g, "-") // Replace other non-alphanumeric characters with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

export function convertToISOString(dateString: string) {
  // Split the date string into day, month, and year
  const [day, month, year] = dateString.split(".").map(Number);

  // Create a new Date object (month is 0-based, so subtract 1)
  const date = new Date(year, month - 1, day);

  // Convert the Date object to an ISO string
  return date.toISOString();
}

export function formatKey(names: string[]) {
  return convertToSlug(names.join(" "));
}

export const errorHandling = (response: any, endSubmitting: () => void) => {
  if (response.status === 201) {
    toast.success(response?.message);
    localStorage.removeItem("new-movie-data");
  }

  if (response.status === 400) {
    toast.error(response?.message);
    endSubmitting();

    throw new Error(response?.message);
  }

  if (response.status === 409) {
    toast.error(response?.message);
    endSubmitting();

    throw new Error(response?.message);
  }

  if (response.status === 422) {
    toast.error("Validation error");
    endSubmitting();

    throw new Error("Validation error");
  }
};

export function formattedDuration(duration: number, lang = "uk") {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (lang === "en") {
    return `${hours}h ${minutes}m`;
  } else if (lang === "uk") {
    return `${hours}г ${minutes}хв`;
  } else {
    throw new Error("Unsupported language");
  }
}
