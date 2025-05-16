"use server";

import { auth } from "@/auth";
import { defaultLocale } from "@/i18n/config";
import { Language } from "@/orval_api/model";
import { cookies } from "next/headers";

const COOKIE_NAME = process.env.COOKIE_NAME || "";

export async function getCookie(name: string) {
  return (await cookies()).get(name)?.value;
}

export async function getUserLocale() {
  const cookie = await getCookie(COOKIE_NAME);

  if (!cookie) {
    const session = await auth();

    if (session?.user) {
      return session.user.my_language;
    }
  }

  return cookie || defaultLocale;
}

/**
 * You can't set cookies inside server components. It doesn't matter if you put it inside a server action. The reason is streaming. You either do it inside the middleware or call that action from a client component.
 */
export async function setUserLocale(locale: Language) {
  (await cookies()).set(COOKIE_NAME, locale);
}
