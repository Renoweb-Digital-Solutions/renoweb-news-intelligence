import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  backend,
  cookieOptions,
  FLOW_COOKIE,
  CHALLENGE_COOKIE,
} from "@/lib/server/backend";

// # Google returns here, never to FastAPI. Both state and the browser cookie are validated there.
// # The redirect contains no code, token or challenge; only a harmless UI step identifier.
export async function GET(request) {
  const origin = process.env.AUTH_FRONTEND_ORIGIN || "http://localhost:3000";
  const query = new URL(request.url).searchParams;
  let destination = "/auth?error=google";
  let challenge;
  try {
    const flow = (await cookies()).get(FLOW_COOKIE)?.value;
    if (
      flow &&
      query.get("state") &&
      query.get("code") &&
      !query.has("error")
    ) {
      const result = await backend("/auth/google/callback", {
        method: "POST",
        body: { flow, state: query.get("state"), code: query.get("code") },
        request,
      });
      if (result.ok) {
        challenge = await result.json();
        destination = "/auth?step=verify";
      }
    }
  } catch {
    /* # Keep provider failures generic and prevent credentials entering error URLs. */
  }
  const response = NextResponse.redirect(new URL(destination, origin), 303);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.cookies.set(FLOW_COOKIE, "", cookieOptions(0));
  if (challenge)
    response.cookies.set(
      CHALLENGE_COOKIE,
      challenge.challenge,
      cookieOptions(challenge.expires_in),
    );
  return response;
}
