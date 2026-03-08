<script setup lang="ts">
import { NavBar } from '@/components/navbar'
import Footer from '@/components/Footer.vue'
import { cn } from '@/lib/utils.ts'

withDefaults(
  defineProps<{
    navbar?: boolean
    footer?: boolean
  }>(),
  {
    navbar: true,
    footer: true,
  },
)
</script>

<template>
  <main
    :class="
      cn(
        'max-w-425 mx-auto px-4 min-h-screen flex flex-col',
        $props.footer ? 'justify-between' : '',
      )
    "
  >
    <NavBar v-if="$props.navbar" />

    <slot />

    <Footer v-if="$props.footer" />
  </main>
</template>
