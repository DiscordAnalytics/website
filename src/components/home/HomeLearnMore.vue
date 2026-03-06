<script setup lang="ts">
import ThemedImg from '@/components/ThemedImg.vue'
import { Vue3Marquee } from 'vue3-marquee'
import { Card } from '@/components/ui/card'
import { MailIcon } from 'lucide-vue-next'
</script>

<template>
  <section id="learn-more" v-bind="$attrs">
    <h2 class="text-4xl font-black text-center mb-12">
      {{ $t('pages.home.features.title') }}
    </h2>
    <div class="flex gap-4 flex-wrap">
      <div class="flex gap-4 flex-wrap w-full">
        <a
          href="/docs/get-started/advanced-usage/teams"
          class="flex-1 min-w-80 h-80 relative hover:brightness-90 transition-all"
        >
          <Card class="w-full h-full relative overflow-clip group">
            <div class="absolute z-10 w-full flex flex-col items-center p-4 pt-8">
              <h3 class="text-2xl font-semibold">
                {{ $t('pages.home.features.cards.teams.title') }}
              </h3>
              <p>{{ $t('pages.home.features.cards.teams.description') }}</p>
            </div>

            <ThemedImg
              dark-img="https://r2.discordanalytics.xyz/images/home/teams_dark.png"
              light-img="https://r2.discordanalytics.xyz/images/home/teams_light.png"
              :alt="$t('pages.home.features.cards.teams.title')"
              class="w-full absolute bottom-4"
            />

            <span
              class="absolute top-0 w-full h-3/4 bg-linear-to-b from-background from-40% to-transparent"
            />
          </Card>
        </a>
        <a
          href="/docs/reference/graphs"
          class="flex-2 min-w-80 h-80 relative hover:brightness-90 transition-all"
        >
          <Card class="w-full h-full relative overflow-clip group">
            <div class="relative">
              <Vue3Marquee :duration="75">
                <ThemedImg
                  dark-img="https://r2.discordanalytics.xyz/images/home/graphs_dark.png"
                  light-img="https://r2.discordanalytics.xyz/images/home/graphs_light.png"
                  :alt="$t('pages.home.features.cards.graphs.title')"
                  class="max-h-80!"
                />
              </Vue3Marquee>

              <div
                class="absolute top-0 left-0 w-full h-full bg-white/50 dark:bg-black/50 z-10 text-center flex flex-col items-center justify-center gap-2"
              >
                <h2 class="text-4xl font-bold mb-4">
                  {{ $t('pages.home.features.cards.graphs.title') }}
                </h2>
                <p class="text-balance mb-4 max-w-96">
                  {{ $t('pages.home.features.cards.graphs.description') }}
                </p>
              </div>
            </div>
          </Card>
        </a>
        <a
          href="/docs/get-started/votes-integration"
          class="flex-1 min-w-80 h-80 relative hover:brightness-90 transition-all"
        >
          <Card class="w-full h-full relative overflow-clip group">
            <div class="absolute z-10 w-full flex flex-col items-center p-4 pt-8">
              <h3 class="text-2xl font-semibold">
                {{ $t('pages.home.features.cards.votes.title') }}
              </h3>
              <p>{{ $t('pages.home.features.cards.votes.description') }}</p>
            </div>

            <ThemedImg
              dark-img="https://r2.discordanalytics.xyz/images/home/vote_providers_dark.png"
              light-img="https://r2.discordanalytics.xyz/images/home/vote_providers_light.png"
              :alt="$t('pages.home.features.cards.votes.title')"
              class="w-full absolute bottom-0"
            />

            <span
              class="absolute top-0 w-full h-3/4 bg-linear-to-b from-background from-40% to-transparent"
            />
          </Card>
        </a>
      </div>
      <div class="flex gap-4 flex-wrap w-full">
        <RouterLink to="#" class="flex-1 min-w-80 h-80 relative hover:brightness-90 transition-all">
          <Card class="w-full h-full relative overflow-clip group flex items-center flex-col gap-4">
            <div class="w-full flex flex-col items-center p-4 pt-8">
              <h3 class="text-2xl font-semibold">
                {{ $t('pages.home.features.cards.email.title') }}
              </h3>
              <p>{{ $t('pages.home.features.cards.email.description') }}</p>
            </div>

            <div class="flex rounded-md border p-4 m-4 gap-2">
              <MailIcon class="h-10 w-10 mr-2" />
              <div>
                <p class="font-semibold">
                  {{ $t('pages.home.features.cards.email.preview.sender') }}
                </p>
                <p>{{ $t('pages.home.features.cards.email.preview.subject') }}</p>
              </div>
              <p class="opacity-50 text-sm text-nowrap">
                {{ $t('pages.home.features.cards.email.preview.time') }}
              </p>
            </div>
          </Card>
        </RouterLink>
        <a
          href="/docs/reference/achievements"
          class="flex-1 min-w-80 h-80 relative hover:brightness-90 transition-all"
        >
          <Card class="w-full h-full relative overflow-clip group">
            <div class="absolute z-10 w-full flex flex-col items-center p-4 pt-8">
              <h3 class="text-2xl font-semibold">
                {{ $t('pages.home.features.cards.achievements.title') }}
              </h3>
              <p class="text-balance mb-4 text-center max-w-96">
                {{ $t('pages.home.features.cards.achievements.description') }}
              </p>
            </div>

            <ThemedImg
              dark-img="https://r2.discordanalytics.xyz/images/home/achievements_dark.png"
              light-img="https://r2.discordanalytics.xyz/images/home/achievements_light.png"
              :alt="$t('pages.home.features.cards.achievements.title')"
              class="w-full absolute bottom-4"
            />

            <span
              class="absolute top-0 w-full h-3/4 bg-linear-to-b from-background from-40% to-transparent"
            />
          </Card>
        </a>
        <RouterLink to="#" class="flex-1 min-w-80 h-80 relative hover:brightness-90 transition-all">
          <Card class="w-full h-full relative overflow-clip group">
            <div class="absolute bottom-0 z-10 w-full flex flex-col items-center p-4 pt-8">
              <h3 class="text-2xl font-semibold">
                {{ $t('pages.home.features.cards.custom_graphs.title') }}
              </h3>
              <p class="text-balance mb-4 text-center max-w-96">
                {{ $t('pages.home.features.cards.custom_graphs.description') }}
              </p>
            </div>

            <ThemedImg
              dark-img="https://r2.discordanalytics.xyz/images/home/custom_graphs_dark.png"
              light-img="https://r2.discordanalytics.xyz/images/home/custom_graphs_light.png"
              :alt="$t('pages.home.features.cards.custom_graphs.title')"
              class="w-full absolute top-2 left-2"
            />

            <span
              class="absolute bottom-0 w-full h-3/4 bg-linear-to-t from-background from-40% to-transparent"
            />
          </Card>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
