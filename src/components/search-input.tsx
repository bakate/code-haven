"use client";

import useClientCheck from "@/hooks/use-client-check";
import { Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import qs from "query-string";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useDebounce } from "react-use";

type Props = {};
export const SearchInput = ({}: Props) => {
  const t = useTranslations("Navigation");
  const isClient = useClientCheck();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams?.get("categoryId");

  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [] = useDebounce(
    () => {
      setDebouncedValue(search);
    },
    400,
    [search]
  );

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname ?? "",
        query: {
          categoryId: currentCategoryId,
          title: !debouncedValue ? null : debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debouncedValue, pathname, currentCategoryId, router]);

  const handleChange = (value: string) => {
    const newValue = value.toLowerCase();
    if (!newValue) {
      setSearch("");
    }
    setSearch(newValue);
  };

  if (!isClient) return null;

  return (
    <Input
      classNames={{
        base: "max-w-full min-w-[11rem] h-10 flex-1",
        mainWrapper: "h-full",
        input: "text-small",
        inputWrapper:
          "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
      }}
      placeholder={t("search_placeholder")}
      size="sm"
      startContent={<LuSearch size={18} />}
      type="search"
      value={search}
      onValueChange={handleChange}
    />
  );
};
