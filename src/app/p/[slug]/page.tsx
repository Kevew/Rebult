import MiniCreatePost from '@/components/MiniCreatePost';
import PostFeed from '@/components/PostFeed';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

import { PaperDisplay } from '@/components/PaperDisplay'

interface pageProps {
    params: {
        slug: string,
    }
};

const page = async ({params}: pageProps) => {

    const {slug} = params;

    const session = await getAuthSession();

    const paper = await db.paper.findFirst({
        where: {name: slug},
        include: {
            subreddits: {
                include: {
                    Creator: true,
                    paper: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },

                take: INFINITE_SCROLLING_PAGINATION_RESULTS,
            },
        },
    })

    if(!paper) return notFound()

    return(
        <>
            <h1>{paper.name}</h1>
            <PaperDisplay name={paper.name} pdf={paper.pdf}/>
        </>
    )
}

export default page;