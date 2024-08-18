type Props = {
  children: React.ReactNode;
};
export const FormContainer = ({ children }: Props) => {
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 shadow-md dark:bg-slate-900 dark:border-slate-700">
      {children}
    </div>
  );
};
