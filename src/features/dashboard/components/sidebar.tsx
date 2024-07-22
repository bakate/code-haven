"use client";
import { Button, Link } from "@nextui-org/react";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { CourseRoutes } from "../types";
import { Logo } from "./logo";

type Props = {
  routes: CourseRoutes;
};
export const Sidebar = ({ routes }: Props) => {
  const pathname = usePathname();
  if (!routes || routes.length === 0) {
    return null;
  }
  return (
    <div className="mt-4">
      <Link color="foreground" href="/" isBlock className="w-full">
        <Logo />
        <p className="font-bold text-inherit text-[#007DFC] ml-2">Code Haven</p>
      </Link>

      <div className="flex flex-col gap-4 items-start mt-4">
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
    </div>
  );
};
