import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  warningMode?: boolean;
};
export const FormContainer = ({ children, warningMode }: Props) => {
  return (
    <div
      className={cn(
        "mt-6 border bg-slate-100 rounded-md p-4 shadow-md dark:bg-slate-900 dark:border-slate-700",
        warningMode && "border-red-300 dark:border-red-400"
      )}
    >
      {children}
    </div>
  );
};
