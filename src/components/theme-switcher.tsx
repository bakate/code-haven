"use client";

import useClientCheck from "@/hooks/use-client-check";
import { Switch } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

export const ThemeSwitcher = () => {
  const isClient = useClientCheck();
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  if (!isClient) return null;

  return (
    <Switch
      checked={isDark}
      onValueChange={toggleTheme}
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
