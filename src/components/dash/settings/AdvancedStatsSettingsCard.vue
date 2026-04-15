<script setup lang="ts">
import SettingCard from '@/components/dash/SettingCard.vue'
import { ZapIcon } from 'lucide-vue-next'
import { useRouteParams } from '@vueuse/router'
import { useBot, useLoading } from '@/composables'
import { ref, watch } from 'vue'
import { Switch } from '@/components/ui/switch'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const botId = useRouteParams<string>('id')
const { bot, toggleAdvancedStats } = useBot(botId)
const { isLoading, withLoading } = useLoading()

const advancedStats = ref<boolean>(bot.value?.advancedStats ?? false)

watch(advancedStats, async () => {
  await withLoading(async () => {
    await toggleAdvancedStats()
      .then(() => {
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
