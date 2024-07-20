import { auth } from "@/auth";
import { cn, customFont } from "@/lib/utils";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Code Haven",
  description: "a learning platform for future developers",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const locale = await getLocale();
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <SessionProvider session={session}>
      <html
        lang={locale}
        className={cn(
          "min-h-screen font-sans antialiased",
          customFont.variable
        )}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <body>
            <Providers>{children}</Providers>
          </body>
        </NextIntlClientProvider>
      </html>
    </SessionProvider>
  );
}
