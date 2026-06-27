<script setup lang="ts">
import { PartyPopperIcon } from '@lucide/vue'
import { useRouteQuery } from '@vueuse/router'
import { useRoute } from 'vue-router'

import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui'
import { useBot } from '@/composables'

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
