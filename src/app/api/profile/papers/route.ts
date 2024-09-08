import { db } from '@/lib/db';
import { z } from 'zod';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);

        const { id } = z.object({
            id: z.string(),
        })
        .parse({
            id: url.searchParams.get('id'),
        })

        // Find all papers relating to the current user
        const papersUpdate = await db.paper.findMany({
            where: {
                creatorId: id,
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        return new Response(JSON.stringify(papersUpdate));
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }

        return new Response('Could not find papers', { status: 500 })
    }
}