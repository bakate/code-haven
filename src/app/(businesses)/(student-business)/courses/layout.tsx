"use client";
import NavbarComponent from "@/features/teacher/components/navbar";
import { Sidebar } from "@/features/teacher/components/sidebar";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { redirect, usePathname } from "next/navigation";
import { LuCompass, LuList } from "react-icons/lu";

const StudentCoursesLayout = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const pathname = usePathname();
  const isLearning = pathname && pathname === "/courses";

  const t = useTranslations("Navigation");
  if (session?.status === "loading") {
    return "";
  }
  if (session?.status === "unauthenticated") {
    redirect("/");
  }

  const isAuthenticatedStudent = session?.status === "authenticated";
  const studentRoutes = [
    {
      label: t("browse"),
      href: "/",
      icon: LuCompass,
    },
    {
      label: t("my_courses"),
      href: "/courses",
      icon: LuList,
    },
  ];

  if (isLearning) {
    return (
      <div className="h-[100dvh]">
        <div className=" fixed inset-y-0 w-full">
          <NavbarComponent
            routes={studentRoutes}
            isTeacherPage={false}
            isLearning={false}
            isAuthenticated={isAuthenticatedStudent}
          />
        </div>
        <div className="hidden md:grid w-56 fixed inset-y-0 z-50 bg-slate-50 dark:bg-slate-900">
          <Sidebar
            routes={studentRoutes}
            isAuthenticated={isAuthenticatedStudent}
          />
        </div>
        <main className="md:pl-60 pt-[80px] h-full max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    );
  }
  return <>{children}</>;
};

export default StudentCoursesLayout;
