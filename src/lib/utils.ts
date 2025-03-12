import { clsx, type ClassValue } from "clsx";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

type IntlOptions = Intl.DateTimeFormatOptions;

export type SearchValue = {
  name: string;
  percentage_match: number[];
};

export type SearchFormValue = {
  genres: SearchValue[];
  subgenres: SearchValue[];
  specifications: SearchValue[];
  keywords: SearchValue[];
  action_times: SearchValue[];
};

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

export function cleanNumberValue(value: number) {
  return String(value).replace(/,/g, "");
}

export function handleSearchParams(
  router: AppRouterInstance,
  searchParams?: ReadonlyURLSearchParams,
) {
  const updatedSearchParams = new URLSearchParams(
    searchParams ? searchParams.toString() : undefined,
  );

  function refreshPage() {
    window.history.pushState(null, "", "?" + updatedSearchParams.toString());

    // To refresh the page with the new search parameters
    router.replace("/super-search" + "?" + updatedSearchParams.toString(), {
      scroll: false,
    });
  }

  return { updatedSearchParams, refreshPage };
}

/**
 * ?key=value&key2=value2...
 */
export function modifyGenresSearchParams(
  key: string,
  value: string,
  valueToDelete: string | undefined,
  searchParams: ReadonlyURLSearchParams,
  router: AppRouterInstance,
  callback?: (value: string, updatedSearchParams: URLSearchParams) => void,
) {
  const { updatedSearchParams, refreshPage } = handleSearchParams(
    router,
    searchParams,
  );

  if (callback) {
    callback(value, updatedSearchParams);
  }

  if (!!valueToDelete) {
    updatedSearchParams.delete(key, valueToDelete);
  } else {
    updatedSearchParams.append(key, value);
  }

  refreshPage();
}
