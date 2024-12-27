import { db } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const highlightID = url.searchParams.get('highlightID');

        if (!highlightID) {
            return new Response('Highlight ID is required', { status: 400 });
        }

        // Fetch the comments for the given highlight
        const comments = await db.highlightComment.findMany({
            where: {
                highlightID,
            },
            include: {
                author: true, 
                replies: {
                    include: {
                        author: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        if (!comments.length) {
            return new Response('No comments found for this highlight', { status: 404 });
        }

        return new Response(JSON.stringify(comments), { status: 200 });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return new Response('Could not fetch comments', { status: 500 });
    }
}