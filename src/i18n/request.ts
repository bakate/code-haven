import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./config";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export default getRequestConfig(async () => {
  const locale: Locale = await getUserLocale();
  console.log(locale);

  return {
    locale,
    messages: (await import(`../../dictionaries/${locale}.json`)).default,
    formats: {
      dateTime: {
        short: {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      },
    },
  };
});
