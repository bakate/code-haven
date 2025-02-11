import { IconBadge } from "@/components/icon-badge";
import { Skeleton } from "@heroui/react";
import { FC } from "react";
import { IconType } from "react-icons/lib";

type SkeletonWithIconProps = {
  icon: IconType;
  width?: string;
};

export const SkeletonWithIcon: FC<SkeletonWithIconProps> = ({
  icon,
  width = "w-32",
}) => (
  <div className="flex items-center gap-x-2">
    <IconBadge icon={icon} />
    <Skeleton className={`h-12 rounded-lg ${width}`} />
  </div>
);

export const FullWidthSkeleton: FC<{ height?: string }> = ({
  height = "h-24",
}) => <Skeleton className={`w-full ${height}`} />;
