<script setup lang="ts">
import { Calendar1Icon, CalendarRangeIcon } from '@lucide/vue'
import { useRouteParams } from '@vueuse/router'
import { watch } from 'vue'
import { toast } from 'vue-sonner'

import { BotDashLayout, SettingCard } from '@/components'
import { Button, Spinner } from '@/components/ui'
import { useAnalytics, useBotEmailReports, useCurrentUser, useLoading } from '@/composables'

const botId = useRouteParams<string>('id')
const {
  reports,
  fetch: fetchReports,
  create: createReport,
  remove: removeReport,
} = useBotEmailReports(botId)
const { userInfos } = useCurrentUser()
const { isLoading, withLoading } = useLoading()

async function onSubscribe(frequency: 'weekly' | 'monthly') {
  await withLoading(async () => {
    await createReport(frequency)
      .then(() =>
        useAnalytics().capture('email_reports_subscribed', { frequency, bot_id: botId.value }),
      )
      .catch((err) => toast.error(err.message))
  })
}

async function onUnsubscribe(frequency: 'weekly' | 'monthly') {
  await withLoading(async () => {
    await removeReport(frequency)
      .then(() =>
        useAnalytics().capture('email_reports_unsubscribed', { frequency, bot_id: botId.value }),
      )
      .catch((err) => toast.error(err.message))
  })
}

watch(
  botId,
  async () => {
    if (reports.value.length === 0) {
      await withLoading(async () => {
        await fetchReports()
      })
    }
  },
  { immediate: true },
)
</script>

<template>
  <BotDashLayout>
    <main class="grid grid-cols-1 gap-4 my-8">
      <SettingCard
        :title="$t('pages.dash.settings.reports.weekly.title')"
        :icon="CalendarRangeIcon"
        :description="$t('pages.dash.settings.reports.weekly.description')"
      >
        <template #actions>
          <Button
            v-if="!reports.find((r) => r.frequency === 'weekly' && r.userId === userInfos!.userId)"
            :disabled="isLoading"
            class="w-full md:w-fit"
            @click="onSubscribe('weekly')"
          >
            <Spinner v-if="isLoading" />
            {{ $t('pages.dash.settings.reports.subscribe') }}
          </Button>
          <Button
            v-else
            :disabled="isLoading"
            class="w-full md:w-fit"
            @click="onUnsubscribe('weekly')"
          >
            <Spinner v-if="isLoading" />
            {{ $t('pages.dash.settings.reports.unsubscribe') }}
          </Button>
        </template>
      </SettingCard>

      <SettingCard
        :title="$t('pages.dash.settings.reports.monthly.title')"
        :icon="Calendar1Icon"
        :description="$t('pages.dash.settings.reports.monthly.description')"
      >
        <template #actions>
          <Button
            v-if="!reports.find((r) => r.frequency === 'monthly' && r.userId === userInfos!.userId)"
            :disabled="isLoading"
            class="w-full md:w-fit"
            @click="onSubscribe('monthly')"
          >
            <Spinner v-if="isLoading" />
            {{ $t('pages.dash.settings.reports.subscribe') }}
          </Button>
          <Button
            v-else
            :disabled="isLoading"
            class="w-full md:w-fit"
            @click="onUnsubscribe('monthly')"
          >
            <Spinner v-if="isLoading" />
            {{ $t('pages.dash.settings.reports.unsubscribe') }}
          </Button>
        </template>
      </SettingCard>
    </main>
  </BotDashLayout>
</template>
