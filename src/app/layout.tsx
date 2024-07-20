import { cn, customFont } from "@/lib/utils";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

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
  return (
    <SessionProvider session={session}>
      <html
        lang="en"
        className={cn(
          "min-h-screen font-sans antialiased",
          customFont.variable
        )}
        suppressHydrationWarning
      >
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
