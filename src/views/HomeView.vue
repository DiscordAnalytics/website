<script setup lang="ts">
import { onMounted } from 'vue'

import {
  HomeCTA,
  HomeContributors,
  HomeFaq,
  HomeHeroHeader,
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
    <HomeHeroHeader class="pb-16 md:pb-48" />

    <HomeLearnMore class="py-16 md:py-48" />

    <HomeContributors class="py-16 md:py-48" />

    <HomeFaq class="py-16 md:py-48" />

    <HomeCTA class="pb-72" />
  </PageLayout>
</template>
