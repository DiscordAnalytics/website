<script setup lang="ts">
import { SparklesIcon } from '@lucide/vue'

import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils.ts'
import { vReveal } from '@/utils/reveal.ts'

defineProps<{
  title: string
  description: string
  badge?: string
}>()
</script>

<template>
  <header
    :class="
      cn(
        'w-full flex flex-col items-center justify-center gap-8',
        $attrs.class as string | undefined,
      )
    "
  >
    <Badge v-if="badge" v-reveal variant="default" class="hover:bg-primary">
      <SparklesIcon class="w-4 h-4" />
      {{ badge }}
    </Badge>
    <h1 v-reveal="80" class="text-5xl md:text-6xl font-black text-center text-balance">
      {{ title }}
    </h1>
    <p v-reveal="160" class="text-center text-balance md:max-w-[50%]">
      {{ description }}
    </p>
    <div
      v-if="$slots.default"
      v-reveal="240"
      class="flex flex-wrap justify-center items-center gap-2"
    >
      <slot />
    </div>
  </header>
</template>
