import { AllCoursesScreen } from "@/features/student/screens/all-courses.screen";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("home");
  return {
    title: t("title"),
    description: t("description"),
  };
};
const StudentBusiness = () => {
  return <AllCoursesScreen />;
};

export default StudentBusiness;
