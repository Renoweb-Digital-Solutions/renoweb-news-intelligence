import { redirect } from "next/navigation";
import { currentUser } from "@/lib/server/backend";
import ProfileView from "@/components/profile/ProfileView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your profile · Snooptel" };

// # Validate the session on the server before rendering any account details.
export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/auth");
  return <ProfileView user={user} />;
}
