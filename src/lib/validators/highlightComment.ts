import { z } from 'zod';

export const HighlightCreateCommentValidator = z.object({
    highlightId: z.string(),
    text: z.string(),
    replyToId: z.string().nullable().optional()
})

export type HighlightCreateCommentRequest = z.infer<typeof HighlightCreateCommentValidator>
