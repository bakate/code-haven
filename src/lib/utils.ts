import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Inter as FontSans } from "next/font/google";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const customFont = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
