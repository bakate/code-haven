import { Locale } from "@/i18n/request";
import { cn } from "@/lib/utils";
import { setUserLocale } from "@/services/locale";
import { Avatar, Select, SelectItem } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent, useState, useTransition } from "react";
import { LuGlobe } from "react-icons/lu";

type Props = {
  className?: string;
};
export const LocalSwitcherSelect = ({ className }: Props) => {
  const locale = useLocale();

  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState<string>(locale);
  const t = useTranslations("LocaleSwitcher");
  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const locale = event.target.value;
    setValue(locale);
    startTransition(async () => {
      await setUserLocale(locale as Locale);
    });
  };

  const renderSelectItem = (key: Locale, alt: string, src: string) => (
    <SelectItem
      key={key}
      color="primary"
      variant="flat"
      startContent={<Avatar alt={alt} className="w-6 h-6" src={src} />}
    >
      {t(key)}
    </SelectItem>
  );

  return (
    <Select
      className={cn("hidden md:max-w-40 md:block", className)}
      color="primary"
      variant="flat"
      selectedKeys={[value]}
      onChange={onChange}
      disabled={isPending}
      aria-label={t("label")}
      startContent={<LuGlobe />}
    >
      {renderSelectItem("en", "United States", "https://flagcdn.com/us.svg")}
      {renderSelectItem("fr", "France", "https://flagcdn.com/fr.svg")}
    </Select>
  );
};
