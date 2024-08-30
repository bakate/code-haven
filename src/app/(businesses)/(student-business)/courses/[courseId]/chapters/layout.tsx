"use client";
import { CourseSidebar } from "@/features/student/components/course-sidebar";
import NavbarComponent from "@/features/teacher/components/navbar";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";

const LearningDashboardLayout = ({
  children,
  params: { courseId },
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const session = useSession();

  const t = useTranslations("Navigation");
  if (session?.status === "loading") {
    return "";
  }

  const isAuthenticatedStudent = session?.status === "authenticated";
  if (!isAuthenticatedStudent) {
    redirect("/");
  }

  return (
    <div className="h-[100dvh]">
      <div className=" fixed inset-y-0 w-full">
        <NavbarComponent
          routes={[]}
          isTeacherPage={false}
          isLearning={true}
          isAuthenticated={isAuthenticatedStudent}
        />
      </div>
      <div className="hidden md:grid w-80 fixed inset-y-0 z-50 bg-slate-50 dark:bg-slate-900">
        <CourseSidebar
          courseId={courseId}
          isAuthenticated={isAuthenticatedStudent}
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default LearningDashboardLayout;
