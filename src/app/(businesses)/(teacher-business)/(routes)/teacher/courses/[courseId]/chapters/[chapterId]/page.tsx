import { EditChapterScreen } from "@/features/teacher/screens/edit-chapter-screen";

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
