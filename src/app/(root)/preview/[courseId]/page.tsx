import { CoursePreviewScreen } from "@/features/student/screens/course-preview.screen";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("coursePreview");
  return {
    title: t("title"),
    description: t("description"),
  };
};

type Props = {
  params: {
    courseId: string;
  };
};
const CoursePreviewPage = ({ params: { courseId } }: Props) => {
  return <CoursePreviewScreen courseId={courseId} />;
};

export default CoursePreviewPage;
