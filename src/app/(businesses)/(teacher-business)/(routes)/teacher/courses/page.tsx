import { TeacherCoursesScreen } from "@/features/teacher/screens/teacher-courses-screen";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("teacherCourses");
  return {
    title: t("title"),
    description: t("description"),
  };
};
const CoursesPage = async () => {
  return (
    <div className="flex flex-col gap-4">
      <TeacherCoursesScreen />
    </div>
  );
};

export default CoursesPage;
