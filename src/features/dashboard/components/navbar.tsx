"use client";

import { LocalSwitcherSelect } from "@/components/local-switcher-select";
import { UserButton } from "@/features/auth/components/user-button";
import {
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
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiBarChart2, FiCompass, FiLayout, FiList } from "react-icons/fi";
import { Logo } from "./logo";

export default function NavbarComponent() {
  const t = useTranslations("Navigation");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const guestRoutes = [
    {
      label: t("dashboard"),
      href: "/",
      icon: FiLayout,
    },
    {
      label: t("browse"),
      href: "/search",
      icon: FiCompass,
    },
  ];
  const teacherRoutes = [
    {
      label: t("courses"),
      href: "/teacher/courses",
      icon: FiList,
    },
    {
      label: t("analytics"),
      href: "/teacher/analytics",
      icon: FiBarChart2,
    },
  ];

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  return (
    <Navbar
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      classNames={{
        base: "md:pl-56",
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-[-2px]",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarBrand>
        <Link color="foreground" href="/">
          <Logo />
          <p className="font-bold text-inherit text-[#007DFC] ml-2">
            CodeHaven
          </p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {routes.map((route) => (
          <NavbarItem key={route.label} isActive={pathname === route.href}>
            <Link href={route.href} color="foreground" isBlock>
              {route.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <UserButton />
        <LocalSwitcherSelect />
      </NavbarContent>
      <NavbarMenu>
        {routes.map((route, index, arr) => (
          <NavbarMenuItem key={`${route}-${index}`}>
            <Link
              className="w-full hover:cursor-pointer justify-start"
              href={route.href}
              size="lg"
              isBlock
              onPress={() => setIsMenuOpen(false)}
            >
              {route.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
