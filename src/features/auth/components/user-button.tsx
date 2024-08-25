"use client";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  FiCreditCard,
  FiHome,
  FiLoader,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { IconType } from "react-icons/lib";
import { LuLogIn } from "react-icons/lu";

type ItemProps = {
  label: string;
  href: string;
  icon?: IconType;
  type?: "profile" | "logout";
};

export const UserButton = () => {
  const t = useTranslations("Navigation");
  const session = useSession();

  if (session?.status === "loading") {
    return <FiLoader className="size-4 animate-spin text-muted-foreground" />;
  }

  if (session?.status === "unauthenticated" || !session.data) {
    return (
      <div>
        <Button
          as={Link}
          href="/sign-in"
          variant="light"
          startContent={<LuLogIn />}
        >
          {t("sign_in")}
        </Button>
      </div>
    );
  }

  const { email = "", image = "", name = "" } = session.data?.user ?? {};

  const menuItems: ItemProps[] = [
    {
      label: t("signedInAs"),
      href: "#",
      type: "profile",
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
      type: "logout",
    },
  ];

  const renderMenuItem = (item: ItemProps, index: number) => {
    if (item.type === "profile") {
      return (
        <DropdownItem
          key={item.label}
          className="h-14 gap-2 hover:cursor-not-allowed"
          href={item.href}
          textValue={item.label}
        >
          <p className="font-semibold">{item.label}</p>
          <p className="font-semibold">{email}</p>
        </DropdownItem>
      );
    }

    if (item.type === "logout") {
      return (
        <DropdownItem
          key={item.label}
          startContent={item.icon ? <item.icon /> : ""}
          onPress={() => signOut()}
          textValue={item.label}
          color="danger"
        >
          {item.label}
        </DropdownItem>
      );
    }

    return (
      <DropdownItem
        key={item.label}
        startContent={item.icon ? <item.icon /> : ""}
        href={item.href}
        textValue={item.label}
      >
        {item.label}
      </DropdownItem>
    );
  };

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
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </DropdownMenu>
    </Dropdown>
  );
};
