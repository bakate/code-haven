import { protectServer } from "@/features/auth/utils/auth-utils";
import { CreateCourseScreen } from "@/features/teacher/screens/create-course-screen";

const CreateCoursePage = async () => {
  await protectServer();
  return <CreateCourseScreen />;
};

export default CreateCoursePage;
