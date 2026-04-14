<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/composables'
import { useLocalStorage } from '@vueuse/core'
import PageLayout from '@/components/layouts/PageLayout.vue'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { onMounted } from 'vue'

const router = useRouter()
const { accessibleBots: userBots } = useCurrentUser()
const lastSeenBot = useLocalStorage('lastSeenBot', userBots.value[0] ? userBots.value[0] : '')

function redirect() {
  if (lastSeenBot.value && userBots.value.find((bot) => bot.botId === lastSeenBot.value))
    router.push(`/dash/bots/${lastSeenBot.value}`)
  else if (userBots.value.length > 0) {
    lastSeenBot.value = userBots.value[0]?.botId
    router.push(`/dash/bots/${userBots.value[0]?.botId}`)
  } else router.push('/dash/onboarding')
}

onMounted(() => setTimeout(() => redirect(), 500))
</script>

<template>
  <PageLayout :footer="false">
    <Empty class="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>{{ $t('pages.dash.home.title') }}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  </PageLayout>
</template>
