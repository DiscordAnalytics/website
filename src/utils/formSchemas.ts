import * as z from 'zod'
import type { BotAchievementType } from '@/utils/types.ts'

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

export const createAchievementFormSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'Please enter a valid title!' : 'Not a string',
    })
    .min(5, 'The title of the achievement must be at least 5 characters long.'),
  description: z
    .string()
    .min(10, 'The description of the achievement must be at least 10 characters long.'),
  type: z.string().refine((str) => !!(str as BotAchievementType), 'Invalid achievement type!'),
  objective: z.number().refine((num) => num > 0, 'The number must be greater than 0!'),
})

export const shareAchievementFormSchema = z.object({
  lang: z.string(),
  sure: z.boolean().refine((bool) => bool === true, 'You need to check this!'),
})

export const editAchievementFormSchema = z.object({
  title: z
    .string('Please enter a valid title!')
    .min(5, 'The title of the achievement must be at least 5 characters long.'),
  description: z
    .string('Please enter a valid description!')
    .min(10, 'The description of the achievement must be at least 10 characters long.'),
  sure: z.boolean().refine((bool) => bool === true, 'You need to check this!'),
})
