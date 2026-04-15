<script setup lang="ts">
import BotDashLayout from '@/components/layouts/BotDashLayout.vue'
import { VotesWebhookSettingsCard } from '@/components/dash/settings'
import ProviderSettingsCard from '@/components/dash/settings/ProviderSettingsCard.vue'
import { computed, onMounted, ref } from 'vue'
import { useRouteParams } from '@vueuse/router'
import { useLoading } from '@/composables'
import type { VotesProvider } from '@/utils/types.ts'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { ExternalLinkIcon, TriangleAlertIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const botId = useRouteParams<string>('id')
const { isLoading, withLoading } = useLoading()

const providerAvailability = ref<VotesProvider[]>([])

const isNormalProviderApiAvailable = async (res: Response) => {
  if (res.status === 200) {
    const data = await res.json()
    if (data.status.http_code === 200) return true
  }
  return false
}

const providers = computed<{
  [provider: string]: {
    title: string
    botPage: string
    submitPage: string
    isAvailable: (res: Response) => Promise<boolean>
  }
}>(() => ({
  topgg: {
    title: 'Top.gg',
    botPage: `https://top.gg/bot/${botId.value}`,
    submitPage: `https://top.gg/bot/new`,
    isAvailable: isNormalProviderApiAvailable,
  },
  discordscom: {
    title: 'Discords.com',
    botPage: `https://top.gg/bot/${botId.value}`,
    submitPage: `https://discords.com/bots/add`,
    isAvailable: async () => true,
  },
  botlistme: {
    title: 'BotList.me',
    botPage: `https://api.botlist.me/api/v1/bots/${botId.value}`,
    submitPage: `https://botlist.me/add`,
    isAvailable: async (res) => {
      if (res.status === 200) {
        const data = await res.json()
        if (!data.contents.includes('error')) return true
      }
      return false
    },
  },
  discordplace: {
    title: 'Discord.place',
    botPage: `https://api.discord.place/bots/${botId.value}`,
    submitPage: `https://discord.place/account`,
    isAvailable: isNormalProviderApiAvailable,
  },
  dblist: {
    title: 'Discord Bot List',
    botPage: `https://discordbotlist.com/bots/${botId.value}`,
    submitPage: `https://discordbotlist.com/bots/add`,
    isAvailable: isNormalProviderApiAvailable,
  },
}))

onMounted(async () => {
  await withLoading(async () => {
    for (const provider of Object.keys(providers.value)) {
      const res = await fetch(
        `https://proxy.discordanalytics.xyz/get?url=${encodeURIComponent(providers.value[provider]!.botPage)}`,
        {
          method: 'GET',
          cache: 'force-cache',
        },
      )

      if (await providers.value[provider]!.isAvailable(res))
        providerAvailability.value.push(provider as VotesProvider)
    }
  })
})
</script>

<template>
  <BotDashLayout>
    <main class="grid grid-cols-1 gap-4 my-8">
      <VotesWebhookSettingsCard />

      <header class="my-8 mx-8">
        <h1 class="text-4xl font-bold mb-2">
          {{ $t('pages.dash.settings.votes.providers.title') }}
        </h1>
        <p>{{ $t('pages.dash.settings.votes.providers.description') }}</p>
      </header>

      <Item
        v-if="!isLoading && providerAvailability.length < Object.keys(providers).length"
        variant="outline"
        class="border-orange-500"
      >
        <ItemMedia>
          <TriangleAlertIcon class="text-orange-500" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{{ $t('pages.dash.settings.votes.providers.missing.title') }}</ItemTitle>
          <ItemDescription class="line-clamp-none">
            {{ $t('pages.dash.settings.votes.providers.missing.description') }}
            <ul class="list-disc ml-8">
              <li
                v-for="[provider, data] in Object.entries(providers).filter(
                  ([key, value]) => !providerAvailability.includes(key as VotesProvider),
                )"
                :key="provider"
              >
                <a :href="data.submitPage" target="_blank">
                  <Button variant="link" size="xs" class="">
                    {{ data.title }}
                    <ExternalLinkIcon />
                  </Button>
                </a>
              </li>
            </ul>
          </ItemDescription>
        </ItemContent>
      </Item>

      <ProviderSettingsCard
        v-for="[provider, data] in Object.entries(providers)"
        :id="provider as VotesProvider"
        :provider="data.title"
        :key="provider"
      />
    </main>
  </BotDashLayout>
</template>
