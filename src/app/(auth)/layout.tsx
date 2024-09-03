import { Footer } from "@/components/footer";

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("loginForm");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
};

export default function AuthScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[100dvh] grid-rows-[1fr_auto] overflow-clip">
      <div className="flex-1 flex flex-col justify-center items-center">
        {children}
      </div>
      <Footer />
    </div>
  );
}
