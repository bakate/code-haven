// app/providers.tsx
"use client";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { ConfettiProvider } from "./confetti-provider";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <QueryProvider>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>


        <Toaster position="bottom-right" closeButton richColors />
        <ConfettiProvider />
        {children}
        </NextThemesProvider>
      </NextUIProvider>
    </QueryProvider>
  );
}
