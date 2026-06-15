import ProfileModal from "@/components/Modals/ProfileModal";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has("session");
  if (!hasSession) {
    redirect("/login");
  }
  return <ProfileModal />;
}
