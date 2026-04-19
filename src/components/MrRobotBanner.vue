<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocalStorage } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-vue-next'

const i18n = useI18n()
const maskedPopups = useLocalStorage<string[]>('maskedPopups', [])
</script>

<template>
  <div
    v-if="i18n.locale.value === 'fr' && !maskedPopups.includes('mrrobot')"
    class="flex items-center justify-between flex-col md:flex-row p-4 rounded bg-[#311839] bg-linear-to-br from-[#80305f] to-[#56185e]"
  >
    <div class="flex items-center gap-4">
      <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
      <img
        src="https://r2.discordanalytics.xyz/images/avatars/mrrobot.webp"
        alt="Mr. Robot"
        class="h-16"
      />
      <div>
        <h3 class="text-white text-4xl font-mrrobot">Mr. Robot</h3>
        <p class="text-white">Robot Discord français de modération et de logs</p>
      </div>
    </div>
    <div class="flex items-center gap-4 flex-col md:flex-row w-full md:w-auto">
      <a
        href="https://mrrobot.app/?utm_source=link&utm_medium=banner&utm_term=DiscordAnalytics%2Cwebsite&utm_content=banner_partner_DiscordAnalytics&utm_campaign=Discord analytics"
        target="_blank"
        class="w-full md:w-fit mt-4 md:mt-0"
      >
        <Button variant="secondary" class="w-full">Plus d'informations</Button>
      </a>
      <XIcon
        class="text-secondary cursor-pointer hidden md:block"
        @click="maskedPopups.push('mrrobot')"
      />
      <Button
        variant="ghost"
        class="text-white block md:hidden w-full"
        @click="maskedPopups.push('mrrobot')"
      >
        Fermer
      </Button>
    </div>
    <!-- eslint-enable @intlify/vue-i18n/no-raw-text-->
  </div>
</template>

<style scoped></style>
