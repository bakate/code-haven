// app/components/ThemeSwitcher.tsx
"use client";

import useClientCheck from "@/hooks/use-client-check";
import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

export const ThemeSwitcher = () => {
  const isClient = useClientCheck();
  const { theme, setTheme } = useTheme();

  if (!isClient) return null;

  return (
    <Switch
      defaultSelected
      size="lg"
      value={theme}
      onValueChange={(e) => setTheme(e ? "dark" : "light")}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <LuSun className={className} />
        ) : (
          <LuMoon className={className} />
        )
      }
    ></Switch>
  );
};
