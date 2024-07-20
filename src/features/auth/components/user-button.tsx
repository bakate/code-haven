"use client";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  FiCreditCard,
  FiHome,
  FiLoader,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";

export const UserButton = () => {
  const t = useTranslations("Navigation");
  const session = useSession();

  if (session?.status === "loading") {
    return <FiLoader className="size-4 animate-spin text-muted-foreground" />;
  }

  if (session?.status === "unauthenticated" || !session.data) {
    return null;
  }

  const { email = "", image = "", name = "" } = session.data?.user ?? {};

  const menuItems = [
    {
      label: t("signed_in_as"),
      href: "/",
      icon: "",
    },
    {
      label: t("home"),
      href: "/",
      icon: FiHome,
    },
    {
      label: t("settings"),
      href: "/settings",
      icon: FiSettings,
    },
    {
      label: t("billing_subscription"),
      href: "/billing",
      icon: FiCreditCard,
    },
    {
      label: t("logout"),
      href: "/logout",
      icon: FiLogOut,
    },
  ];

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          showFallback
          className="transition-transform"
          color="secondary"
          name={name ?? ""}
          size="sm"
          src={image ?? ""}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        {menuItems.map((item, index) => {
          if (index === 0) {
            return (
              <DropdownItem
                key={item.label}
                className="h-14 gap-2 hover:cursor-not-allowed"
                href="#"
                textValue={item.label}
              >
                <p className="font-semibold">{item.label}</p>
                <p className="font-semibold">{email}</p>
              </DropdownItem>
            );
          }
          return (
            <DropdownItem
              key={item.label}
              startContent={<item.icon />}
              href={item.href}
              textValue={item.label}
              color={index === menuItems.length - 1 ? "danger" : "default"}
            >
              {item.label}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};
