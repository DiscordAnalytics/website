<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'

import {
  AdvancedStatsSettingsCard,
  BotDashLayout,
  TeamSettingsCard,
  TokenSettingsCard,
} from '@/components'
import { useBot } from '@/composables'

const botId = useRouteParams<string>('id')
const { bot } = useBot(botId)
</script>

<template>
  <BotDashLayout>
    <main v-if="bot" class="grid grid-cols-1 gap-4 my-8">
      <TokenSettingsCard />

      <TeamSettingsCard />

      <AdvancedStatsSettingsCard />
    </main>
  </BotDashLayout>
</template>
