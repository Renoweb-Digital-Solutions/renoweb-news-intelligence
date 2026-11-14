import { proxyResearch } from "@/lib/server/backend";

// # Shared gateway enforces the session, origin checks and private backend credentials.
export async function POST(request) {
  return proxyResearch(request, "/v1/keywords/suggest", "POST");
}
