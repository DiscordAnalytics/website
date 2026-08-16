<script setup lang="ts">
import { ThemedImg } from '@/components'
import { Button } from '@/components/ui'
</script>

<template>
  <section id="cta" class="flex flex-col gap-6 items-center">
    <ThemedImg
      dark-img="https://r2.discordanalytics.xyz/images/brand/long_logo_dark.webp"
      light-img="https://r2.discordanalytics.xyz/images/brand/long_logo_light.webp"
      alt="Discord Analytics"
      class="sm:w-48 w-28"
    />
    <h2 class="text-4xl font-bold text-center">
      {{ $t('pages.home.cta.start') }}
    </h2>
    <div class="flex flex-col items-center gap-3">
      <RouterLink to="/dash">
        <Button>
          {{ $t('pages.home.cta.sign_up') }}
        </Button>
      </RouterLink>
      <p class="text-sm text-muted-foreground text-center text-balance">
        {{ $t('pages.home.cta.reassurance') }}
      </p>
    </div>
  </section>
</template>
