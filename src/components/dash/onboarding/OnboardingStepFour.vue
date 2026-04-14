<script setup lang="ts">
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { PartyPopperIcon } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useBot } from '@/composables'
import { useRouteQuery } from '@vueuse/router'

const route = useRoute()
const botId = useRouteQuery<string>('botId', '')
const { bot } = useBot(botId)
</script>

<template>
  <Empty v-if="bot" class="h-full">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <PartyPopperIcon />
      </EmptyMedia>
      <EmptyTitle>{{ $t('pages.dash.onboarding.stepFour.title') }}</EmptyTitle>
      <EmptyDescription>
        {{ $t('pages.dash.onboarding.stepFour.description') }}
      </EmptyDescription>
      <EmptyContent>
        <RouterLink :to="`/dash/bots/${route.query.botId}`">
          <Button>{{ $t('pages.dash.onboarding.stepFour.goToDashboard') }}</Button>
        </RouterLink>
      </EmptyContent>
    </EmptyHeader>
  </Empty>
</template>
