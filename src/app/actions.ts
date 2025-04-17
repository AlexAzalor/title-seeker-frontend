"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { getLocale } from "next-intl/server";
import axios, { AxiosResponse } from "axios";

import { backendURL, HTTP_STATUS } from "@/lib/constants";
import {
  ActorOut,
  BodyAPICreateCharacter,
  BodyAPICreateGenre,
  BodyAPICreateMovie,
  CharacterOut,
  DirectorOut,
  GenreFormIn,
  GenreFormOut,
  Language,
  MovieFilterFormIn,
  MovieFilterFormOut,
  PersonForm,
  QuickMovieFormData,
  SharedUniversePreCreateOut,
  TitleType,
  UserRateMovieIn,
} from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";
import { getActors } from "@/orval_api/actors/actors";
import { getDirectors } from "@/orval_api/directors/directors";
import { getGenres } from "@/orval_api/genres/genres";
import { getSubgenres } from "@/orval_api/subgenres/subgenres";
import { getSpecifications } from "@/orval_api/specifications/specifications";
import { getKeywords } from "@/orval_api/keywords/keywords";
import { getActionTimes } from "@/orval_api/action-times/action-times";
import { getSharedUniverses } from "@/orval_api/shared-universes/shared-universes";
import { getCharacters } from "@/orval_api/characters/characters";
import { getUsers } from "@/orval_api/users/users";
import { ValidationError } from "@/types/general";

export async function create(locale: string) {
  const cookieStore = await cookies();

  cookieStore.set("locale", locale);
}

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

export async function updateRateMovie(data: UserRateMovieIn) {
  const currentUser = await getSession();
  if (!currentUser) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { aPIUpdateRateMovie } = getUsers();

  await aPIUpdateRateMovie(currentUser.uuid, data, backendURL);
}

export async function rateMovie(data: UserRateMovieIn) {
  const currentUser = await getSession();
  if (!currentUser) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { aPIRateMovie } = getUsers();

  await aPIRateMovie(currentUser.uuid, data, backendURL);
}

export async function addNewMovie(
  // data: APICreateMovieParams,
  act: BodyAPICreateMovie,
  tempMovie: boolean = false,
) {
  const user = await getSession();
  if (!user) {
    return { status: 403, message: "You are not allowed to do this" };
  }
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPICreateMovie } = getMovies();

  try {
    const a: AxiosResponse = await aPICreateMovie(
      act,
      { lang, temp_movie: tempMovie, user_uuid: user.uuid },
      {
        baseURL: backendURL.baseURL,
      },
    );

    return { status: a.status, message: "Movie created" };
  } catch (error: any) {
    return { status: error.status, message: error.response?.data.detail };
  }
}

export async function createActor(formData: PersonForm, file: Blob) {
  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateActor } = getActors();

  try {
    const response: AxiosResponse<ActorOut> = await aPICreateActor(
      { form_data: formData, file },
      { lang },
      backendURL,
    );

    return {
      status: response.status,
      newItem: response.data,
      message: "Actor created",
    };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function createDirector(formData: PersonForm, file: Blob) {
  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateDirector } = getDirectors();

  try {
    const response: AxiosResponse<DirectorOut> = await aPICreateDirector(
      { form_data: formData, file },
      { lang },
      backendURL,
    );

    return {
      status: response.status,
      message: "Director created",
      newItem: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function createGenre(formData: GenreFormIn) {
  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateGenre } = getGenres();

  try {
    const response: AxiosResponse<GenreFormOut> = await aPICreateGenre(
      formData,
      { lang },
      backendURL,
    );

    return {
      status: response.status,
      message: "Genre created",
      newItem: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function createSubgenre(formData: GenreFormIn) {
  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateSubgenre } = getSubgenres();

  try {
    const response: AxiosResponse<GenreFormOut> = await aPICreateSubgenre(
      formData,
      { lang },
      backendURL,
    );

    return {
      status: response.status,
      message: "Subgenre created",
      newItem: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function createSpecification(formData: MovieFilterFormIn) {
  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateSpecification } = getSpecifications();

  try {
    const response: AxiosResponse<MovieFilterFormOut> =
      await aPICreateSpecification(formData, { lang }, backendURL);

    return {
      status: response.status,
      message: "Specification created",
      newItem: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function createKeyword(formData: MovieFilterFormIn) {
  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateKeyword } = getKeywords();

  try {
    const response: AxiosResponse<MovieFilterFormOut> = await aPICreateKeyword(
      formData,
      { lang },
      backendURL,
    );

    return {
      status: response.status,
      message: "Keyword created",
      newItem: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function createActionTime(formData: MovieFilterFormIn) {
  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateActionTime } = getActionTimes();

  try {
    const response: AxiosResponse<MovieFilterFormOut> =
      await aPICreateActionTime(formData, { lang }, backendURL);

    return {
      status: response.status,
      message: "Action Time created",
      newItem: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function addNewUniverse(data: BodyAPICreateGenre) {
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPICreateSharedUniverse } = getSharedUniverses();

  try {
    const a: AxiosResponse = await aPICreateSharedUniverse(
      data,
      { lang },
      backendURL,
    );
    // I do this on Zod project
    return {
      status: a.status,
      message: "Keyword created",
      newItem: a.data as SharedUniversePreCreateOut,
    };
  } catch (error: any) {
    return { status: error.status, message: error.response?.data.detail };
  }
}

export async function addNewCharacter(data: BodyAPICreateCharacter) {
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPICreateCharacter } = getCharacters();

  try {
    const result: AxiosResponse = await aPICreateCharacter(
      data,
      { lang },
      backendURL,
    );
    // I do this on Zod project
    return {
      status: result.status,
      message: "Character created",
      newItem: result.data as CharacterOut,
    };
  } catch (error: any) {
    return { status: error.status, message: error.response?.data.detail };
  }
}

export async function quicklyAddNewMovie(data: QuickMovieFormData) {
  const currentUser = await getSession();

  if (currentUser?.role !== "owner") {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIQuickAddMovie } = getMovies();

  try {
    const a: AxiosResponse = await aPIQuickAddMovie(
      data,
      { lang, user_uuid: currentUser.uuid },
      {
        baseURL: backendURL.baseURL,
      },
    );

    return { status: a.status, message: "Movie add to JSON" };
  } catch (error: any) {
    return { status: error.status, message: error.response?.data.detail };
  }
}

export async function searchTitles(query: string, titleType: TitleType) {
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPISearch } = getMovies();

  try {
    const result: AxiosResponse = await aPISearch(
      { lang, query, title_type: titleType },
      {
        baseURL: backendURL.baseURL,
      },
    );

    return result.data;
  } catch (error: any) {
    return { status: error.status, message: error.response?.data.detail };
  }
}

export async function deleteProfile(user_uuid: string) {
  const { aPIDeleteGoogleProfile } = getUsers();

  try {
    const response = await aPIDeleteGoogleProfile({ user_uuid }, backendURL);
    return response.status;
  } catch (error: any) {
    return { status: error.status, message: error.response?.data.detail };
  }
}
