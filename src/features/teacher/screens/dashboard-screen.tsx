import { Link } from "@heroui/react";

const DashboardScreen = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Link href="/teacher/create" color="primary">
        Create course
      </Link>
      <h2>The content will goes here</h2>
    </div>
  );
};

export default DashboardScreen;
