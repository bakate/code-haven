export type Locale = (typeof locales)[number];

export const locales = ["en-us", "de", "fr", "it", "es"] as const;
export const defaultLocale: Locale = "fr";
