<script setup lang="ts">
import { ThemedImg } from '@/components'
import { cn } from '@/lib/utils.ts'
import { vReveal } from '@/utils/reveal.ts'

defineProps<{
  title: string
  description?: string
  darkImg?: string
  lightImg?: string
  alt?: string
  reverse?: boolean
}>()
</script>

<template>
  <section
    :class="
      cn(
        'max-w-300 mx-auto w-full flex flex-col gap-10 lg:gap-16 items-center',
        reverse ? 'lg:flex-row-reverse' : 'lg:flex-row',
        $attrs.class as string | undefined,
      )
    "
  >
    <div class="w-full lg:w-1/2 flex flex-col gap-4">
      <h2 v-reveal class="text-3xl md:text-4xl font-black text-balance">{{ title }}</h2>
      <p v-reveal="80" v-if="description" class="text-muted-foreground text-balance">
        {{ description }}
      </p>
      <div v-if="$slots.default" v-reveal="160" class="mt-2">
        <slot />
      </div>
    </div>

    <div v-reveal="120" class="w-full lg:w-1/2">
      <slot name="media">
        <ThemedImg
          v-if="darkImg && lightImg"
          :dark-img="darkImg"
          :light-img="lightImg"
          :alt="alt ?? title"
          class="w-full rounded-lg border"
        />
      </slot>
    </div>
  </section>
</template>
