import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostHighlightVoteValidator } from '@/lib/validators/highlightVote';
import { z } from 'zod';

export async function PATCH(req: Request) {
    try {
        const body = await req.json();

        const { highlightID, voteType } = PostHighlightVoteValidator.parse(body);

        const session = await getAuthSession();

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 });
        }

        // check if user has already voted on this post
        const existingVote = await db.highlightVote.findFirst({
            where: {
                userId: session.user.id,
                highlightID,
            },
        });

        const highlight = await db.highlight.findUnique({
            where: {
                id: highlightID,
            },
            include: {
                author: true,
                votes: true,
            },
        });

        if (!highlight) {
            return new Response('Highlight not found', { status: 404 });
        }

        if (existingVote) {
            // if vote type is the same as existing vote, delete the vote
            if (existingVote.type === voteType) {
                await db.highlightVote.delete({
                    where: {
                        userId_highlightID: {
                            highlightID,
                            userId: session.user.id,
                        },
                    },
                });

                return new Response('OK');
            }

            // if vote type is different, update the vote
            await db.highlightVote.update({
                where: {
                    userId_highlightID: {
                        highlightID,
                        userId: session.user.id,
                    },
                },
                    data: {
                        type: voteType,
                    },
                }
            );

            return new Response('OK');
        }

        // if no existing vote, create a new vote
        await db.highlightVote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                highlightID,
            },
        });

        return new Response('OK')
    } catch (error) {
        (error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 })
        };

        return new Response(
            'Could not update highlight vote. Please try later',
            { status: 500 }
        );
    }
}