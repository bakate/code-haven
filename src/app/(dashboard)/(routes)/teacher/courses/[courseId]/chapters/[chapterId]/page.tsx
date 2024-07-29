import { EditChapterScreen } from "@/features/dashboard/screens/edit-chapter-screen";

type Props = {
  params: {
    courseId: string;
    chapterId: string;
  };
};
const ChapterPage = ({ params }: Props) => {
  return (
    <div>
      <EditChapterScreen params={params} />
    </div>
  );
};

export default ChapterPage;
