import {z} from 'zod';

// content: highlight.content as any,
// comment: highlight.comment as any,
// position: highlight.position as any,
// authorId: session.user.id,
// subredditId,
export const HighlightValidator = z.object({
    highlight: z.any(),
    subredditId: z.string()
});

export type HighlightCreationRequest = z.infer<typeof HighlightValidator>;