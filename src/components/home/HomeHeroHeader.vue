<script setup lang="ts">
import { Button } from '@/components/ui/button'
import ThemedImg from '@/components/ThemedImg.vue'
import scrollTo from '@/utils/scrollTo.ts'
import { cn } from '@/lib/utils.ts'
import { Badge } from '@/components/ui/badge'
import { SparklesIcon } from '@lucide/vue'
</script>

<template>
  <header
    :class="
      cn('relative w-full flex flex-col items-center gap-8', $attrs.class as string | undefined)
    "
  >
    <div class="flex flex-col items-center justify-center gap-8 h-full md:mt-52">
      <Badge variant="default" class="hover:bg-primary">
        <SparklesIcon class="w-4 h-4" />
        {{ $t('pages.home.hero.tag') }}
      </Badge>
      <h1 class="text-6xl font-black text-center text-balance">
        {{ $t('pages.home.hero.title') }}
      </h1>
      <p class="text-center text-balance md:max-w-[50%]">
        {{ $t('pages.home.hero.description') }}
      </p>
      <div class="flex items-center gap-2">
        <RouterLink to="/dash">
          <Button>{{ $t('pages.home.hero.cta.primary') }}</Button>
        </RouterLink>
        <Button variant="secondary" @click="scrollTo('learn-more')">
          {{ $t('pages.home.hero.cta.secondary') }}
        </Button>
      </div>

      <div
        class="relative max-w-[95%] lg:max-w-6xl rounded-t-lg border-t border-l border-r border-primary md:mt-20 overflow-clip max-h-112"
      >
        <ThemedImg
          dark-img="https://r2.discordanalytics.xyz/images/home/header_image_dark.webp"
          light-img="https://r2.discordanalytics.xyz/images/home/header_image_light.webp"
          :alt="$t('pages.home.hero.image_alt')"
        />
        <span class="absolute bottom-0 w-full h-96 bg-linear-to-t from-background to-transparent" />
      </div>
    </div>
  </header>
</template>
