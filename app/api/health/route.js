import { proxyResearch } from "@/lib/server/backend";

// # Shared gateway enforces the session, origin checks and private backend credentials.
export async function GET(request) {
  return proxyResearch(request, "/healthz", "GET");
}
