"use client";

import { cn } from "@/lib/utils";
import { Button, Skeleton } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { LuCheckCircle, LuLock, LuPlayCircle } from "react-icons/lu";

type Props = {
  id: string;
  label: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
  duration: string;
};
export const CourseSidebarItem = ({
  courseId,
  id,
  isCompleted,
  isLocked,
  label,
  duration,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? LuLock : isCompleted ? LuCheckCircle : LuPlayCircle;
  const isActive = pathname?.includes(id);

  const onPress = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };
  return (
    <Button
      variant="light"
      radius="none"
      className={cn(
        `
        w-full justify-start mb-2
      `,
        isActive ? "border-r-3 border-r-primary-500 text-primary-500" : "",
        isCompleted ? "text-success-500 border-r-3 border-r-success-500" : ""
      )}
      color={isCompleted ? "success" : isActive ? "primary" : "default"}
      startContent={<Icon />}
      onPress={onPress}
    >
      <span className="text-sm">{label}</span>
      <p className="text-xs text-right flex-1">{duration}</p>
    </Button>
  );
};

export const CourseSidebarItemSkeleton = () => {
  return (
    <div className="w-full justify-start mb-2">
      <Skeleton className="w-full h-10" />
    </div>
  );
};
