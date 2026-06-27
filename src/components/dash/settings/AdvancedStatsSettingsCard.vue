<script setup lang="ts">
import { ZapIcon } from '@lucide/vue'
import { useRouteParams } from '@vueuse/router'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

import { SettingCard } from '@/components'
import { Switch } from '@/components/ui'
import { useAnalytics, useBot, useLoading } from '@/composables'

const { t } = useI18n()

const botId = useRouteParams<string>('id')
const { bot, toggleAdvancedStats } = useBot(botId)
const { isLoading, withLoading } = useLoading()

const advancedStats = ref<boolean>(bot.value?.advancedStats ?? false)

watch(advancedStats, async () => {
  await withLoading(async () => {
    await toggleAdvancedStats()
      .then(() => {
        useAnalytics().capture('advanced_stats_toggled', {
          enabled: advancedStats.value,
          bot_id: botId.value,
        })
        if (advancedStats.value)
          toast.success(t('pages.dash.settings.general.advancedStats.toasts.enabled'))
        else
          toast.success(t('pages.dash.settings.general.advancedStats.toasts.disabled'), {
            description: t('pages.dash.settings.general.advancedStats.toasts.disabledDescription'),
          })
      })
      .catch((err) => toast.error(err.message))
  })
})
</script>

<template>
  <SettingCard
    :title="$t('pages.dash.settings.general.advancedStats.title')"
    :icon="ZapIcon"
    :description="
      $t('pages.dash.settings.general.advancedStats.description', { username: bot!.username })
    "
  >
    <template #actions>
      <Switch v-model:model-value="advancedStats" :disabled="isLoading" />
    </template>
  </SettingCard>
</template>
