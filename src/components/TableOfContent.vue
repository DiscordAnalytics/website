<script setup lang="ts">
import type { Anchor } from '@/utils/types.ts'

defineProps<{
  anchors: Anchor[]
}>()
</script>

<template>
  <ul v-if="anchors" class="space-y-1">
    <li v-for="anchor in anchors" :key="anchor.id" class="space-y-1">
      <a :href="`#${anchor.link}`" class="block text-sm/6 truncate hover:opacity-80 transition">
        {{ anchor.text }}
      </a>

      <TableOfContent v-if="anchor.children" :anchors="anchor.children" />
    </li>
  </ul>
</template>
