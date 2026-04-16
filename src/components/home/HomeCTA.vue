<script setup lang="ts">
import { Button } from '@/components/ui/button'
import ThemedImg from '@/components/ThemedImg.vue'
</script>

<template>
  <section id="cta" class="flex flex-col gap-6 items-center">
    <ThemedImg
      dark-img="https://r2.discordanalytics.xyz/images/brand/long_logo_dark.webp"
      light-img="https://r2.discordanalytics.xyz/images/brand/long_logo_light.webp"
      alt="Discord Analytics"
      class="sm:w-48 w-28"
    />
    <h1 class="text-4xl font-bold text-center">
      {{ $t('pages.home.cta.start') }}
    </h1>
    <Button href="/dash">
      {{ $t('pages.home.cta.sign_up') }}
    </Button>
  </section>
</template>
