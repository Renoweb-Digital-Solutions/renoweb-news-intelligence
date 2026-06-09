export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/healthz`, {
            method: "GET",
            cache: "no-store",
        });

        if (!res.ok) {
            const errorText = await res.text();
            return Response.json({ error: "Backend error", status: res.status, details: errorText }, { status: res.status });
        }

        const data = await res.json();
        return Response.json(data);
    } catch (error) {
        console.error("Unexpected error in health route:", error);
        return Response.json({ error: "Internal server error", details: error.message }, { status: 500 });
    }
}
