"use server";

import { cookies } from "next/headers";
import { defaultLocale, Locale } from "./request";

// the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = "NEXT_LOCALE";

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}

export async function getUserLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(COOKIE_NAME)?.value;

  // Migration des anciens cookies "en-us" vers "en"
  if (locale?.toLowerCase() === "en-us") {
    cookieStore.set(COOKIE_NAME, "en");
    return "en";
  }

  return (locale as Locale) || defaultLocale;
}
