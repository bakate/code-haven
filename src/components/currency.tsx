"use client";

import useClientCheck from "@/hooks/use-client-check";
import { Locale, locales } from "@/i18n/request";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

const formatter = (locale: Locale) => {
  const selectedLocale = locales.includes(locale) ? "fr-FR" : "en-US";
  return new Intl.NumberFormat(selectedLocale, {
    style: "currency",
    currency: "eur",
  });
};

type CurrencyProps = {
  value: number;
  className?: string;
};

export const Currency = ({ value, className }: CurrencyProps) => {
  const isClient = useClientCheck();
  const locale = useLocale() as Locale;

  if (!isClient) {
    return null;
  }
  return (
    <span
      className={cn(
        "text-md md:text-sm font-medium text-slate-700 dark:text-slate-100",
        className
      )}
    >
      {formatter(locale).format(value)}
    </span>
  );
};
