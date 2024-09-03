import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("legal");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
};

const LegalLayout = async ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default LegalLayout;
