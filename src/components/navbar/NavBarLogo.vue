<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { isChristmas } from '.'

const mode = useColorMode()

function getLogoPath(): string {
  const suffix = isChristmas ? '_christmas' : ''
  return `/brand/long_logo_${mode.value}${suffix}.webp`
}
</script>

<template>
  <RouterLink to="/">
    <img :src="getLogoPath()" alt="Discord Analytics" class="w-16" />
  </RouterLink>
</template>
