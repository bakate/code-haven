import { auth } from "@/auth";
import { cn, customFont } from "@/lib/utils";

import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "../providers/providers";
import "./globals.css";
import "./prosemirror.css";

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
    <html
      lang={locale}
      className={cn("min-h-screen font-sans antialiased", customFont.variable)}
      suppressHydrationWarning
    >
      <body>
        <Providers session={session} messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
