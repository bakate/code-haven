import { Footer } from "@/components/footer";

export default function AuthScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[100dvh] grid-rows-[1fr_auto]">
      <div className="flex-1 flex flex-col justify-center items-center">
        {children}
      </div>
      <Footer />
    </div>
  );
}
