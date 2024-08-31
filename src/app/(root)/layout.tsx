"use client";
import NavbarComponent from "@/features/teacher/components/navbar";
import { Sidebar } from "@/features/teacher/components/sidebar";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { FiBarChart2, FiCompass, FiList } from "react-icons/fi";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const session = useSession();

  const t = useTranslations("Navigation");
  if (session?.status === "loading") {
    return "";
  }

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isAuthenticated = session?.status === "authenticated";

  const guestRoutes = [
    {
      label: t("browse"),
      href: "/",
      icon: FiCompass,
    },
  ];

  // TODO to rework
  const studentRoutes = [
    {
      label: t("browse"),
      href: "/",
      icon: FiCompass,
    },
    {
      label: t("my_courses"),
      href: "/courses/enrolled",
      icon: FiList,
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

  const routes = isTeacherPage
    ? teacherRoutes
    : isAuthenticated
    ? studentRoutes
    : guestRoutes;
  return (
    <div className="h-[100dvh]">
      <div className=" fixed inset-y-0 w-full">
        <NavbarComponent
          routes={routes}
          isTeacherPage={isTeacherPage ?? false}
          isAuthenticated={isAuthenticated}
        />
      </div>
      <div className="hidden md:grid w-56 fixed inset-y-0 z-50 bg-slate-50 dark:bg-slate-900">
        <Sidebar routes={routes} isAuthenticated={isAuthenticated} />
      </div>
      <main
        className={cn(
          "pt-[80px] md:pl-60 h-full max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-0"
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
