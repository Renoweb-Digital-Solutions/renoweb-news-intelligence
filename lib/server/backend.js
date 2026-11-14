import "server-only";
import { cookies } from "next/headers";
import { createHmac } from "node:crypto";

// # __Host- cookies cannot be overwritten by sibling subdomains in production.
const cookiePrefix = process.env.NODE_ENV === "production" ? "__Host-" : "";
export const SESSION_COOKIE = `${cookiePrefix}snooptel_session`;
export const CHALLENGE_COOKIE = `${cookiePrefix}snooptel_challenge`;
export const FLOW_COOKIE = `${cookiePrefix}snooptel_oauth`;

// # Cookies are host-only and inaccessible to JavaScript; production requires HTTPS.
export function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

// # Verify Origin for every mutation, including login, to prevent cross-site session injection.
// # Do not infer the trusted origin from Host or forwarded headers supplied by a browser.
export function validOrigin(request) {
  const expected = process.env.AUTH_FRONTEND_ORIGIN || "http://localhost:3000";
  return request.headers.get("origin") === new URL(expected).origin;
}

// # Backend URLs, service keys, JWTs and provider credentials stay inside this module's boundary.
// # Hash the platform client address if explicitly trusted; otherwise use a shared safe bucket.
export async function backend(
  path,
  { method = "GET", body, request, token, timeout = 60000 } = {},
) {
  const key = process.env.AUTH_INTERNAL_API_KEY;
  if (!key || !process.env.BACKEND_URL)
    throw new Error("Backend configuration missing");
  const session = token ?? (await cookies()).get(SESSION_COOKIE)?.value;
  const trustedHeader = process.env.AUTH_TRUSTED_CLIENT_IP_HEADER;
  const client =
    trustedHeader && request
      ? request.headers.get(trustedHeader) || "shared"
      : "shared";
  return fetch(`${process.env.BACKEND_URL.replace(/\/$/, "")}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-snooptel-key": key,
      "x-client-bucket": createHmac("sha256", key).update(client).digest("hex"),
      ...(session ? { Authorization: `Bearer ${session}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
    signal: AbortSignal.timeout(timeout),
    redirect: "error",
  });
}

// # Ask the backend to validate expiry, revocation and account status on every protected render.
// # Only an explicit 401 means signed out; outages surface as errors rather than redirect loops.
export async function currentUser() {
  if (!(await cookies()).get(SESSION_COOKIE)?.value) return null;
  const response = await backend("/auth/me");
  if (response.status === 401) return null;
  if (!response.ok)
    throw new Error("Authentication service is temporarily unavailable");
  return (await response.json()).user;
}

// # All research handlers share authentication and CSRF checks. Never retry paid mutations.
// # Return safe errors without forwarding upstream response bodies, URLs or stack traces.
export async function proxyResearch(request, path, method = "POST") {
  if (method !== "GET" && !validOrigin(request))
    return Response.json(
      { error: "Request origin is not allowed" },
      { status: 403 },
    );
  if (!(await cookies()).get(SESSION_COOKIE)?.value)
    return Response.json(
      { error: "Please sign in to continue" },
      { status: 401 },
    );
  try {
    const response = await backend(path, {
      method,
      request,
      ...(method === "POST" ? { body: await request.json() } : {}),
      timeout: 300000,
    });
    if (!response.ok) {
      const message =
        response.status === 401
          ? "Your session expired. Please sign in again."
          : response.status === 404
            ? "Research run not found"
            : "Unable to complete your request. Please try again.";
      return Response.json(
        { error: message },
        { status: response.status, headers: { "Cache-Control": "no-store" } },
      );
    }
    return Response.json(await response.json(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { error: "The research service is temporarily unavailable" },
      { status: 503 },
    );
  }
}
