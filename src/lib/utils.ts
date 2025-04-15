import { ACTION_TIME, KEYWORD, SPEC } from "@/components/filter-fetch-wrapper";
import { GENRE, SUBGENRE } from "@/components/genres";
import {
  Language,
  PageMoviePreviewOutPage,
  PageMoviePreviewOutPages,
} from "@/orval_api/model";

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

export function formatDate(createdAt: string, locale: keyof typeof Language) {
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
    // localStorage.removeItem("new-movie-data");
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
  const urlSearchParams = new URLSearchParams(
    searchParams ? searchParams.toString() : undefined,
  );

  function refreshPage() {
    // Creates a history to go back to previous search parameters
    window.history.pushState(null, "", "?" + urlSearchParams.toString());

    // To refresh the page with the new search parameters
    router.replace("/super-search" + "?" + urlSearchParams.toString(), {
      scroll: false,
    });
  }

  return { urlSearchParams, refreshPage };
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
  callback?: (value: string, urlSearchParams: URLSearchParams) => void,
) {
  const { urlSearchParams, refreshPage } = handleSearchParams(
    router,
    searchParams,
  );

  if (callback) {
    callback(value, urlSearchParams);
  }

  if (!!valueToDelete) {
    urlSearchParams.delete(key, valueToDelete);
  } else {
    urlSearchParams.append(key, value);
  }

  refreshPage();
}

export const cleanString = (str: string) => str.replace(/\(.*?\)/g, "");

export const DEFAULT_RANGE = [10, 100];
export const extractValues = (str: string): number[] => {
  const match = str.match(/\((.*?)\)/);

  if (match) {
    return match[1].split(",").map(Number);
  }

  return DEFAULT_RANGE;
};

export const extractWord = (str: string): string => {
  const match = str.match(/^[^\(]+/);
  return match ? match[0].trim() : "";
};

export const formatSearchParams = (
  currentSearchParams: ReadonlyURLSearchParams,
) => {
  const currentSelectedGenres = currentSearchParams.getAll(GENRE);
  const currentSelectedSubgenres = currentSearchParams.getAll(SUBGENRE);
  const currentSelectedSpecifications = currentSearchParams.getAll(SPEC);
  const currentSelectedKeywords = currentSearchParams.getAll(KEYWORD);
  const currentSelectedActionTimes = currentSearchParams.getAll(ACTION_TIME);

  const showForm = () => {
    return (
      currentSelectedGenres.length > 0 ||
      currentSelectedSubgenres.length > 0 ||
      currentSelectedSpecifications.length > 0 ||
      currentSelectedKeywords.length > 0 ||
      currentSelectedActionTimes.length > 0
    );
  };

  const formatData = (params: string[]) => {
    return params.map((param) => ({
      name: extractWord(param),
      percentage_match: extractValues(param),
    }));
  };

  return {
    formatGenreData: formatData(currentSelectedGenres),
    formatSubgenreData: formatData(currentSelectedSubgenres),
    formatSpecificationData: formatData(currentSelectedSpecifications),
    formatKeywordData: formatData(currentSelectedKeywords),
    formatActionTimeData: formatData(currentSelectedActionTimes),
    showForm: showForm(),
  };
};

export function getVisiblePages(
  currentPage: PageMoviePreviewOutPage,
  totalPages: PageMoviePreviewOutPages,
) {
  const THREE_DOTS = "...";
  const pages = [];

  if (!currentPage || !totalPages) {
    return [];
  }

  if (totalPages <= 5) {
    // If there are 5 or fewer pages, show all
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      // Case for pages close to the start
      pages.push(1, 2, 3, 4, THREE_DOTS, totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Case for pages close to the end
      pages.push(
        1,
        THREE_DOTS,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      // Case for pages in the middle
      pages.push(
        1,
        THREE_DOTS,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        THREE_DOTS,
        totalPages,
      );
    }
  }

  return pages;
}
