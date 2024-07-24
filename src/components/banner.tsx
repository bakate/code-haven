import { cva, type VariantProps } from "class-variance-authority";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/50 border-yellow-30 text-foreground",

        success: "bg-emerald-700 border-emerald-800 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

type BannerProps = VariantProps<typeof bannerVariants> & {
  label: string;
};

const iconMap = {
  warning: FiAlertTriangle,
  success: FiCheckCircle,
};

export const Banner = ({ label, variant }: BannerProps) => {
  const Icon = iconMap[variant || "warning"];
  return (
    <div className={bannerVariants({ variant })}>
      <Icon className="mr-2 size-4" />
      {label}
    </div>
  );
};
