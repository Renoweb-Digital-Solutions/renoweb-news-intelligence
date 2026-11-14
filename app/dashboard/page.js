import { redirect } from "next/navigation";
import { currentUser } from "@/lib/server/backend";
import Dashboard from "@/components/dashboard/Dashboard";

export const dynamic = "force-dynamic";

// # Validate the session on the server before rendering any dashboard content.
export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/auth");
  return <Dashboard />;
}
