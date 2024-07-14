import { protectServer } from "@/features/auth/utils/auth-utils";

const Home = async () => {
  await protectServer();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h2 className="text-3xl">You are logged in</h2>
    </div>
  );
};

export default Home;
