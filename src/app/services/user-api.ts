"use server";

import axios from "axios";
import { fetchSettings, getSession } from "./global-api";
import { backendURL } from "@/lib/constants";

import type { ValidationError } from "@/types/general";
import type { UserRateMovieIn } from "@/orval_api/model";
import { getUsers } from "@/orval_api/users/users";

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

export async function deleteProfile(user_uuid: string) {
  const currentUser = await getSession();
  if (!currentUser) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIDeleteGoogleProfile } = getUsers();

  try {
    const response = await aPIDeleteGoogleProfile({ user_uuid }, backendURL);
    return response.status;
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}
