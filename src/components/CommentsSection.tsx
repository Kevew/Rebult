import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import PostComment from './ui/PostComment';
import CreateComment from './CreateComment';

interface CommentsSectionProps {
  postId: string,
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
    const session = await getAuthSession();

    const comments = await db.comment.findMany({
        where: {
            postId,
            replyToId: null,
        },
        include: {
            author: true,
            replies: {
                include: {
                    // @ts-ignore
                    author: true,
                }
            }
        }
    })

    return (
        <div className='flex flex-col gap-y-4 mt-4'>
            <hr className='w-full h-px my-6' />

            <CreateComment />

            <div className='flex flex-col gap-y-6 mt-4'>
                {comments
                .filter((comment) => !comment.replyToId)
                .map((topLevelComment) => {
                    // @ts-ignore
                    const topLevelCommentVotesAmt = topLevelComment.votes.reduce((acc, vote) => {
                        if (vote.type === 'UP') return acc + 1
                        if (vote.type === 'DOWN') return acc - 1
                        return acc;
                    }, 0);

                    // @ts-ignore
                    const topLevelCommentVote = topLevelComment.votes.find((vote) => 
                        vote.userId === session?.user.id
                    );


                    return (
                    <div key={topLevelComment.id} className='flex flex-col'>
                        <div className='mb-2'>
                            { /* @ts-ignore */ }
                            <PostComment comment={topLevelComment} />
                        </div>
                    </div>)
                })}
            </div>
        </div>
    )
}

export default CommentsSection;