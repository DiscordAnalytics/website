<script setup lang="ts">
import { ThemedImg } from '@/components'
import { cn } from '@/lib/utils.ts'
import { vReveal } from '@/utils/reveal.ts'

withDefaults(
  defineProps<{
    darkImg: string
    lightImg: string
    alt: string
    clip?: boolean
  }>(),
  { clip: true },
)
</script>

<template>
  <div
    v-reveal
    :class="
      cn(
        'relative mx-auto w-full max-w-[95%] lg:max-w-6xl overflow-clip',
        clip ? 'rounded-t-lg border-t border-l border-r border-primary max-h-112' : 'rounded-lg',
        $attrs.class as string | undefined,
      )
    "
  >
    <ThemedImg :dark-img="darkImg" :light-img="lightImg" :alt="alt" class="w-full" />
    <span
      v-if="clip"
      class="absolute bottom-0 w-full h-96 bg-linear-to-t from-background to-transparent"
    />
  </div>
</template>
