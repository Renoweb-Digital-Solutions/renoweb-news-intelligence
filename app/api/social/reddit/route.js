export async function POST(req) {
    try {
        const body = await req.json();

        let retries = 3;
        let res;
        let lastError;

        while (retries > 0) {
            try {
                res = await fetch(
                    `${process.env.BACKEND_URL}/v2/reddit/search`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body),
                    }
                );
                break;
            } catch (error) {
                lastError = error;
                retries--;
                if (retries > 0) {
                    console.log(`Fetch to backend failed, retrying... (${retries} attempts left). Error: ${error.message}`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }

        if (!res) {
            console.error("All fetch attempts failed:", lastError);
            return Response.json({ error: "Failed to connect to backend", details: lastError?.message }, { status: 504 });
        }

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Backend returned ${res.status}:`, errorText);
            return Response.json({ error: "Backend error", status: res.status, details: errorText }, { status: res.status });
        }

        const data = await res.json();
        return Response.json(data);
    } catch (error) {
        console.error("Unexpected error in reddit route:", error);
        return Response.json({ error: "Internal server error", details: error.message }, { status: 500 });
    }
}
