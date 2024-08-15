// app/providers.tsx
"use client";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { ConfettiProvider } from "./confetti-provider";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <QueryProvider>
      <NextUIProvider navigate={router.push}>
        <Toaster position="bottom-right" closeButton richColors />
        <ConfettiProvider />
        {children}
      </NextUIProvider>
    </QueryProvider>
  );
}
