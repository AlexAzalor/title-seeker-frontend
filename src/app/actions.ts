"use server";

import { cookies } from "next/headers";
import { getUsers } from "@/orval_api/users/users";
import { backendURL } from "@/lib/constants";
import {
  BodyAPICreateActor,
  BodyAPICreateGenre,
  BodyAPICreateSubgenre,
  Language,
  MovieIn,
  UserRateMovieIn,
} from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";
import { getActors } from "@/orval_api/actors/actors";
import { getDirectors } from "@/orval_api/directors/directors";
import { getGenres } from "@/orval_api/genres/genres";
import { getSubgenres } from "@/orval_api/subgenres/subgenres";
import { AxiosResponse } from "axios";
import { getLocale } from "next-intl/server";

export async function create(locale: string) {
  const cookieStore = await cookies();

  cookieStore.set("locale", locale);
}

export async function updateRateMovie(data: UserRateMovieIn) {
  const { aPIUpdateRateMovie } = getUsers();

  await aPIUpdateRateMovie("user_uuid", data, backendURL);
}

export async function rateMovie(data: UserRateMovieIn) {
  const { aPIRateMovie } = getUsers();

  await aPIRateMovie("user_uuid", data, backendURL);
}

export async function addNewMovie(data: MovieIn) {
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPICreateMovie } = getMovies();

  try {
    const a: AxiosResponse = await aPICreateMovie(data, { lang }, backendURL);

    return { status: a.status, message: "Movie created" };
  } catch (error: any) {
    return { status: error.status, message: error.response?.data.detail };
  }
}

export async function addNewActor(data: BodyAPICreateActor) {
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPICreateActor } = getActors();

  try {
    const a: AxiosResponse = await aPICreateActor(data, { lang }, backendURL);
    // I do this on Zod project
    return { status: a.status, message: "Actor created", newActor: a.data };
  } catch (error: any) {
    return { status: error.status, message: error.response?.data.detail };
  }
}

export async function addNewDirector(data: BodyAPICreateActor) {
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPICreateDirector } = getDirectors();

  try {
    const a: AxiosResponse = await aPICreateDirector(
      data,
      { lang },
      backendURL,
    );
    // I do this on Zod project
    return {
      status: a.status,
      message: "Director created",
      newDirector: a.data,
    };
  } catch (error: any) {
    return { status: error.status, message: error.response?.data.detail };
  }
}

export async function addNewGenre(data: BodyAPICreateGenre) {
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPICreateGenre } = getGenres();

  try {
    const a: AxiosResponse = await aPICreateGenre(data, { lang }, backendURL);
    // I do this on Zod project
    return {
      status: a.status,
      message: "Genre created",
      newGenre: a.data,
    };
  } catch (error: any) {
    return { status: error.status, message: error.response?.data.detail };
  }
}

export async function addNewSubgenre(data: BodyAPICreateSubgenre) {
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPICreateSubgenre } = getSubgenres();

  try {
    const a: AxiosResponse = await aPICreateSubgenre(
      data,
      { lang },
      backendURL,
    );
    // I do this on Zod project
    return {
      status: a.status,
      message: "Genre created",
      newGenre: a.data,
    };
  } catch (error: any) {
    return { status: error.status, message: error.response?.data.detail };
  }
}
