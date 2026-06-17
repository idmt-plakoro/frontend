import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Profile from "@/components/ProfilePage";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has("session");
  if (!hasSession) {
    redirect("/login");
  }

  return <Profile />;
}
