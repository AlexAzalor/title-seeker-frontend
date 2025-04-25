"use server";

import { cache } from "react";
import { auth } from "@/auth";
import { getLocale } from "next-intl/server";
import axios, { AxiosResponse } from "axios";

import { backendURL, HTTP_STATUS } from "@/lib/constants";
import { ValidationError } from "@/types/general";
import { Language, MovieSearchResult, TitleType } from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";

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

export async function searchTitles(query: string, titleType: TitleType) {
  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPISearch } = getMovies();

  try {
    const result: AxiosResponse<MovieSearchResult> = await aPISearch(
      { lang, query, title_type: titleType },
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
