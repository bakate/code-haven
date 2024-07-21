import { Footer } from "@/components/footer";

export default function AuthScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col justify-center items-center">
        {children}
      </div>
      <Footer />
    </div>
  );
}
