import { ScaledPosition, Comment as PdfComment, Content} from '@argument-studio/react-pdf-highlighter-with-categories';
import { Comment, Post, Subreddit, User, Vote, Highlight } from '@prisma/client';

export type ExtendedPost = Post & {
    subreddit: Subreddit,
    votes: Vote[],
    author: User,
    comments: Comment[],
}

export type ExtendedHighlight = Highlight & {
    position: ScaledPosition,
    content: Content,
    comment: PdfComment
    subreddit: Subreddit,
    author: User,
    id : String
}