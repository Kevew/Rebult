import CommentsSection from '@/components/CommentsSection';
import EditorOutput from '@/components/EditorOutput';
import PostVoteServer from '@/components/post-vote/PostVoteServer';
import { buttonVariants } from '@/components/ui/Button';
import { db } from '@/lib/db';
import { formatTimeToNow } from '@/lib/utils';
import { Post, User, Vote } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

interface PageProps {
    params: {
        postId: string,
    }
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const page = async ({ params }: PageProps) => {
    
    const post = await db.post.findFirst({
            where: {
                id: params.postId,
            },
            include: {
                votes: true,
                author: true,
            },
    }) as (Post & { votes: Vote[]; author: User });

    return(
        <div>
            <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
                <Suspense fallback={<PostVoteShell />}>
                    {/* @ts-expect-error server component */}
                    <PostVoteServer postId={post?.id ?? cachedPost.id} 
                    getData={async () => {
                        return await db.post.findUnique({
                            where: {
                                id: params.postId
                            },
                            include: {
                                votes: true,
                            }
                        })
                    }}/>
                </Suspense>
                
                <div className='sm:w-0 w-full flex-1 bg-white p-4 rounded-sm'>
                    
                    <p className='max-h-40 mt-1 truncate text-xs text-gray-500'>
                        Posted by u/{post.author.username ?? post.author.username}{' '}
                        {formatTimeToNow(new Date(post?.createdAt ?? post.createdAt))}
                    </p>
                    <h1 className='text-xl font-semibold py-2 leading-6 text-gray-900'>
                        {post?.title ?? post.title}
                    </h1>

                    <EditorOutput content={post.content ?? post.content} />
                    <Suspense
                        fallback={
                            <Loader2 className='h-5 w-5 animate-spin text-zinc-500' />
                        }>
                        {/* @ts-ignore-error */}
                        <CommentsSection postId={post?.id ?? cachedPost.id} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

function PostVoteShell() {
        return (
            <div className='flex items-center flex-col pr-6 w-20'>
                    {/* upvote */}
                    <div className={buttonVariants({ variant: 'ghost' })}>
                        <ArrowBigUp className='h-5 w-5 text-zinc-700' />
                    </div>
            
                    {/* score */}
                    <div className='text-center py-2 font-medium text-sm text-zinc-900'>
                        <Loader2 className='h-3 w-3 animate-spin' />
                    </div>
            
                    {/* downvote */}
                    <div className={buttonVariants({ variant: 'ghost' })}>
                        <ArrowBigDown className='h-5 w-5 text-zinc-700' />
                    </div>
            </div>
        )
  }

export default page;