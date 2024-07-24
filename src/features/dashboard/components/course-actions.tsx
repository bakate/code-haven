"use client";

import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";

type ActionsProps = {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
};
export const CourseActions = ({
  courseId,
  disabled,
  isPublished,
}: ActionsProps) => {
  const t = useTranslations("courseById");
  const handlePress = () => {
    console.log("handlePress", courseId);
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onPress={handlePress}
        disabled={disabled}
        size="sm"
        color={isPublished ? "warning" : "primary"}
      >
        {isPublished ? t("unpublish") : t("publish")}
      </Button>
    </div>
  );
};
