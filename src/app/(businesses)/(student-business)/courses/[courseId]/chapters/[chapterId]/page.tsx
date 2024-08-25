"use client";

import { SingleCourseScreen } from "@/features/student/screens/single-course.screen";

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
