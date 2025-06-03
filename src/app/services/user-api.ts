"use server";

import axios from "axios";
import { fetchSettings, getSession } from "./global-api";
import { backendURL } from "@/lib/constants";

import type { ValidationError } from "@/types/general";
import type {
  Language,
  UserRateMovieIn,
  VisualProfileIn,
} from "@/orval_api/model";
import { getUsers } from "@/orval_api/users/users";
import { getAuth } from "@/orval_api/auth/auth";
import { getVisualProfile } from "@/orval_api/visual-profile/visual-profile";

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
  const { aPIDeleteGoogleProfile } = getAuth();

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

export async function setLanguage(user_uuid: string, lang: Language) {
  const currentUser = await getSession();
  if (!currentUser) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPISetLanguage } = getUsers();

  try {
    const response = await aPISetLanguage(user_uuid, { lang }, backendURL);
    return response.status;
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function updateVisualRating(data: VisualProfileIn) {
  const currentUser = await getSession();
  if (!currentUser) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIUpdateTitleVisualProfile } = getUsers();

  try {
    const response = await aPIUpdateTitleVisualProfile(
      currentUser.uuid,
      data,
      backendURL,
    );
    return response.status;
  } catch (error) {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
      return { status: error.status, message: error.response?.data.detail };
    } else {
      return unknownError;
    }
  }
}

export async function getTitleCategories(lang: Language) {
  const currentUser = await getSession();
  if (!currentUser) {
    return { status: 403, message: "You are not allowed to do this" };
  }

  const { backendURL, unknownError } = await fetchSettings();
  const { aPIGetVisualProfiles } = getVisualProfile();

  try {
    const response = await aPIGetVisualProfiles(
      { lang, user_uuid: currentUser.uuid },
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
