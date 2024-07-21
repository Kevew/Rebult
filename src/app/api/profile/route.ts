import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { aboutMeDescriptionValidator } from '@/lib/validators/aboutMe';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        // Is the user logged in
        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json();
        const { description } = aboutMeDescriptionValidator.parse(body);

        if(typeof session.user.username == null){
            return new Response('Unauthorized', { status: 401 });
        }

        let username: string | undefined = session.user.username!;

        // create subreddit and associate it with the user
        const descriptionUpdate = await db.user.update({
            where: {
                username: username,
            },
            data: {
                aboutMeDescription: description,
            },
        })

        return new Response(descriptionUpdate.name);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }

        return new Response('Could not update description', { status: 500 })
    }
}