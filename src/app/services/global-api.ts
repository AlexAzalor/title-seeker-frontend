"use server";

import { cache } from "react";
import { auth } from "@/auth";
import { getLocale } from "next-intl/server";
import axios, { AxiosResponse } from "axios";

import { backendURL, HTTP_STATUS } from "@/lib/constants";
import { ValidationError } from "@/types/general";
import { Language, SearchResults, SearchType } from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";
import { getPeople } from "@/orval_api/people/people";

export const fetchSettings = cache(async () => {
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const unknownError = {
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: "Internal server error",
  };

  return { lang, backendURL, unknownError };
});

export async function getSession() {
  const session = await auth();
  if (!session) {
    return null;
  }

  const { user } = session;
  return user;
}

export async function searchTitles(query: string, searchType: SearchType) {
  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPISearch } = getMovies();

  try {
    const result: AxiosResponse<SearchResults> = await aPISearch(
      { lang, query, title_type: searchType },
      {
        baseURL: backendURL.baseURL,
      },
    );

    return {
      status: result.status,
      data: result.data,
    };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function searchActors(query: string) {
  const { backendURL, unknownError } = await fetchSettings();
  const { aPISearchActors } = getPeople();

  try {
    const result: AxiosResponse<SearchResults> = await aPISearchActors(
      { query },
      {
        baseURL: backendURL.baseURL,
      },
    );

    return {
      status: result.status,
      data: result.data,
    };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function searchDirectors(query: string) {
  const { backendURL, unknownError } = await fetchSettings();
  const { aPISearchDirectors } = getPeople();

  try {
    const result: AxiosResponse<SearchResults> = await aPISearchDirectors(
      { query },
      {
        baseURL: backendURL.baseURL,
      },
    );

    return {
      status: result.status,
      data: result.data,
    };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function searchCharacters(query: string) {
  const { backendURL, unknownError } = await fetchSettings();
  const { aPISearchCharacters } = getPeople();

  try {
    const result: AxiosResponse<SearchResults> = await aPISearchCharacters(
      { query },
      {
        baseURL: backendURL.baseURL,
      },
    );

    return {
      status: result.status,
      data: result.data,
    };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}
