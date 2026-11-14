import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { currentUser, CHALLENGE_COOKIE } from "@/lib/server/backend";
import AuthScreen from "@/components/auth/AuthScreen";

export const metadata = { title: "Welcome to Snooptel" };
export const dynamic = "force-dynamic";

// # Authenticated visitors skip auth; Google may resume only if its challenge cookie exists.
export default async function AuthPage({ searchParams }) {
  const user = await currentUser();
  if (user) redirect("/dashboard");
  const query = await searchParams;
  const canVerify =
    query.step === "verify" && (await cookies()).has(CHALLENGE_COOKIE);
  return (
    <AuthScreen
      initialStep={canVerify ? "verify" : "login"}
      googleError={query.error === "google"}
    />
  );
}
