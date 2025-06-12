"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { checkIfAdmin } from "@/middleware";
import axios, { AxiosResponse } from "axios";
import { fetchSettings } from "./global-api";
import type { ValidationError } from "@/types/general";
import {
  FilterList,
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
  FilterFieldsWithUUID,
  FilterEnum,
  GenreFormFieldsWithUUID,
  GenresSubgenresOut,
  GenreItemFieldEditFormIn,
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

  if (!checkIfAdmin(user.role)) {
    return null;
  }

  return user;
}

export async function getAdminOrRedirect() {
  const admin = await getAdmin();

  if (!admin) {
    return redirect("/");
  }

  return admin;
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

export async function getGenresList() {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPIGetGenres } = getGenres();

  try {
    const response: AxiosResponse<FilterList> = await aPIGetGenres(
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
export async function getSubgenresList() {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { lang, backendURL, unknownError } = await fetchSettings();
  const { aPIGetSubgenres } = getGenres();

  try {
    const response: AxiosResponse<FilterList> = await aPIGetSubgenres(
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

export async function getGenreFormFields(itemKey: string, type: FilterEnum) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIGetGenreFormFields } = getGenres();

  try {
    const response: AxiosResponse<FilterFieldsWithUUID> =
      await aPIGetGenreFormFields(
        { user_uuid: admin.uuid, item_key: itemKey, type },
        backendURL,
      );

    return { status: response.status, data: response.data };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function updateGenre(
  formData: GenreFormFieldsWithUUID,
  type: FilterEnum,
) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIUpdateGenreItem } = getGenres();

  try {
    const response = await aPIUpdateGenreItem(
      formData,
      { user_uuid: admin.uuid, type },
      backendURL,
    );

    return {
      status: response.status,
      message: "Genre item updated!",
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

export async function updateFilterItem(
  formData: FilterFieldsWithUUID,
  type: FilterEnum,
) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIUpdateFilterItem } = getFilters();

  try {
    const response = await aPIUpdateFilterItem(
      formData,
      { user_uuid: admin.uuid, type },
      backendURL,
    );

    return {
      status: response.status,

      message: "Specification updated!",
    };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function getFilterFormFields(key: string, type: FilterEnum) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIGetFilterFormFields } = getFilters();

  try {
    const response: AxiosResponse<FilterFieldsWithUUID> =
      await aPIGetFilterFormFields(
        { user_uuid: admin.uuid, item_key: key, type },
        backendURL,
      );

    return { status: response.status, data: response.data };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function getGenresSubgenres(movieKey: string) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIGetGenresSubgenres } = getMovies();

  try {
    const response: AxiosResponse<GenresSubgenresOut> =
      await aPIGetGenresSubgenres(
        { user_uuid: admin.uuid, movie_key: movieKey },
        backendURL,
      );

    return { status: response.status, data: response.data };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function updateGenresSubgenres(
  movieKey: string,
  formData: GenreItemFieldEditFormIn,
) {
  const admin = await getAdmin();

  if (!admin) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIEditGenresSubgenres } = getMovies();

  try {
    await aPIEditGenresSubgenres(
      formData,
      { user_uuid: admin.uuid, movie_key: movieKey },
      backendURL,
    );

    return { status: 204, message: "Genres and subgenres updated" };
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

    return { status: 200, message: "Specifications updated" };
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

    return { status: 200, message: "Keywords updated" };
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

    return { status: 200, message: "Action times updated" };
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}
