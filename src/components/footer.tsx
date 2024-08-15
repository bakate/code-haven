"use client";
import { useTranslations } from "next-intl";
import { LocalSwitcherSelect } from "./local-switcher-select";

export const Footer = () => {
  const t = useTranslations("footer");
  return (
    <div className="flex flex-col items-center w-full h-16 bg-white border-t border-gray-200 shadow-md dark:bg-slate-900 dark:border-t-slate-700">
      <div className=" flex items-center w-full h-full">
        <p className="text-gray-500 text-center flex-grow md:pl-44">
          {t("copyright")}
        </p>

        <LocalSwitcherSelect />
      </div>
    </div>
  );
};
