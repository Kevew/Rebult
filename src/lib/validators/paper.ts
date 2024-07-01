import { string, z } from 'zod'

export const PaperValidator = z.object({
  name: z.string().min(3).max(12),
  pdf: z.string(),
})

export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string(),
})

export type CreateSubredditPayload = z.infer<typeof PaperValidator>
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator>