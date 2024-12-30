import { db } from "@/lib/db";

export async function GET(req: Request){
    const url = new URL(req.url);
    const q = url.searchParams.get('q');

    if(!q){
        return new Response('Invalid query', { status: 400 });
    }

    const results = await db.paper.findMany({
        where: {
            name: {
                startsWith: q,
            }
        },
        take: 5,
    });

    return new Response(JSON.stringify(results));
}