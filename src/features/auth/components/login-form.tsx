"use client";

import { Form, FormField } from "@/components/ui/form";
import { useAuthStore } from "@/hooks/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Divider, Input } from "@heroui/react";
import { signIn as SocialSignIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FiArrowRight } from "react-icons/fi";
import { magicLinkAction } from "../actions/sign-in.action";
import { MagicLinkSchema, MagicLinkValues } from "../types";

export function LoginForm() {
  const t = useTranslations("loginForm");
  const [isPending, startTransition] = useTransition();
  const callbackUrl = useAuthStore((state) => state.callbackUrl);

  const magicLinkForm = useForm<MagicLinkValues>({
    resolver: zodResolver(MagicLinkSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  function onMagicLinkSubmit(data: MagicLinkValues) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      await magicLinkAction(formData);
    });
  }

  const signInProvider = (provider: "google" | "github") => {
    SocialSignIn(provider, { callbackUrl: callbackUrl || undefined });
  };

  const CTAButtons = () => {
    return (
      <div className="grid gap-2">
        <Button
          variant="solid"
          className="w-full"
          color="primary"
          type="submit"
          endContent={<FiArrowRight />}
          isDisabled={isPending}
        >
          {t("emailButton")}
        </Button>
        <div className="flex items-center justify-center overflow-hidden">
          <Divider />
          <span className="text-small uppercase mx-4">{t("or")}</span>
          <Divider />
        </div>
        <Button
          variant="bordered"
          className="w-full"
          type="button"
          startContent={<FcGoogle />}
          onClick={() => signInProvider("google")}
          isDisabled={isPending}
        >
          {t("continueWithGoogle")}
        </Button>
        <Button
          variant="bordered"
          className="w-full"
          type="button"
          startContent={<FaGithub />}
          onClick={() => signInProvider("github")}
          isDisabled={isPending}
        >
          {t("continueWithGithub")}
        </Button>
        <p className="text-small mt-2 text-gray-500 text-center">
          {t("agreementText")}{" "}
          <Link href="/terms-of-service" className="underline">
            {t("termsOfService")}{" "}
          </Link>
          and{" "}
          <Link href="/privacy" className="underline">
            {t("privacyPolicy")}{" "}
          </Link>
          .
        </p>
      </div>
    );
  };

  return (
    <Card className="flex flex-col gap-4 w-[350px]">
      <CardBody>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{t("title")}</h2>
          <p className="text-small">{t("subtitle")}</p>
        </div>
        <Form {...magicLinkForm}>
          <form
            className="flex flex-col gap-4 mt-3"
            onSubmit={magicLinkForm.handleSubmit(onMagicLinkSubmit)}
          >
            <FormField
              control={magicLinkForm.control}
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  isRequired
                  label={t("emailLabel")}
                  placeholder={t("emailPlaceholder")}
                  type="email"
                  isInvalid={!!fieldState?.error?.message}
                  errorMessage={fieldState?.error?.message}
                  {...field}
                />
              )}
            />

            {CTAButtons()}
          </form>
        </Form>
      </CardBody>
    </Card>
  );
}
