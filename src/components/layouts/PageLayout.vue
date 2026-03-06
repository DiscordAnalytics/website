<script setup lang="ts">
import { NavBar } from '@/components/navbar'
import Footer from '@/components/Footer.vue'

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

    <Footer v-if="$props.footer" />
  </main>
</template>
