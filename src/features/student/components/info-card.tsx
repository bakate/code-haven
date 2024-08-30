import { IconBadge } from "@/components/icon-badge";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
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
