import * as z from 'zod'

export const addBotSchema = z.object({
  botId: z.string('Expected string value').regex(/^[0-9]{17,}$/, 'Invalid Discord ID'),
  acceptTos: z.boolean().refine((value) => value === true, 'You must accept the conditions'),
})
