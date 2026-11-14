import { currentUser } from "@/lib/server/backend";
import HomePage from "@/components/marketing/HomePage";

export const dynamic = "force-dynamic";

// # Home remains visitable after authentication; its CTA adapts to the session.
export default async function Home() {
  const user = await currentUser();
  return <HomePage signedIn={Boolean(user)} />;
}
