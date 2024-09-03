import { CreateCourseScreen } from "@/features/teacher/screens/create-course-screen";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("createOrEditCourseForm");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
};
const CreateCoursePage = async () => {
  return <CreateCourseScreen />;
};

export default CreateCoursePage;
