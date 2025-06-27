import { ReadonlyURLSearchParams } from "next/navigation";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

import {
  FilterEnum,
  Language,
  type PageMoviePreviewOutPage,
  type PageMoviePreviewOutPages,
} from "@/orval_api/model";
import type { APISuperSearchMoviesParams } from "@/orval_api/model/aPISuperSearchMoviesParams";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type SuperSearchParams = keyof APISuperSearchMoviesParams;

const PARAM_KEYS: SuperSearchParams[] = [
  "genre",
  "subgenre",
  "actor",
  "director",
  "specification",
  "keyword",
  "action_time",
  FilterEnum.shared_universe,
  "exact_match",
  "visual_profile",
];

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

export function formatDate(
  createdAt: string,
  locale: keyof typeof Language = Language.uk,
) {
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

export const errorHandling = (
  response: { status?: number; message?: string },
  endSubmitting: () => void,
) => {
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

export function formattedDuration(
  duration: number,
  lang: Language = Language.uk,
) {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (lang === Language.en) {
    return `${hours}h ${minutes}m`;
  } else if (lang === Language.uk) {
    return `${hours}г ${minutes}хв`;
  } else {
    throw new Error("Unsupported language");
  }
}

/**
 *
 * @param 10,000
 * @description Cleans the number value by removing commas.
 * @returns 10000
 */
export function cleanNumberValue(value: number | string) {
  return String(value).replace(/,/g, "");
}
/**
 *
@description Synchronizes the URL search parameters with the router and returns a function to refresh the page.
 */
export function syncSearchParameters(
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
 * @description Adds a parameter to the URL, removes it, synchronizes the page with the result, sends it to the first page of pagination.
 * @example
 * ?key=value&key2=value2...
 */
export function manageSearchParameters(
  key: string,
  value: string,
  valueToDelete: string | undefined,
  searchParams: ReadonlyURLSearchParams,
  router: AppRouterInstance,
  deleteParams?: (value: string, urlSearchParams: URLSearchParams) => void,
) {
  const { urlSearchParams, refreshPage } = syncSearchParameters(
    router,
    searchParams,
  );

  if (deleteParams) {
    deleteParams(value, urlSearchParams);
  }

  // Go to the first page
  urlSearchParams.set("page", "1");

  if (!!valueToDelete) {
    urlSearchParams.delete(key, valueToDelete);

    // If there are no more search parameters, remove pagination and sorting
    if (PARAM_KEYS.every((key) => !urlSearchParams.has(key))) {
      urlSearchParams.delete("page");
      urlSearchParams.delete("size");
      urlSearchParams.delete("sort_by");
      urlSearchParams.delete("sort_order");
    }
  } else {
    urlSearchParams.append(key, value);
  }

  refreshPage();
}

// export const cleanString = (str: string) => str.replace(/\(.*?\)/g, "");

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
  const selectedGenres = currentSearchParams.getAll(FilterEnum.genre);
  const selectedSubgenres = currentSearchParams.getAll(FilterEnum.subgenre);
  const selectedSpecifications = currentSearchParams.getAll(
    FilterEnum.specification,
  );
  const selectedKeywords = currentSearchParams.getAll(FilterEnum.keyword);
  const selectedActionTimes = currentSearchParams.getAll(
    FilterEnum.action_time,
  );

  const showForm = () => {
    return (
      selectedGenres.length > 0 ||
      selectedSubgenres.length > 0 ||
      selectedSpecifications.length > 0 ||
      selectedKeywords.length > 0 ||
      selectedActionTimes.length > 0
    );
  };

  const formatData = (params: string[]) => {
    return params.map((param) => ({
      name: extractWord(param),
      percentage_match: extractValues(param),
    }));
  };

  return {
    formatGenreData: formatData(selectedGenres),
    formatSubgenreData: formatData(selectedSubgenres),
    formatSpecificationData: formatData(selectedSpecifications),
    formatKeywordData: formatData(selectedKeywords),
    formatActionTimeData: formatData(selectedActionTimes),
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

export const cutLongWords = (word: string, maxLength: number) => {
  if (word.length > maxLength) {
    return `${word.slice(0, maxLength)}...`;
  }
  return word;
};
