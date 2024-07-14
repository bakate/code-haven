import { auth } from "@/auth";
import AuthScreen from "@/features/auth/screens/auth.screen";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();
  if (session) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col gap-2">
      <AuthScreen />
    </div>
  );
}
