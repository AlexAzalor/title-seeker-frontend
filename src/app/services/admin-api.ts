"use server";

import { auth } from "@/auth";
import axios, { AxiosResponse } from "axios";
import { fetchSettings } from "./global-api";
import type { ValidationError } from "@/types/general";
import {
  UserRole,
  type ActorOut,
  type BodyAPICreateMovie,
  type CharacterFormIn,
  type CharacterOut,
  type DirectorOut,
  type GenreFormIn,
  type GenreFormOut,
  type MovieFilterFormIn,
  type MovieFilterFormOut,
  type PersonForm,
  type QuickMovieFormData,
} from "@/orval_api/model";

import { getMovies } from "@/orval_api/movies/movies";
import { getPeople } from "@/orval_api/people/people";
import { getGenres } from "@/orval_api/genres/genres";
import { getSharedUniverses } from "@/orval_api/shared-universes/shared-universes";
import { getFilters } from "@/orval_api/filters/filters";

/**
 * @description Get the admin or owner user from the session.
 */
export async function getAdmin() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const { user } = session;

  if (user.role !== UserRole.admin && user.role !== UserRole.owner) {
    return null;
  }

  return user;
}

export async function createMovie(
  formData: BodyAPICreateMovie,
  isQuickMovie: boolean = false,
) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateMovie } = getMovies();

  try {
    const response: AxiosResponse = await aPICreateMovie(
      formData,
      { lang, is_quick_movie: isQuickMovie, user_uuid: admin.uuid },
      backendURL,
    );

    return { status: response.status, message: "Movie created" };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function createActor(formData: PersonForm, file: Blob) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateActor } = getPeople();

  try {
    const response: AxiosResponse<ActorOut> = await aPICreateActor(
      { form_data: formData, file },
      { lang, user_uuid: admin.uuid },
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
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateDirector } = getPeople();

  try {
    const response: AxiosResponse<DirectorOut> = await aPICreateDirector(
      { form_data: formData, file },
      { lang, user_uuid: admin.uuid },
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
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateGenre } = getGenres();

  try {
    const response: AxiosResponse<GenreFormOut> = await aPICreateGenre(
      formData,
      { lang, user_uuid: admin.uuid },
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
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateSubgenre } = getGenres();

  try {
    const response: AxiosResponse<GenreFormOut> = await aPICreateSubgenre(
      formData,
      { lang, user_uuid: admin.uuid },
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
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateSpecification } = getFilters();

  try {
    const response: AxiosResponse<MovieFilterFormOut> =
      await aPICreateSpecification(
        formData,
        { lang, user_uuid: admin.uuid },
        backendURL,
      );

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
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateKeyword } = getFilters();

  try {
    const response: AxiosResponse<MovieFilterFormOut> = await aPICreateKeyword(
      formData,
      { lang, user_uuid: admin.uuid },
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
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateActionTime } = getFilters();

  try {
    const response: AxiosResponse<MovieFilterFormOut> =
      await aPICreateActionTime(
        formData,
        { lang, user_uuid: admin.uuid },
        backendURL,
      );

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

export async function createSharedUniverse(formData: GenreFormIn) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateSharedUniverse } = getSharedUniverses();

  try {
    const response: AxiosResponse<GenreFormOut> = await aPICreateSharedUniverse(
      formData,
      { lang, user_uuid: admin.uuid },
      backendURL,
    );

    return {
      status: response.status,
      message: "Universe created",
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

export async function createCharacter(formData: CharacterFormIn) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPICreateCharacter } = getPeople();

  try {
    const result: AxiosResponse<CharacterOut> = await aPICreateCharacter(
      formData,
      { lang, user_uuid: admin.uuid },
      backendURL,
    );

    return {
      status: result.status,
      message: "Character created",
      newItem: result.data,
    };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function quicklyAddNewMovie(data: QuickMovieFormData) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPIQuickAddMovie } = getMovies();

  try {
    const a: AxiosResponse = await aPIQuickAddMovie(
      data,
      { lang, user_uuid: admin.uuid },
      {
        baseURL: backendURL.baseURL,
      },
    );

    return { status: a.status, message: "Movie add to JSON" };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}
