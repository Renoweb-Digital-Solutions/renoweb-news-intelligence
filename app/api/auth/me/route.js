import { NextResponse } from "next/server";
import { currentUser } from "@/lib/server/backend";

export const runtime = "nodejs";

// # Read-only session lookup for the navigation avatar; the backend validates the JWT each time.
export async function GET() {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json(
        { error: "Please sign in to continue" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    return NextResponse.json(
      { user },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Account details are temporarily unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
