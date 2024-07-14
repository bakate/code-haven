"use client";

import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import { signIn as SocialSignIn } from "next-auth/react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FiArrowRight } from "react-icons/fi";
import { magicLinkAction } from "../actions/sign-in.action";
import { MagicLinkSchema, MagicLinkValues } from "../types";
export function LoginForm() {
  const [isPending, startTransition] = useTransition();

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

  const signInProvider = (
    provider: "google" | "resend" | "twitter" | "github"
  ) => {
    SocialSignIn(provider);
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
        >
          Email me a login link
        </Button>
        <div className="flex items-center justify-center overflow-hidden">
          <Divider />
          <span className="text-small uppercase mx-4">or</span>
          <Divider />
        </div>
        <Button
          variant="bordered"
          className="w-full"
          type="button"
          startContent={<FcGoogle />}
          onClick={() => signInProvider("google")}
        >
          Continue with Google
        </Button>
        <Button
          variant="bordered"
          className="w-full"
          type="button"
          startContent={<FaGithub />}
          onClick={() => signInProvider("github")}
        >
          Continue with Github
        </Button>
        <p className="text-small mt-2 text-gray-500 text-center">
          By clicking continue, you agree to our{" "}
          <Link href="/terms-of-service" className="underline">
            Terms of Service{" "}
          </Link>
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
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
          <h2 className="text-lg font-semibold">CodeHaven</h2>
          <p className="text-small">Connect to your account to continue</p>
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
                  label="Email address"
                  placeholder="you@example.com"
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
