import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { HighlightValidator } from '@/lib/validators/highlight'
import { NewHighlight } from "@argument-studio/react-pdf-highlighter-with-categories"
import { z } from 'zod'

export async function POST(req: Request) {
    try {

        const body = await req.json()

        const { highlight, subredditId } = HighlightValidator.parse(body)
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        // verify user is subscribed to passed subreddit id
        const subscription = await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session.user.id,
            },
        })

        if (!subscription) {
            return new Response('Subscribe to highlight', { status: 403 })
        }

        const temp = await db.highlight.create({
            data: {
                content: highlight.content as any,
                comment: highlight.comment as any,
                position: highlight.position as any,
                authorId: session.user.id,
                subredditId,
            },
        })
        
        return new Response(JSON.stringify({ id: temp.id }));

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 })
        }

        console.log(error)

        return new Response(
            'Could not highlight to subreddit at this time. Please try later',
            { status: 500 }
        )
    }
}