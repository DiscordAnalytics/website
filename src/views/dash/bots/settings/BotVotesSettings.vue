<script setup lang="ts">
import BotDashLayout from '@/components/layouts/BotDashLayout.vue'
import { useRouteParams } from '@vueuse/router'
import { useBot } from '@/composables'
import {
  AdvancedStatsSettingsCard,
  TeamSettingsCard,
  TokenSettingsCard,
} from '@/components/dash/settings'

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
