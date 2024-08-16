"use client";
import { useTranslations } from "next-intl";
import { LocalSwitcherSelect } from "./local-switcher-select";

export const Footer = () => {
  const t = useTranslations("footer");
  return (
    <div className="flex items-center justify-between w-full h-20 bg-white border-t border-gray-200 shadow-md dark:bg-slate-900 dark:border-t-slate-700 p-4">
        <div className="text-gray-500 flex justify-center flex-1 w-full md:pl-44">
          {t("copyright")}
        </div>

        <LocalSwitcherSelect />
      </div>
  );
};
