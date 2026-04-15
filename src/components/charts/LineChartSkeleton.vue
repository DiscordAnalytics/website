<template>
  <svg width="100%" :viewBox="`0 0 ${W} ${H}`" class="block overflow-visible">
    <!-- Grid lines -->
    <line
      v-for="y in gridLines"
      :key="y"
      x1="0"
      :y1="y"
      :x2="W"
      :y2="y"
      stroke="currentColor"
      stroke-width="0.5"
      class="text-border"
    />

    <!-- Animating trace -->
    <path
      :d="linePath"
      fill="none"
      stroke="currentColor"
      stroke-width="1"
      stroke-linecap="round"
      stroke-dasharray="600"
      stroke-dashoffset="600"
      class="lcs-trace text-primary/10"
    />
  </svg>
</template>

<script setup lang="ts">
const W = 280 as const
const H = 100 as const

const gridLines: number[] = [0, 33, 66, 99]

const linePath = 'M0,70 C40,60 70,80 110,50 C150,20 190,40 230,30 L280,25'
</script>
