"use client";

import { CoursePreviewScreen } from "@/features/student/screens/course-preview.screen";

type Props = {
  params: {
    courseId: string;
  };
};
const CoursePreviewPage = ({ params: { courseId } }: Props) => {
  return <CoursePreviewScreen courseId={courseId} />;
};

export default CoursePreviewPage;
