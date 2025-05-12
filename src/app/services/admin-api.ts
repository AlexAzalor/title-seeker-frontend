"use server";

import { auth } from "@/auth";
import axios, { AxiosResponse } from "axios";
import { fetchSettings } from "./global-api";
import type { ValidationError } from "@/types/general";
import {
  FilterList,
  UserRole,
  type ActorOut,
  type BodyAPICreateMovie,
  type CharacterFormIn,
  type CharacterOut,
  type DirectorOut,
  type GenreFormIn,
  type GenreFormOut,
  type MovieFilterFormIn,
  type FilterItemOut,
  type PersonForm,
  type QuickMovieFormData,
  FilterItemField,
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
    const response: AxiosResponse<FilterItemOut> = await aPICreateSpecification(
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
    const response: AxiosResponse<FilterItemOut> = await aPICreateKeyword(
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
    const response: AxiosResponse<FilterItemOut> = await aPICreateActionTime(
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

export async function getSpecifications() {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPIGetSpecifications } = getFilters();

  try {
    const response: AxiosResponse<FilterList> = await aPIGetSpecifications(
      { lang, user_uuid: admin.uuid },
      backendURL,
    );

    return response.data.items;
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function getKeywords() {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPIGetKeywords } = getFilters();

  try {
    const response: AxiosResponse<FilterList> = await aPIGetKeywords(
      { lang, user_uuid: admin.uuid },
      backendURL,
    );

    return response.data.items;
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function getActionTimes() {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPIGetActionTimes } = getFilters();

  try {
    const response: AxiosResponse<FilterList> = await aPIGetActionTimes(
      { lang, user_uuid: admin.uuid },
      backendURL,
    );

    return response.data.items;
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function editMovieSpecifications(
  movieKey: string,
  items: FilterItemField[],
) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIEditSpecifications } = getMovies();

  try {
    await aPIEditSpecifications(
      {
        items,
        movie_key: movieKey,
      },
      { user_uuid: admin.uuid },
      backendURL,
    );
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function editMovieKeywords(
  movieKey: string,
  items: FilterItemField[],
) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIEditKeywords } = getMovies();

  try {
    await aPIEditKeywords(
      {
        items,
        movie_key: movieKey,
      },
      { user_uuid: admin.uuid },
      backendURL,
    );
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}
export async function editMovieActionTimes(
  movieKey: string,
  items: FilterItemField[],
) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIEditActionTimes } = getMovies();

  try {
    await aPIEditActionTimes(
      {
        items,
        movie_key: movieKey,
      },
      { user_uuid: admin.uuid },
      backendURL,
    );
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}
