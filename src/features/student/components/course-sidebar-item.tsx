"use client";

import { Button } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { LuCheckCircle, LuLock, LuPlayCircle } from "react-icons/lu";

type Props = {
  id: string;
  label: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
};
export const CourseSidebarItem = ({
  courseId,
  id,
  isCompleted,
  isLocked,
  label,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? LuLock : isCompleted ? LuCheckCircle : LuPlayCircle;
  const isActive = pathname.includes(id);

  const onPress = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };
  return (
    <Button
      variant="light"
      radius="none"
      className={`
        w-full justify-start
        ${isActive ? "border-r-primary-500 border-r-3" : ""}
      `}
      color={isActive ? "primary" : "default"}
      startContent={<Icon />}
      onPress={onPress}
    >
      {label}
    </Button>
  );
};
