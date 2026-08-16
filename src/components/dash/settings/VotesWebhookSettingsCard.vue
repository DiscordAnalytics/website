<script setup lang="ts">
import { WebhookIcon } from '@lucide/vue'
import { useRouteParams } from '@vueuse/router'
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'

import { SettingCard } from '@/components'
import { Button, Input, Spinner } from '@/components/ui'
import { useAnalytics, useBot, useLoading } from '@/composables'

const botId = useRouteParams<string>('id')
const { bot, updateVotesWebhook, testVotesWebhook } = useBot(botId)
const { isLoading, withLoading } = useLoading()

const webhookUrl = ref<string>(bot.value?.webhooksConfig?.webhookUrl ?? '')

// The bot is refetched once the page opens, so pick the URL up unless it's being edited
watch(
  () => bot.value?.webhooksConfig?.webhookUrl,
  (url, previousUrl) => {
    if (webhookUrl.value === (previousUrl ?? '')) webhookUrl.value = url ?? ''
  },
)

async function sendTest() {
  await withLoading(async () => {
    await testVotesWebhook()
      .then(() => {
        toast.success('Votes webhook updated successfully.')
      })
      .catch((err) => toast.error(err.message))
  })
  toast.success('Test webhook sent successfully.')
}

async function update() {
  await withLoading(async () => {
    if ((bot.value?.webhooksConfig.webhookUrl ?? '') !== webhookUrl.value)
      await updateVotesWebhook(webhookUrl.value)
        .then(() => {
          useAnalytics().capture('votes_webhook_updated', { bot_id: botId.value })
          toast.success('Votes webhook updated successfully.')
        })
        .catch((err) => toast.error(err.message))
  })
}
</script>

<template>
  <SettingCard
    :title="$t('pages.dash.settings.votes.webhook.title')"
    :icon="WebhookIcon"
    :description="$t('pages.dash.settings.votes.webhook.description', { username: bot!.username })"
    learn-more-link="/docs/get-started/votes-integration"
  >
    <template #content>
      <div class="flex items-center gap-2 w-full flex-col md:flex-row">
        <Input
          v-model:model-value="webhookUrl"
          placeholder="https://mybot.app/discord-analytics-endpoint"
          :disabled="isLoading"
        />
        <div class="flex items-center gap-2 w-full md:w-fit">
          <Button variant="secondary" :disabled="isLoading || !webhookUrl" @click="sendTest">
            <Spinner v-if="isLoading" />
            {{ $t('pages.dash.settings.votes.webhook.sendTest') }}
          </Button>
          <Button :disabled="isLoading" class="w-full md:w-fit" @click="update">
            <Spinner v-if="isLoading" />
            {{ $t('pages.dash.settings.votes.webhook.save') }}
          </Button>
        </div>
      </div>
    </template>
  </SettingCard>
</template>
