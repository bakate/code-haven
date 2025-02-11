"use client";

import Link from "next/link";

import useClientCheck from "@/hooks/use-client-check";
import { Button, Image } from "@heroui/react";
import { LuArrowLeft } from "react-icons/lu";
import { useTranslations } from "next-intl";

const NotFound = () => {
  const isClient = useClientCheck();
  const t = useTranslations("notFound");

  if (!isClient) {
    return null;
  }
  return (
    <div className="grid min-h-[100dvh] place-items-center place-content-center gap-3">
      <Image
        src="/error.png"
        height="300"
        width="300"
        alt="Error"
        className="dark:hidden"
      />
      <Image
        src="/error-dark.png"
        height="300"
        width="300"
        alt="Error"
        className="hidden dark:block"
      />
      <h2 className="text-xl font-medium">{t("title")}</h2>
      <p className="text-center text-muted-foreground">{t("description")}</p>
      <Button color="primary" as={Link} href="/" startContent={<LuArrowLeft />}>
        {t("backToHome")}
      </Button>
    </div>
  );
};

export default NotFound;
