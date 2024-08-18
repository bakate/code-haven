import { Locale } from "@/i18n-config";
import { setUserLocale } from "@/services/locale";
import { Avatar, Select, SelectItem } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent, useState, useTransition } from "react";

export const LocalSwitcherSelect = () => {
  const locale = useLocale();

  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState<string>(locale);
  const t = useTranslations("LocaleSwitcher");
  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const locale = event.target.value as Locale;
    setValue(locale);
    startTransition(() => {
      setUserLocale(locale);
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
      className="hidden md:max-w-52 md:block pl-2"
      label={t("label")}
      color="primary"
      variant="flat"
      selectedKeys={[value]}
      onChange={onChange}
      disabled={isPending}
    >
      {renderSelectItem("en-us", "United States", "https://flagcdn.com/us.svg")}
      {renderSelectItem("de", "Germany", "https://flagcdn.com/de.svg")}
      {renderSelectItem("es", "Spain", "https://flagcdn.com/es.svg")}
      {renderSelectItem("fr", "France", "https://flagcdn.com/fr.svg")}
      {renderSelectItem("it", "Italy", "https://flagcdn.com/it.svg")}
    </Select>
  );
};
