<script setup lang="ts">
import { ExternalLinkIcon, TriangleAlertIcon } from '@lucide/vue'
import { useRouteParams } from '@vueuse/router'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

import { BotDashLayout, ProviderSettingsCard, VotesWebhookSettingsCard } from '@/components'
import { Button, Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui'
import { useBot, useLoading } from '@/composables'
import type { VotesProvider } from '@/utils/types'
import { votesProviders } from '@/utils/votesProviders'

const botId = useRouteParams<string>('id')
const { fetch: fetchBot } = useBot(botId)
const { isLoading, withLoading } = useLoading()

const providerAvailability = ref<VotesProvider[]>([])

const listingProviders = computed(() =>
  Object.entries(votesProviders).filter(([, provider]) => provider.listing),
)

// The cards read the providers config from the store, so make sure the full bot is loaded
watch(
  botId,
  async (id) => {
    if (id) await fetchBot().catch((err) => toast.error(err.message))
  },
  { immediate: true },
)

watch(
  botId,
  async (id) => {
    providerAvailability.value = []

    await withLoading(async () => {
      for (const [provider, data] of listingProviders.value) {
        const res = await fetch(
          `https://proxy.discordanalytics.xyz/get?url=${encodeURIComponent(data.listing!.botPage(botId.value))}`,
          {
            method: 'GET',
            cache: 'force-cache',
          },
        )

        // Another scan started for a different bot — drop this one
        if (id !== botId.value) return

        if (await data.listing!.isAvailable(res))
          providerAvailability.value.push(provider as VotesProvider)
      }
    })
  },
  { immediate: true },
)
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
        v-if="!isLoading && providerAvailability.length < listingProviders.length"
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
                v-for="[provider, data] in listingProviders.filter(
                  ([key]) => !providerAvailability.includes(key as VotesProvider),
                )"
                :key="provider"
              >
                <a :href="data.listing!.submitPage" target="_blank">
                  <Button variant="link" size="xs" class="">
                    {{ data.name }}
                    <ExternalLinkIcon />
                  </Button>
                </a>
              </li>
            </ul>
          </ItemDescription>
        </ItemContent>
      </Item>

      <ProviderSettingsCard
        v-for="[provider] in Object.entries(votesProviders)"
        :id="provider as VotesProvider"
        :key="provider"
      />
    </main>
  </BotDashLayout>
</template>
