<script setup lang="ts">
import { SparklesIcon } from '@lucide/vue'

import { ThemedImg } from '@/components'
import { Badge, Button } from '@/components/ui'
import { cn } from '@/lib/utils.ts'
import { vReveal } from '@/utils/reveal.ts'
import scrollTo from '@/utils/scrollTo.ts'
</script>

<template>
  <header
    :class="
      cn('relative w-full flex flex-col items-center gap-8', $attrs.class as string | undefined)
    "
  >
    <div class="flex flex-col items-center justify-center gap-8 h-full md:mt-52">
      <Badge v-reveal variant="default" class="hover:bg-primary">
        <SparklesIcon class="w-4 h-4" />
        {{ $t('pages.home.hero.tag') }}
      </Badge>
      <h1 v-reveal="80" class="text-6xl font-black text-center text-balance">
        {{ $t('pages.home.hero.title') }}
      </h1>
      <p v-reveal="160" class="text-center text-balance md:max-w-[50%]">
        {{ $t('pages.home.hero.description') }}
      </p>
      <div v-reveal="240" class="flex items-center gap-2">
        <RouterLink to="/dash">
          <Button class="transition-transform hover:-translate-y-0.5">
            {{ $t('pages.home.hero.cta.primary') }}
          </Button>
        </RouterLink>
        <Button
          variant="secondary"
          class="transition-transform hover:-translate-y-0.5"
          @click="scrollTo('integration')"
        >
          {{ $t('pages.home.hero.cta.secondary') }}
        </Button>
      </div>

      <p v-reveal="320" class="text-sm text-muted-foreground text-center text-balance">
        {{ $t('pages.home.hero.works_with') }}
      </p>

      <div
        v-reveal="400"
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
