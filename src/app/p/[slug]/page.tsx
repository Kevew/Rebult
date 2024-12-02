import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

import { PaperDisplay } from '@/components/pdf-highlighter/PaperDisplay'
import { ExtendedHighlight } from '@/types/db';

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
            subreddit: {
                include: {
                    highlights: {
                        include: {
                            author: true,
                            votes: true
                        }
                    }
                }
            }
        }
    })

    if(!paper) return notFound()

    return(
        <div className="h-full w-full mt-12 overflow-y-hidden">
            <h1 className='font-bold text-3xl md:text-4xl h-14'>
                p/{paper.name}
            </h1>
            <hr className='bg-red-500 h-px' />
            <p className='text-lg font-medium'>Associated Subreddit: </p>
            <a
                className='underline text-zinc-900 text-sm underline-offset-2'
                href={`/r/${paper.subreddit.name}`}>
                r/{paper.subreddit.name}
            </a>
            <PaperDisplay name={paper.name} pdf={paper.pdf} initialHighlights={paper.subreddit.highlights as ExtendedHighlight[]} user={session?.user} subreddit={paper.subreddit}/>
        </div>
    )
}

export default page;