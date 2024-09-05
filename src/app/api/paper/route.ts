import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PaperValidator } from '@/lib/validators/paper'
import { z } from 'zod'

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        // Is the user logged in
        if (!session?.user) {
        return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json();
        const { name, pdf } = PaperValidator.parse(body);

        // check if subreddit already exists
        const subredditExists = await db.paper.findFirst({
        where: {
            name,
        },
        })

        // If the subreddit exists then return immediately
        if (subredditExists) {
        return new Response('Subreddit already exists', { status: 409 })
        }

        const subreddit = await db.subreddit.create({
            data: {
                name
            }
        })
        const paper = await db.paper.create({
            data: {
                pdf,
                name,
                creatorId: session.user.id,
                subredditId: subreddit.id
            },
        })

        return new Response(paper.name)
    } catch (error) {
        if (error instanceof z.ZodError) {
        return new Response(error.message, { status: 422 })
        }

        return new Response('Could not create paper', { status: 500 })
    }
}