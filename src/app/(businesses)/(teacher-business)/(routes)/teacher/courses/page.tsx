import { TeacherCoursesScreen } from "@/features/teacher/screens/teacher-courses-screen";

const CoursesPage = async () => {
  return (
    <div className="flex flex-col gap-4">
      <TeacherCoursesScreen />
    </div>
  );
};

export default CoursesPage;
