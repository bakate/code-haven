import { TeacherCourseById } from "@/features/teacher/screens/teacher-course-by-id-screen";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  return (
    <div>
      <TeacherCourseById courseId={params.courseId} />
    </div>
  );
};

export default CoursePage;
