"use client";

import { useMedia } from "react-use";

import { SearchInput } from "@/components/search-input";
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
  isTeacherPage: boolean;
  isLearning?: boolean;
};
export default function NavbarComponent({
  routes,
  isTeacherPage,
  isLearning = false,
}: Props) {
  const t = useTranslations("Navigation");
  const isTablet = useMedia("(min-width: 640px)", false);

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
      <NavbarContent
        as="div"
        justify="center"
        className="hidden md:flex flex-1"
      >
        <NavbarItem>
          <div></div>
        </NavbarItem>
      </NavbarContent>

      {!isLearning ? (
        <NavbarContent
          as="div"
          justify="center"
          className=" sm:flex gap-4 flex-1"
        >
          <NavbarItem className="flex-1">
            <SearchInput />
          </NavbarItem>
        </NavbarContent>
      ) : null}
      <NavbarContent as="div" justify="end">
        {isTeacherPage ? (
          <NavbarItem>
            <Button
              href="/"
              as={Link}
              variant="light"
              startContent={<FiLogOut />}
            >
              {isTablet ? t("leave_teacher_mode") : t("exit")}
            </Button>
          </NavbarItem>
        ) : isLearning ? null : (
          <NavbarItem className="hidden md:block">
            <Link href="/teacher/courses" color="primary" isBlock>
              {t("teacher_mode")}
            </Link>
          </NavbarItem>
        )}
        <UserButton />
        <ThemeSwitcher />
      </NavbarContent>
      <NavbarMenu className="dark:bg-slate-900">
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
