import { z } from 'zod';

export const PostHighlightVoteValidator = z.object({
    highlightID: z.string(),
    voteType: z.enum(['UP', 'DOWN']),
})

export type HighlightPostVoteRequest = z.infer<typeof PostHighlightVoteValidator>

export const HighlightCommentVoteValidator = z.object({
    commentId: z.string(),
    voteType: z.enum(['UP', 'DOWN']),
})

export type HighlightCommentVoteRequest = z.infer<typeof HighlightCommentVoteValidator>