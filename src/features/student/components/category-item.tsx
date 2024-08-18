"use client";

import { Chip } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { IconType } from "react-icons/lib";

type Props = {
  label: string;
  icon: IconType;
  value?: string;
};
export const CategoryItem = ({ label, icon: Icon, value }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");
  const isActive = currentCategoryId === value;

  const handleClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId ? null : value,
          title: currentTitle,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  };

  return (
    <Chip
      startContent={<Icon />}
      variant="flat"
      color={isActive ? "primary" : "default"}
      className="truncate hover:cursor-pointer"
      onClick={handleClick}
    >
      {label}
    </Chip>
  );
};
