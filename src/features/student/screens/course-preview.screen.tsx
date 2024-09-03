import { CoursePreview } from "../components/course-preview";

type Props = {
  courseId: string;
};

export const CoursePreviewScreen = ({ courseId }: Props) => {
  return <CoursePreview courseId={courseId} />;
};
