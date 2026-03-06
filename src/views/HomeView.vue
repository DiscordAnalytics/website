<script setup lang="ts">
import PageLayout from '@/components/layouts/PageLayout.vue'
import { onMounted } from 'vue'
import scrollTo from '@/utils/scrollTo.ts'
import {
  HomeContributors,
  HomeCTA,
  HomeFaq,
  HomeHeroHeader,
  HomeLearnMore,
} from '@/components/home'

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
