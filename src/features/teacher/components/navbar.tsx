"use client";

import { useMedia } from "react-use";

import { LocalSwitcherSelect } from "@/components/local-switcher-select";
import { Logo } from "@/components/logo";
import { SearchInput } from "@/components/search-input";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserButton } from "@/features/auth/components/user-button";
import { cn } from "@/lib/utils";
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { CourseRoutes } from "../types";

type Props = {
  routes: CourseRoutes;
  isTeacherPage: boolean;
  isLearning?: boolean;
  isAuthenticated?: boolean;
};
export default function NavbarComponent({
  routes,
  isTeacherPage,
  isLearning = false,
  isAuthenticated = false,
}: Props) {
  const t = useTranslations("Navigation");
  const isTablet = useMedia("(min-width: 640px)", false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      maxWidth="full"
      isBordered
      shouldHideOnScroll
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
    >
      {isAuthenticated ? (
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      ) : null}
      {!isAuthenticated ? (
        <NavbarBrand className="hidden md:block">
          <Logo />
        </NavbarBrand>
      ) : null}

      {!isLearning && !isTeacherPage ? (
        <NavbarContent
          as="div"
          justify="center"
          className={cn(
            "sm:flex flex-1",
            isAuthenticated ? "sm:pl-56 lg:pl-80" : ""
          )}
        >
          <NavbarItem className="flex-1 flex">
            <SearchInput />
          </NavbarItem>
        </NavbarContent>
      ) : null}
      <NavbarContent as="div" justify="end" className="flex-grow-0">
        {isTeacherPage ? (
          <NavbarItem>
            <Button
              href="/"
              as={Link}
              variant="light"
              isIconOnly={!isTablet}
              startContent={<FiLogOut />}
            >
              {isTablet ? t("leave_teacher_mode") : ""}
            </Button>
          </NavbarItem>
        ) : isLearning ? null : isAuthenticated ? (
          <NavbarItem className="hidden md:block flex-grow-0">
            <Button
              as={Link}
              href="/teacher/courses"
              color="primary"
              variant="ghost"
              startContent={<FaChalkboardTeacher />}
            >
              {t("teacher_mode")}
            </Button>
          </NavbarItem>
        ) : (
          <UserButton />
        )}
        {/* {!isTablet ? <UserButton /> : null} */}
        {!isAuthenticated ? (
          <LocalSwitcherSelect className="md:max-w-36" />
        ) : null}
        <ThemeSwitcher />
      </NavbarContent>
      <NavbarMenu className="dark:bg-slate-900">
        <div className="grid grid-rows-[auto_1fr_auto] pb-12 h-full">
          <Logo />

          <div>
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
          </div>
          <UserButton />
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
