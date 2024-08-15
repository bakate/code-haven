import { cva, type VariantProps } from "class-variance-authority";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full rounded-md",
  {
    variants: {
      variant: {
        warning:
          "bg-yellow-200/50 border-yellow-30  text-foreground dark:bg-yellow-600 dark:border-yellow-700 dark:text-yellow-100",

        success:
          "bg-emerald-500 border-emerald-800 text-secondary dark:bg-emerald-900 dark:text-emerald-200",
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
