import * as z from 'zod'

function isValidSnowflake(id: string) {
  const snowflake = BigInt(id)
  return snowflake > 0n && snowflake < 1n << 63n
}

export const addBotSchema = z.object({
  botId: z.string('Expected string value').refine(isValidSnowflake, 'Invalid Discord ID'),
  acceptTos: z.boolean().refine((value) => value === true, 'You must accept the conditions'),
})

export const createCustomEventSchema = z
  .object({
    eventKey: z
      .string('Please enter a valid event key!')
      .min(3, 'The event key must be at least 3 characters long.'),
    graphName: z
      .string('Please enter a valid graph name!')
      .min(3, 'The chart name must be at least 3 characters long.'),
    defaultMode: z.enum(['previous_hour', 'fixed']),
    defaultValue: z.int32('Please enter a valid number!').optional(),
  })
  .refine(
    (data) =>
      data.defaultMode === 'previous_hour' ||
      (data.defaultMode === 'fixed' &&
        data.defaultValue !== undefined &&
        data.defaultValue !== null),
    {
      message: 'A default value is required when using a fixed value.',
      path: ['defaultValue'],
    },
  )

export const editCustomEventSchema = z.object({
  graphName: z
    .string('Please enter a valid graph name!')
    .min(3, 'The chart name must be at least 3 characters long.'),
})
