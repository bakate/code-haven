// app/providers.tsx
"use client";
import useClientCheck from "@/hooks/use-client-check";
import { NextUIProvider } from "@nextui-org/react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { ConfettiProvider } from "./confetti-provider";
import { QueryProvider } from "./query-provider";

type Props = {
  children: React.ReactNode;
  session: Session | null;
  messages: AbstractIntlMessages;
  locale: string;
};
export function Providers({ children, session, messages, locale }: Props) {
  const router = useRouter();
  const isClient = useClientCheck();

  if (!isClient) {
    return null;
  }

  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <QueryProvider>
          <NextUIProvider navigate={router.push}>
            <NextThemesProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={true}
              disableTransitionOnChange
            >
              <Toaster position="bottom-right" closeButton richColors />
              <ConfettiProvider />
              {children}
            </NextThemesProvider>
          </NextUIProvider>
        </QueryProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
