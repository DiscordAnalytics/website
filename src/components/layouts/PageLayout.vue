<script setup lang="ts">
import { NavBar } from '@/components/navbar'

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
  <main class="max-w-425 mx-auto px-4">
    <NavBar v-if="$props.navbar" />

    <slot />
  </main>
</template>
