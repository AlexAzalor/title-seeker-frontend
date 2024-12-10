"use server";

import { cookies } from "next/headers";
import { getUsers } from "@/orval_api/users/users";
import { backendURL } from "@/lib/constants";
import { UserRateMovieIn } from "@/orval_api/model";
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
