import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import PostFeed from '../PostFeed'
import { notFound } from 'next/navigation'
import NoPostHomePage from './NoPostHomePage'

const CustomFeed = async () => {
    const session = await getAuthSession()

    // only rendered if session exists, so this will not happen
    if (!session) return notFound()

    const followedCommunities = await db.subscription.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            subreddit: true,
        },
    })

    const posts = await db.post.findMany({
        where: {
            subreddit: {
                name: {
                    in: followedCommunities.map((sub) => sub.subreddit.name),
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            votes: true,
            author: true,
            comments: true,
            subreddit: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    })
    return (
        <>
            {/** @ts-ignore */}
            {posts.length == 0? <NoPostHomePage />: <PostFeed initialPosts={posts}/>}
        </>
    )
}

export default CustomFeed