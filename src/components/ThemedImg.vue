<script setup lang="ts">
import { useColorMode, usePreferredDark } from '@vueuse/core'
import { computed } from 'vue'

defineProps<{
  darkImg: string
  lightImg: string
  alt: string
}>()

const mode = useColorMode()
const preferDark = usePreferredDark()

const isDark = computed(() => mode.value === 'dark' || (mode.value === 'auto' && preferDark.value))
</script>

<template>
  <img :src="isDark ? $props.darkImg : $props.lightImg" :alt="$props.alt" :class="$attrs.class" />
</template>
