<script setup lang="ts">
import { ArrowRightIcon } from '@lucide/vue'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { MarketingCTA, MarketingHeader, MarketingShowcase, PageLayout } from '@/components'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Skeleton,
} from '@/components/ui'
import { useAchievementsStore, useLoading, useSeo } from '@/composables'
import { APIScope } from '@/utils/api'
import { FEATURE_IMAGES } from '@/utils/featureImages.ts'
import { vReveal } from '@/utils/reveal.ts'

const { t } = useI18n()
const prefix = 'pages.features.pages.achievements'

useSeo({
  title: () => t(`${prefix}.seo.title`),
  description: () => t(`${prefix}.seo.description`),
})

const SHOWCASED_COUNT = 6

const defaults = [
  { key: 1, percent: 64 },
  { key: 2, percent: 38 },
  { key: 3, percent: 91 },
]

const { achievements, fetch } = useAchievementsStore(APIScope.Guest)
const { isLoading, withLoading } = useLoading()

/** One per goal type first — the store is dominated by near-identical server-count entries. */
const showcased = computed(() => {
  const seen = new Set<string>()
  const primary = []
  const rest = []
  for (const achievement of achievements.value) {
    if (seen.has(achievement.objective.type)) rest.push(achievement)
    else {
      seen.add(achievement.objective.type)
      primary.push(achievement)
    }
  }
  return [...primary, ...rest].slice(0, SHOWCASED_COUNT)
})

const langLabel = (lang?: string) =>
  t(`components.navbar.customize.language.locales.${lang === 'fr' || lang === 'tr' ? lang : 'en'}`)

onMounted(() => withLoading(fetch).catch(() => {}))
</script>

<template>
  <PageLayout>
    <MarketingHeader
      class="pt-16 md:pt-32 pb-12"
      :title="$t(`${prefix}.title`)"
      :description="$t(`${prefix}.description`)"
    >
      <RouterLink to="/dash">
        <Button class="transition-transform hover:-translate-y-0.5">
          {{ $t('pages.features.cta.primary') }}
        </Button>
      </RouterLink>
    </MarketingHeader>

    <MarketingShowcase
      :clip="false"
      class="lg:max-w-2xl max-w-md"
      :dark-img="FEATURE_IMAGES.achievements.dark"
      :light-img="FEATURE_IMAGES.achievements.light"
      :alt="$t(`${prefix}.image_alt`)"
    />

    <section class="py-16 md:py-32 max-w-300 mx-auto w-full">
      <h2 v-reveal class="text-3xl md:text-4xl font-black text-center text-balance">
        {{ $t(`${prefix}.defaults.title`) }}
      </h2>
      <p
        v-reveal="80"
        class="mt-4 text-center text-balance text-muted-foreground max-w-2xl mx-auto"
      >
        {{ $t(`${prefix}.defaults.description`) }}
      </p>

      <div class="mt-12 grid gap-4 md:grid-cols-3">
        <Card v-for="(item, index) in defaults" :key="item.key" v-reveal="index * 100">
          <CardHeader>
            <CardTitle>{{ $t(`${prefix}.defaults.${item.key}.title`) }}</CardTitle>
            <CardDescription>
              {{ $t(`${prefix}.defaults.${item.key}.description`) }}
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-2">
            <Progress :model-value="item.percent" />
            <span class="text-sm text-muted-foreground">
              {{ $t('pages.dash.achievements.percent', { percent: item.percent }) }}
            </span>
          </CardContent>
        </Card>
      </div>
    </section>

    <section v-if="isLoading || showcased.length" class="pb-16 md:pb-32 max-w-300 mx-auto w-full">
      <h2 v-reveal class="text-3xl md:text-4xl font-black text-center text-balance">
        {{ $t(`${prefix}.store.title`) }}
      </h2>
      <p
        v-reveal="80"
        class="mt-4 text-center text-balance text-muted-foreground max-w-2xl mx-auto"
      >
        {{ $t(`${prefix}.store.description`) }}
      </p>

      <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <template v-if="isLoading">
          <Skeleton v-for="i in SHOWCASED_COUNT" :key="i" class="h-36 w-full rounded-xl" />
        </template>
        <Card
          v-for="(achievement, index) in showcased"
          v-else
          :key="achievement.id"
          v-reveal="(index % 3) * 100"
          class="h-full"
        >
          <CardHeader>
            <CardTitle class="truncate">
              {{ achievement.title.replace(/{username}/g, 'Cool Bot') }}
            </CardTitle>
            <CardDescription class="line-clamp-2">
              {{ achievement.description.replace(/{username}/g, 'Cool Bot') }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{{ langLabel(achievement.lang) }}</Badge>
          </CardContent>
        </Card>
      </div>

      <div v-reveal="160" class="mt-10 flex justify-center">
        <RouterLink to="/community/achievements">
          <Button variant="secondary" class="gap-2">
            {{ $t(`${prefix}.store.cta`) }}
            <ArrowRightIcon class="size-4" />
          </Button>
        </RouterLink>
      </div>
    </section>

    <MarketingCTA class="pb-16 md:pb-32" />
  </PageLayout>
</template>
