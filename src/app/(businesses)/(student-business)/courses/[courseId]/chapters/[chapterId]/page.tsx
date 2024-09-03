import { SingleCourseScreen } from "@/features/student/screens/single-course.screen";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("studentCourseById");
  return {
    title: t("title"),
    description: t("description"),
  };
};
type Props = {
  params: {
    courseId: string;
    chapterId: string;
  };
};

const ChapterPage = ({ params }: Props) => {
  return (
    <SingleCourseScreen
      courseId={params.courseId}
      chapterId={params.chapterId}
    />
  );
};

export default ChapterPage;
