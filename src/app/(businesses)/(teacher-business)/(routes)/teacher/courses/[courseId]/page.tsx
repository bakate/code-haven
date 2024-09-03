import { TeacherCourseById } from "@/features/teacher/screens/teacher-course-by-id-screen";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("teacherCourseById");
  return {
    title: t("title"),
    description: t("description"),
  };
};
const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  return (
    <div>
      <TeacherCourseById courseId={params.courseId} />
    </div>
  );
};

export default CoursePage;
