import { AllStudentEnrolledCoursesScreen } from "@/features/student/screens/all-enrolled-courses.screen";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("studentCoursesReporting");
  return {
    title: t("title"),
    description: t("pageDescription"),
  };
};

const CoursesPage = () => {
  return <AllStudentEnrolledCoursesScreen />;
};

export default CoursesPage;
