export async function POST(req) {
    const body = await req.json();

    const res = await fetch(
        "http://72.62.247.229:8000/v1/keywords/suggest",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );

    const data = await res.json();

    return Response.json(data);
}