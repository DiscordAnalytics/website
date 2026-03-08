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

const route = useRoute()
const { bot } = useBot(route.query.botId as string)
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
          <Button> {{ $t('pages.dash.onboarding.stepFour.goToDashboard') }} </Button>
        </RouterLink>
      </EmptyContent>
    </EmptyHeader>
  </Empty>
</template>
