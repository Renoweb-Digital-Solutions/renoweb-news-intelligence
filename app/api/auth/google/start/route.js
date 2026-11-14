import { NextResponse } from "next/server";
import {
  backend,
  cookieOptions,
  FLOW_COOKIE,
  validOrigin,
} from "@/lib/server/backend";

// # A same-origin POST starts OAuth; the authorization URL contains only public OAuth parameters.
export async function POST(request) {
  if (!validOrigin(request))
    return NextResponse.json(
      { error: "Request origin is not allowed" },
      { status: 403 },
    );
  try {
    const result = await backend("/auth/google/start", {
      method: "POST",
      body: {},
      request,
    });
    const data = await result.json();
    if (!result.ok)
      return NextResponse.json(
        {
          error:
            typeof data.detail === "string"
              ? data.detail
              : "Google sign-in is unavailable",
        },
        { status: result.status },
      );
    const response = NextResponse.json(
      { url: data.url },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set(FLOW_COOKIE, data.flow, cookieOptions(600));
    return response;
  } catch {
    return NextResponse.json(
      { error: "Google sign-in is temporarily unavailable" },
      { status: 503 },
    );
  }
}
