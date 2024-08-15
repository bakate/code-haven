"use client";

import { LocalSwitcherSelect } from "@/components/local-switcher-select";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserButton } from "@/features/auth/components/user-button";
import {
  Button,
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { CourseRoutes } from "../types";

type Props = {
  routes: CourseRoutes;
  isTeacherOrPlayerPage: boolean;
};
export default function NavbarComponent({
  routes,
  isTeacherOrPlayerPage,
}: Props) {
  const t = useTranslations("Navigation");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
    >
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />

      <NavbarContent as="div" justify="end">
        {isTeacherOrPlayerPage ? (
          <NavbarItem>
            <Button
              href="/"
              as={Link}
              variant="light"
              startContent={<FiLogOut />}
            >
              {t("leave_teacher_mode")}
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Link href="/teacher/courses" color="primary" isBlock>
              {t("teacher_mode")}
            </Link>
          </NavbarItem>
        )}
        <UserButton />
        <LocalSwitcherSelect />
        <ThemeSwitcher />
      </NavbarContent>
      <NavbarMenu>
        {routes.map((route, index) => (
          <NavbarMenuItem key={`${route}-${index}`}>
            <Button
              as={Link}
              className="w-full justify-start"
              href={route.href}
              variant="light"
              startContent={<route.icon />}
              onPress={() => setIsMenuOpen(false)}
            >
              {route.label}
            </Button>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
