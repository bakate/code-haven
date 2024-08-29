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
  const coursesPage = pathname?.startsWith("/courses");
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
      href: "/courses",
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
          "md:pl-60 pt-[80px] h-full max-w-6xl mx-auto",
          coursesPage ? "max-w-screen-xl" : ""
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
