import * as z from 'zod'

function isValidSnowflake(id: string) {
  try {
    const value = BigInt(id)
    Number((value >> 22n) % 6n)
    return true
  } catch {
    return false
  }
}

export const addBotSchema = z.object({
  botId: z.string('Expected string value').refine(isValidSnowflake, 'Invalid Discord ID'),
  acceptTos: z.boolean().refine((value) => value === true, 'You must accept the conditions'),
})
