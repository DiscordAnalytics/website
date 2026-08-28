<script setup lang="ts">
import {
  CalendarRangeIcon,
  MousePointerClickIcon,
  ServerIcon,
  ThumbsUpIcon,
  UsersIcon,
} from '@lucide/vue'
import { useI18n } from 'vue-i18n'

import {
  MarketingCTA,
  MarketingHeader,
  MarketingShowcase,
  MarketingSplit,
  PageLayout,
} from '@/components'
import {
  Button,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui'
import { useSeo } from '@/composables'
import { FEATURE_IMAGES } from '@/utils/featureImages.ts'
import { vReveal } from '@/utils/reveal.ts'

const { t } = useI18n()
const prefix = 'pages.features.pages.graphs'

useSeo({
  title: () => t(`${prefix}.seo.title`),
  description: () => t(`${prefix}.seo.description`),
})

const statsPages = [
  { key: 'interactions', icon: MousePointerClickIcon },
  { key: 'guilds', icon: ServerIcon },
  { key: 'users', icon: UsersIcon },
  { key: 'votes', icon: ThumbsUpIcon },
]
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
      :dark-img="FEATURE_IMAGES.interactionsPage.dark"
      :light-img="FEATURE_IMAGES.interactionsPage.light"
      :alt="$t(`${prefix}.image_alt`)"
    />

    <section class="py-16 md:py-32">
      <h2 v-reveal class="text-3xl md:text-4xl font-black text-center text-balance">
        {{ $t(`${prefix}.pages_section.title`) }}
      </h2>
      <p
        v-reveal="80"
        class="mt-4 text-center text-balance text-muted-foreground max-w-2xl mx-auto"
      >
        {{ $t(`${prefix}.pages_section.description`) }}
      </p>

      <ItemGroup class="max-w-300 mx-auto w-full mt-12 grid gap-4 md:grid-cols-2">
        <Item
          v-for="(page, index) in statsPages"
          :key="page.key"
          v-reveal="(index % 2) * 100"
          variant="outline"
        >
          <ItemMedia variant="icon">
            <component :is="page.icon" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{{ $t(`${prefix}.pages_section.${page.key}.title`) }}</ItemTitle>
            <ItemDescription>
              {{ $t(`${prefix}.pages_section.${page.key}.description`) }}
            </ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </section>

    <MarketingSplit
      class="pb-16 md:pb-32"
      :title="$t(`${prefix}.range.title`)"
      :description="$t(`${prefix}.range.description`)"
      :dark-img="FEATURE_IMAGES.rangeSelector.dark"
      :light-img="FEATURE_IMAGES.rangeSelector.light"
      :alt="$t(`${prefix}.range.title`)"
    >
      <Item variant="muted">
        <ItemMedia variant="icon">
          <CalendarRangeIcon />
        </ItemMedia>
        <ItemContent>
          <ItemDescription>{{ $t(`${prefix}.range.presets`) }}</ItemDescription>
        </ItemContent>
      </Item>
    </MarketingSplit>

    <MarketingSplit
      reverse
      class="pb-16 md:pb-32"
      :title="$t(`${prefix}.advanced.title`)"
      :description="$t(`${prefix}.advanced.description`)"
      :dark-img="FEATURE_IMAGES.guildsRankings.dark"
      :light-img="FEATURE_IMAGES.guildsRankings.light"
      :alt="$t(`${prefix}.advanced.title`)"
    />

    <MarketingSplit
      id="reports"
      class="pb-16 md:pb-32 scroll-mt-24"
      :title="$t(`${prefix}.reports.title`)"
      :description="$t(`${prefix}.reports.description`)"
    >
      <template #media>
        <MarketingShowcase
          class="lg:max-w-sm max-w-xs"
          :dark-img="FEATURE_IMAGES.reportEmail.dark"
          :light-img="FEATURE_IMAGES.reportEmail.light"
          :alt="$t(`${prefix}.reports.image_alt`)"
        />
      </template>
    </MarketingSplit>

    <MarketingCTA class="pb-16 md:pb-32" />
  </PageLayout>
</template>
