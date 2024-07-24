import { cva, type VariantProps } from "class-variance-authority";
import { IconType } from "react-icons/lib";

const backgroundVariants = cva(
  "rounded-full flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-sky-100",
        success: "bg-emerald-100",
      },
      size: {
        default: "p-2",
        sm: "p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const iconVariants = cva("", {
  variants: {
    variant: {
      default: "text-sky-700",
      success: "text-emerald-700",
    },
    size: {
      default: "h-8 w-8",
      sm: "h-4 w-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>;
type IconVariantsProps = VariantProps<typeof iconVariants>;

type iconBadgeProps = BackgroundVariantsProps &
  IconVariantsProps & {
    icon: IconType;
  };

export const IconBadge = ({ icon: Icon, ...props }: iconBadgeProps) => {
  return (
    <div className={backgroundVariants(props)}>
      <Icon className={iconVariants(props)} />
    </div>
  );
};
