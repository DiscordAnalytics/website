<script setup lang="ts">
import { onMounted } from 'vue'

import {
  HomeCTA,
  HomeContributors,
  HomeFaq,
  HomeHeroHeader,
  HomeIntegration,
  HomeLearnMore,
  PageLayout,
} from '@/components'
import scrollTo from '@/utils/scrollTo.ts'

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

    <HomeCTA class="py-16 md:py-32" />
  </PageLayout>
</template>
