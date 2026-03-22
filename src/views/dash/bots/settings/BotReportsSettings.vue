<script setup lang="ts">
import BotDashLayout from '@/components/layouts/BotDashLayout.vue'
import SettingCard from '@/components/dash/SettingCard.vue'
import { Calendar1Icon, CalendarRangeIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useRouteParams } from '@vueuse/router'
import { useBotEmailReports, useCurrentUser } from '@/composables'
import { onMounted, ref } from 'vue'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'vue-sonner'

const botId = useRouteParams<string>('id')
const {
  reports,
  fetch: fetchReports,
  create: createReport,
  remove: removeReport,
} = useBotEmailReports(botId)
const { userInfos } = useCurrentUser()

const isLoading = ref<boolean>(false)

async function onSubscribe(frequency: 'weekly' | 'monthly') {
  isLoading.value = true
  await createReport(frequency).catch((err) => toast.error(err.message))
  isLoading.value = false
}

async function onUnsubscribe(frequency: 'weekly' | 'monthly') {
  isLoading.value = true
  await removeReport(frequency).catch((err) => toast.error(err.message))
  isLoading.value = false
}

onMounted(async () => {
  if (reports.value.length === 0) {
    isLoading.value = true
    await fetchReports()
    isLoading.value = false
  }
})
</script>

<template>
  <BotDashLayout>
    <main class="grid grid-cols-1 gap-4 my-8">
      <SettingCard
        title="Weekly Reports"
        :icon="CalendarRangeIcon"
        description="Stats reports each week in your mailbox"
      >
        <template #actions>
          <Button
            v-if="!reports.find((r) => r.frequency === 'weekly' && r.userId === userInfos!.userId)"
            :disabled="isLoading"
            class="w-full md:w-fit"
            @click="onSubscribe('weekly')"
          >
            <Spinner v-if="isLoading" />
            Subscribe
          </Button>
          <Button
            v-else
            :disabled="isLoading"
            class="w-full md:w-fit"
            @click="onUnsubscribe('weekly')"
          >
            <Spinner v-if="isLoading" />
            Unsubscribe
          </Button>
        </template>
      </SettingCard>

      <SettingCard
        title="Monthly Reports"
        :icon="Calendar1Icon"
        description="Stats reports each month in your mailbox"
      >
        <template #actions>
          <Button
            v-if="!reports.find((r) => r.frequency === 'monthly' && r.userId === userInfos!.userId)"
            :disabled="isLoading"
            class="w-full md:w-fit"
            @click="onSubscribe('monthly')"
          >
            <Spinner v-if="isLoading" />
            Subscribe
          </Button>
          <Button
            v-else
            :disabled="isLoading"
            class="w-full md:w-fit"
            @click="onUnsubscribe('monthly')"
          >
            <Spinner v-if="isLoading" />
            Unsubscribe
          </Button>
        </template>
      </SettingCard>
    </main>
  </BotDashLayout>
</template>
