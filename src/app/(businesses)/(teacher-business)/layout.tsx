"use client";
import NavbarComponent from "@/features/teacher/components/navbar";
import { Sidebar } from "@/features/teacher/components/sidebar";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { redirect, usePathname } from "next/navigation";
import { FiCompass, FiLayout, FiList } from "react-icons/fi";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/player");
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";

  if (!isAuthenticated) {
    redirect("/");
  }

  const t = useTranslations("Navigation");

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
    // {
    //   label: t("analytics"),
    //   href: "/teacher/analytics",
    //   icon: FiBarChart2,
    // },
  ];

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  return (
    <div className="h-[100dvh]">
      <div className=" fixed inset-y-0 w-full">
        <NavbarComponent
          routes={routes}
          isTeacherPage={isTeacherPage || isPlayerPage || false}
          isAuthenticated={isAuthenticated}
        />
      </div>
      <div className="hidden md:grid w-56 fixed inset-y-0 z-50 bg-slate-50 dark:bg-slate-900">
        <Sidebar routes={routes} isAuthenticated={isAuthenticated} />
      </div>
      <main className="md:pl-60 pt-[80px] h-full px-4">{children}</main>
    </div>
  );
};

export default DashboardLayout;
