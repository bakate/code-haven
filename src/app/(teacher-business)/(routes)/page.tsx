import { protectServer } from "@/features/auth/utils/auth-utils";
import DashboardScreen from "@/features/teacher/screens/dashboard-screen";

const Dashboard = async () => {
  await protectServer();
  return <DashboardScreen />;
};

export default Dashboard;
