import * as z from 'zod'

function isValidSnowflake(id: string) {
  const snowflake = BigInt(id)
  return snowflake > 0n && snowflake < 1n << 63n
}

export const addBotSchema = z.object({
  botId: z.string('Expected string value').refine(isValidSnowflake, 'Invalid Discord ID'),
  acceptTos: z.boolean().refine((value) => value === true, 'You must accept the conditions'),
})
