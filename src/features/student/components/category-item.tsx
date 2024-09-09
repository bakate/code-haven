"use client";

import { Chip } from "@nextui-org/react";
import { IconType } from "react-icons/lib";

type Props = {
  label: string;
  icon: IconType;
  value?: string;
  isActive: boolean;
  onClick: (id: string) => void;
};
export const CategoryItem = ({
  label,
  icon: Icon,
  value,
  isActive,
  onClick,
}: Props) => {
  return (
    <Chip
      startContent={<Icon />}
      variant="flat"
      color={isActive ? "primary" : "default"}
      className="truncate hover:cursor-pointer"
      onClick={() => {
        if (value) {
          onClick(value);
        }
      }}
    >
      {label}
    </Chip>
  );
};
