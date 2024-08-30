import { cn } from "@/lib/utils";

type HeadingProps = {
  children: React.ReactNode;
  className?: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  description?: string;
};
export const Heading = ({
  children,
  className,
  level = "h2",
  description,
}: HeadingProps) => {
  const Tag = level;
  return (
    <div className="flex flex-col gap-2">
      <Tag className={cn("text-2xl font-semibold", className)}>{children}</Tag>
      {description && <p className="text-gray-500">{description}</p>}
    </div>
  );
};
