import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db';
import { HighlightCreateCommentValidator } from '@/lib/validators/highlightComment';
import { z } from 'zod'

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        // Is the user logged in
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json();
        const { highlightId, text, replyToId } = HighlightCreateCommentValidator.parse(body);

        // check if highlight exists
        const highlighExists = await db.highlight.findFirst({
            where: {
                id: highlightId,
            },
        });

        if (!highlighExists) {
            return new Response('Highlight not found', { status: 404 });
        }

        const newComment = await db.highlightComment.create({
            data: {
                content: text, 
                authorId: session.user.id,
                highlightID: highlightId,
                replyToId,
            },
        });

        return new Response(JSON.stringify(newComment), { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }

        return new Response('Could not create comment', { status: 500 })
    }
}