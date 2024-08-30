export type Locale = (typeof locales)[number];

export const locales = ["en-us", "fr"] as const;
export const defaultLocale: Locale = "fr";
