import LoginModal from "@/components/Modals/LoginModal";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has("session");
  if (hasSession) {
    redirect("/profile");
  }
  return <LoginModal isOpen={true} />;
}
