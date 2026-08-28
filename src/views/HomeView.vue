<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  HomeContributors,
  HomeFaq,
  HomeHeroHeader,
  HomeIntegration,
  HomeLearnMore,
  MarketingCTA,
  PageLayout,
} from '@/components'
import { useSeo } from '@/composables'
import scrollTo from '@/utils/scrollTo.ts'

const { t } = useI18n()

useSeo({
  title: () => t('pages.home.seo.title'),
  description: () => t('pages.home.seo.description'),
})

onMounted(() => {
  if (window.location.hash) scrollTo(window.location.hash.substring(1))
})
</script>

<template>
  <PageLayout>
    <HomeHeroHeader class="pb-16 md:pb-32" />

    <HomeIntegration class="py-16 md:py-32" />

    <HomeLearnMore class="py-16 md:py-48" />

    <HomeFaq class="py-16 md:py-48" />

    <HomeContributors class="py-16 md:py-48" />

    <MarketingCTA class="py-16 md:py-32" />
  </PageLayout>
</template>
