"use client";
import NavbarComponent from "@/features/dashboard/components/navbar";
import { Sidebar } from "@/features/dashboard/components/sidebar";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { FiBarChart2, FiCompass, FiLayout, FiList } from "react-icons/fi";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/player");

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
    {
      label: t("analytics"),
      href: "/teacher/analytics",
      icon: FiBarChart2,
    },
  ];

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  return (
    <div className="h-[100dvh]">
      <div className=" fixed inset-y-0 w-full">
        <NavbarComponent
          routes={routes}
          isTeacherOrPlayerPage={isTeacherPage || isPlayerPage}
        />
      </div>
      <div className="hidden md:grid w-56 fixed inset-y-0 z-50 bg-slate-50 dark:bg-slate-900">
        <Sidebar routes={routes} />
      </div>
      <main className="md:pl-60 pt-[80px] h-full pr-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
