import { IconBadge } from "@/components/icon-badge";
import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import { IconType } from "react-icons/lib";

type Props = {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: IconType;
};
export const InfoCard = ({
  numberOfItems,
  variant,
  label,
  icon: Icon,
}: Props) => {
  return (
    <Card className="max-w-[400px]">
      <CardHeader>
        <IconBadge variant={variant} icon={Icon} />
      </CardHeader>
      <CardBody>
        <div className="flex justify-between">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-500">{numberOfItems}</p>
        </div>
      </CardBody>
    </Card>
  );
};

export const InfoCardSkeleton = () => {
  return (
    <Card className="max-w-[400px]">
      <CardHeader>
        <Skeleton className="w-10 h-10 rounded-full" />
      </CardHeader>
      <CardBody>
        <div className="flex justify-between">
          <Skeleton className="w-1/2 h-5 rounded-lg" />
          <Skeleton className="w-1/4 h-5 rounded-lg" />
        </div>
      </CardBody>
    </Card>
  );
};
