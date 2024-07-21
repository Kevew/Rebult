import { z } from 'zod'

export const aboutMeDescriptionValidator = z.object({
  description: z.string(),
})

export type updateAboutMeRequest = z.infer<typeof aboutMeDescriptionValidator>
