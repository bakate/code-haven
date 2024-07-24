import { protectServer } from "@/features/auth/utils/auth-utils";
import { TeacherCourseById } from "@/features/dashboard/screens/teacher-course-by-id-screen";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  await protectServer();
  return (
    <div>
      <TeacherCourseById courseId={params.courseId} />
    </div>
  );
};

export default CoursePage;
