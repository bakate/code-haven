import { EditChapterScreen } from "@/features/teacher/screens/edit-chapter-screen";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("teacherCourseByIdChapterPage");
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
const ChapterPage = async ({ params }: Props) => {
  return (
    <div>
      <EditChapterScreen params={params} />
    </div>
  );
};

export default ChapterPage;
