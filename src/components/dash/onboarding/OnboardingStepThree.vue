<script setup lang="ts">
import { Spinner } from '@/components/ui/spinner'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, TriangleAlertIcon } from 'lucide-vue-next'
import { useBot } from '@/composables'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useRouteQuery } from '@vueuse/router'

const botId = useRouteQuery<string>('botId', '')
const { bot, fetch: fetchBot } = useBot(botId)

const fetchCount = ref(0)
const interval = ref<number | null>(null)

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'exit'): void
}>()

onMounted(() => {
  if (bot.value && bot.value.framework && bot.value.language && bot.value.lastPush) emit('submit')
  else
    interval.value = setInterval(async () => {
      fetchCount.value++
      if (bot.value && (!bot.value.language || !bot.value.framework || !bot.value.lastPush))
        await fetchBot()
      else if (bot.value) {
        fetchCount.value = 0
      }
    }, 10000)
})

function exit() {
  if (interval.value) clearInterval(interval.value)
  emit('exit')
}

watch(bot, (newValue, oldValue) => {
  if (oldValue && newValue) {
    if (!oldValue.lastPush && newValue.lastPush && interval.value) {
      clearInterval(interval.value)
      emit('submit')
    }
  }
})

onBeforeUnmount(() => {
  if (interval.value) clearInterval(interval.value)
})
</script>

<template>
  <div>
    <Alert v-if="fetchCount >= 3" class="mt-4" variant="destructive">
      <TriangleAlertIcon />
      <AlertTitle>{{ $t('pages.dash.onboarding.stepThree.stillNothing.title') }}</AlertTitle>
      <AlertDescription>
        {{ $t('pages.dash.onboarding.stepThree.stillNothing.description') }}
      </AlertDescription>
    </Alert>

    <Empty v-if="bot" class="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle v-if="!bot.language || !bot.framework">
          {{ $t('pages.dash.onboarding.stepThree.waitingForLogin') }}
        </EmptyTitle>
        <EmptyTitle v-else>
          {{ $t('pages.dash.onboarding.stepThree.waitingForStats') }}
        </EmptyTitle>
        <EmptyDescription v-if="!bot.language || !bot.framework">
          {{ $t('pages.dash.onboarding.stepThree.waitingForLoginDescription') }}
        </EmptyDescription>
        <EmptyDescription v-else>
          {{ $t('pages.dash.onboarding.stepThree.waitingForStatsDescription') }}
        </EmptyDescription>
        <EmptyContent>
          <Button variant="outline" @click="exit">
            <ArrowLeftIcon />
            {{ $t('pages.dash.onboarding.stepThree.getBack') }}
          </Button>
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  </div>
</template>
