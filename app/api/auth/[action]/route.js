import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  backend,
  validOrigin,
  cookieOptions,
  SESSION_COOKIE,
  CHALLENGE_COOKIE,
} from "@/lib/server/backend";

export const runtime = "nodejs";

// # Explicit action allowlist prevents this gateway becoming an arbitrary backend proxy.
// # Challenges and JWTs are stripped from JSON and stored only in HttpOnly cookies.
export async function POST(request, context) {
  if (!validOrigin(request))
    return NextResponse.json(
      { error: "Request origin is not allowed" },
      { status: 403 },
    );
  const { action } = await context.params;
  if (
    !["signup", "login", "verify", "resend", "logout", "reset"].includes(action)
  )
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const jar = await cookies();
  try {
    const input = await request.json();
    // # Never accept a challenge handle from browser JSON; bind verification to this browser.
    const body = { ...input };
    delete body.challenge;
    if (["verify", "resend"].includes(action))
      body.challenge = jar.get(CHALLENGE_COOKIE)?.value || "";
    const upstream = await backend(`/auth/${action}`, {
      method: "POST",
      body,
      request,
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      const message =
        typeof data.detail === "string"
          ? data.detail
          : "Check your details and try again.";
      const response = NextResponse.json(
        { error: message },
        { status: upstream.status, headers: { "Cache-Control": "no-store" } },
      );
      if (action === "logout" && upstream.status === 401)
        response.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
      return response;
    }
    const response = NextResponse.json(
      { ok: true, ...(data.user ? { user: data.user } : {}) },
      { headers: { "Cache-Control": "no-store" } },
    );
    if (data.challenge)
      response.cookies.set(
        CHALLENGE_COOKIE,
        data.challenge,
        cookieOptions(data.expires_in),
      );
    if (data.access_token) {
      response.cookies.set(
        SESSION_COOKIE,
        data.access_token,
        cookieOptions(data.expires_in),
      );
      response.cookies.set(CHALLENGE_COOKIE, "", cookieOptions(0));
    }
    if (action === "logout") {
      response.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
      response.cookies.set(CHALLENGE_COOKIE, "", cookieOptions(0));
    }
    return response;
  } catch {
    return NextResponse.json(
      { error: "Authentication is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}
