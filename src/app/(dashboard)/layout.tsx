import NavbarComponent from "@/features/dashboard/components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className=" fixed inset-y-0 w-full">
        <NavbarComponent />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50 bg-red-300">
        <h2>This is the sidebar</h2>
        {/*TODO create  <Sidebar /> component */}
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
