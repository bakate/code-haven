import { protectServer } from "@/features/auth/utils/auth-utils";
import { EditChapterScreen } from "@/features/dashboard/screens/edit-chapter-screen";

type Props = {
  params: {
    courseId: string;
    chapterId: string;
  };
};
const ChapterPage = async ({ params }: Props) => {
  await protectServer();
  return (
    <div>
      <EditChapterScreen params={params} />
    </div>
  );
};

export default ChapterPage;
