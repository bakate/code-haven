"use client";
import { Button, Link } from "@nextui-org/react";

import { LocalSwitcherSelect } from "@/components/local-switcher-select";
import { Logo } from "@/components/logo";
import { UserButton } from "@/features/auth/components/user-button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { CourseRoutes } from "../types";

type Props = {
  routes: CourseRoutes;
  isAuthenticated: boolean;
};
export const Sidebar = ({ routes, isAuthenticated }: Props) => {
  const pathname = usePathname();
  if (!routes || routes.length === 0) {
    return null;
  }
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto] pb-4">
      <Logo />

      <div className="mt-4">
        {routes.map((route) => (
          <Button
            as={Link}
            key={route.label}
            href={route.href}
            variant="light"
            radius="none"
            className={cn(
              "w-full justify-start",
              pathname === route.href ? "border-r-primary-500 border-r-3" : ""
            )}
            color={pathname === route.href ? "primary" : "default"}
            startContent={<route.icon />}
          >
            {route.label}
          </Button>
        ))}
      </div>
      <div className="flex justify-between items-center px-2 gap-2">
        <LocalSwitcherSelect />
        {isAuthenticated ? <UserButton /> : null}
      </div>
    </div>
  );
};
