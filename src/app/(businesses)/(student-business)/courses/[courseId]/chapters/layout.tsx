"use client";
import {
  CourseSidebar,
  CourseSidebarSkeleton,
} from "@/features/student/components/course-sidebar";
import {
  SingleCourse,
  useGetSingleCourseById,
} from "@/features/student/data/use-get-single-course-by-id";
import NavbarComponent from "@/features/teacher/components/navbar";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { redirect } from "next/navigation";
import { LuPlay } from "react-icons/lu";
import Loading from "./loading";

// return an array of object with label:string, href:string and icon:IconType
const formatRoutes = (course: SingleCourse, locale: string) => {
  return course.chapters.map((chapter) => ({
    label:
      chapter.chapterTranslations.find(
        (translation) => translation.lang === locale
      )?.title ?? "",
    href: `/courses/${course.id}/chapters/${chapter.id}`,
    icon: LuPlay,
  }));
};

const LearningDashboardLayout = ({
  children,
  params: { courseId },
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const session = useSession();
  const { data: course, isLoading } = useGetSingleCourseById(courseId);
  const locale = useLocale();

  if (isLoading) {
    return (
      <div className="h-[100dvh]">
        <div className="hidden md:grid w-80 fixed inset-y-0 z-50 bg-slate-50 dark:bg-slate-900">
          <CourseSidebarSkeleton />
        </div>
        <div className="md:pl-80 pt-[80px] h-full max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4">
          <Loading />
        </div>
      </div>
    );
  }
  if (!course) {
    return <div />;
  }

  if (session?.status === "loading") {
    return "";
  }

  const isAuthenticatedStudent = session?.status === "authenticated";
  if (!isAuthenticatedStudent) {
    redirect("/");
  }

  const routes = formatRoutes(course, locale);

  return (
    <div className="h-[100dvh]">
      <div className=" fixed inset-y-0 w-full">
        <NavbarComponent
          routes={routes}
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
      <main className="md:pl-80 pt-[80px] h-full max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4">
        {children}
      </main>
    </div>
  );
};

export default LearningDashboardLayout;
