<script setup lang="ts">
import { WebhookIcon } from 'lucide-vue-next'
import SettingCard from '@/components/dash/SettingCard.vue'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useBot, useLoading } from '@/composables'
import { useRouteParams } from '@vueuse/router'
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'

const botId = useRouteParams<string>('id')
const { bot, updateVotesWebhook, testVotesWebhook } = useBot(botId)
const { isLoading, withLoading } = useLoading()

const webhookUrl = ref<string>(bot.value?.webhooksConfig.webhookUrl ?? '')

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
