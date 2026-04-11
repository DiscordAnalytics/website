import * as z from 'zod'
import type { BotAchievementType } from '@/utils/types.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

function isValidSnowflake(id: string) {
  try {
    const snowflake = BigInt(id)
    return snowflake > 0n && snowflake < 1n << 63n
  } catch {
    return false
  }
}

function boolField(prefix: string) {
  return z
    .boolean({
      error: (issue) =>
        issue.input === undefined ? t(`${prefix}.required`) : t(`${prefix}.invalid_type`),
    })
    .refine((value) => value === true, { error: t(`${prefix}.must_be_true`) })
}

export const addBotSchema = z.object({
  botId: z
    .string({
      error: (issue) =>
        issue.input === undefined ? t('addBot.botId.required') : t('addBot.botId.invalid_type'),
    })
    .refine(isValidSnowflake, { error: t('addBot.botId.invalid_snowflake') }),
  acceptTos: boolField('addBot.acceptTos'),
})

export const createCustomEventSchema = z
  .object({
    eventKey: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return t('createCustomEvent.eventKey.required')
          else return t('createCustomEvent.eventKey.invalid_type')
        },
      })
      .min(3, { error: t('createCustomEvent.eventKey.too_short') }),
    graphName: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return t('createCustomEvent.graphName.required')
          else return t('createCustomEvent.graphName.invalid_type')
        },
      })
      .min(3, { error: t('createCustomEvent.graphName.too_short') }),
    defaultMode: z.enum(['previous_hour', 'fixed']),
    defaultValue: z
      .int32({
        error: () => t('createCustomEvent.defaultValue.invalid_type'),
      })
      .optional(),
  })
  .refine(
    (data) =>
      data.defaultMode === 'previous_hour' ||
      (data.defaultMode === 'fixed' &&
        data.defaultValue !== undefined &&
        data.defaultValue !== null),
    {
      error: t('createCustomEvent.defaultValue.required_for_fixed'),
      path: ['defaultValue'],
    },
  )

export const editCustomEventSchema = z.object({
  graphName: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return t('editCustomEvent.graphName.required')
        else return t('editCustomEvent.graphName.invalid_type')
      },
    })
    .min(3, { error: t('editCustomEvent.graphName.too_short') }),
})

export const createAchievementFormSchema = z.object({
  title: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return t('createAchievement.title.required')
        else return t('createAchievement.title.invalid_type')
      },
    })
    .min(5, { error: t('createAchievement.title.too_short') }),
  description: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return t('createAchievement.description.required')
        else return t('createAchievement.description.invalid_type')
      },
    })
    .min(10, { error: t('createAchievement.description.too_short') }),
  type: z.string().refine((str) => !!(str as BotAchievementType), {
    message: t('createAchievement.type.invalid'),
  }),
  objective: z
    .number()
    .refine((num) => num > 0, { message: t('createAchievement.objective.not_positive') }),
})

export const shareAchievementFormSchema = z.object({
  lang: z.string(),
  sure: boolField('shareAchievement.sure'),
})

export const editAchievementFormSchema = z.object({
  title: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return t('editAchievement.title.required')
        else return t('editAchievement.title.invalid_type')
      },
    })
    .min(5, { error: t('editAchievement.description.too_short') }),
  description: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return t('editAchievement.description.required')
        else return t('editAchievement.description.invalid_type')
      },
    })
    .min(10, { error: t('editAchievement.description.too_short') }),
  sure: boolField('editAchievement.sure'),
})

export const copyAchievementFormSchema = z.object({
  botId: z.string({
    error: (issue) =>
      issue.input === undefined
        ? t('copyAchievement.botId.required')
        : t('copyAchievement.botId.invalid_type'),
  }),
})

export const addTeammateFormSchema = z.object({
  userId: z.string().refine(isValidSnowflake, { error: t('addTeammate.userId.invalid_snowflake') }),
})

export const topggTokenUpdateFormSchema = z.object({
  webhookSecret: z
    .string()
    .optional()
    .refine((value) => !value || new RegExp(/whs_\w/g).test(value), {
      error: t('topggTokenUpdate.webhookSecret.invalid_format'),
    }),
})

export const adminUpdateUserLimitsFormSchema = z.object({
  limit: z
    .number({
      error: t('adminUpdateUserLimits.limit.invalid_type'),
    })
    .min(0, { error: t('adminUpdateUserLimits.limit.invalid_type') }),
  sure: boolField('adminUpdateUserLimits.sure'),
})

export const adminUpdateBotLimitsFormSchema = z.object({
  goalsLimit: z
    .number({
      error: t('adminUpdateBotLimits.goalsLimit.invalid_type'),
    })
    .min(0, { error: t('adminUpdateBotLimits.goalsLimit.invalid_type') }),
  customEventsLimit: z
    .number({
      error: t('adminUpdateBotLimits.customEventsLimit.invalid_type'),
    })
    .min(0, { error: t('adminUpdateBotLimits.customEventsLimit.invalid_type') }),
  teammatesLimit: z
    .number({
      error: t('adminUpdateBotLimits.teammatesLimit.invalid_type'),
    })
    .min(0, { error: t('adminUpdateBotLimits.teammatesLimit.too_small') }),
  sure: boolField('adminUpdateBotLimits.sure'),
})

export const adminAskForReasonFormSchema = z.object({
  reason: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return t('adminAskForReason.reason.required')
        else return t('adminAskForReason.reason.invalid_type')
      },
    })
    .min(5, { error: t('adminAskForReason.reason.too_short') }),
  sure: boolField('adminAskForReason.sure'),
})
