"use client";

import { Button } from "@heroui/react";
import { useMedia } from "react-use";

import { ImCancelCircle } from "react-icons/im";
import { LuPencil } from "react-icons/lu";
type Props = {
  isEditing: boolean;
  toggleEditing: () => void;
  isPending: boolean;
  editingContent: string;
  readonlyContent: string;
};
export const ToggleButton = ({
  isEditing,
  toggleEditing,
  editingContent,
  isPending,
  readonlyContent,
}: Props) => {
  const isTablet = useMedia("(min-width: 640px)", false);
  return (
    <Button
      variant="ghost"
      color="primary"
      disabled={isPending}
      onPress={toggleEditing}
      isIconOnly={!isTablet}
      startContent={!isEditing ? <LuPencil /> : <ImCancelCircle />}
    >
      {!isTablet ? "" : isEditing ? editingContent : readonlyContent}
    </Button>
  );
};
