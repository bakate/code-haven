"use client";
import NavbarComponent from "@/features/teacher/components/navbar";
import { Sidebar } from "@/features/teacher/components/sidebar";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiBarChart2, FiList } from "react-icons/fi";
import { LuCompass, LuList } from "react-icons/lu";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() ?? "";
  const session = useSession();
  const router = useRouter();
  const params = useParams<{ categories: string; title: string }>();
  const searchParams = useSearchParams();

  const categories = searchParams.get("categories") || params.categories;
  const title = searchParams.get("title") || params.title;

  const t = useTranslations("Navigation");
  if (session?.status === "loading") {
    return "";
  }

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isAuthenticated = session?.status === "authenticated";

  const studentRoutes = [
    {
      label: t("browse"),
      href: "/",
      icon: LuCompass,
    },
    {
      label: t("my_courses"),
      href: "/courses/enrolled",
      icon: LuList,
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
    : [];

  return (
    <div className="h-[100dvh]">
      <div className=" fixed inset-y-0 w-full">
        <NavbarComponent
          routes={routes}
          isTeacherPage={isTeacherPage ?? false}
          isAuthenticated={isAuthenticated}
        />
      </div>
      {routes.length ? (
        <div className="hidden md:grid w-56 fixed inset-y-0 z-50 bg-slate-50 dark:bg-slate-900">
          <Sidebar routes={routes} isAuthenticated={isAuthenticated} />
        </div>
      ) : null}
      <main
        className={cn(
          "pt-[80px] md:pl-[21.5rem] h-full max-w-screen-xl 2xl:max-w-screen-2xl px-4",
          !routes.length ? "mx-auto md:pl-0" : ""
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
