import { Link } from "@nextui-org/react";

const CoursesPage = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* TODO display the courses list */}
      <Link href="/teacher/courses/create" color="primary">
        Create course
      </Link>
    </div>
  );
};

export default CoursesPage;
