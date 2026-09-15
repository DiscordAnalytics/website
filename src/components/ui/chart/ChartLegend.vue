<script setup lang="ts">
import type { BulletLegendItemInterface } from '@unovis/ts'
import { BulletLegend } from '@unovis/ts'
import { VisBulletLegend } from '@unovis/vue'
import { nextTick, onMounted, ref } from 'vue'

import { buttonVariants } from '@/components/ui'

const props = withDefaults(defineProps<{ items: BulletLegendItemInterface[] }>(), {
  items: () => [],
})

const emits = defineEmits<{
  legendItemClick: [d: BulletLegendItemInterface, i: number]
  'update:items': [payload: BulletLegendItemInterface[]]
}>()

const elRef = ref<HTMLElement>()

function keepStyling() {
  const selector = `.${BulletLegend.selectors.item}`
  nextTick(() => {
    const elements = elRef.value?.querySelectorAll(selector)
    const classes = buttonVariants({ variant: 'ghost', size: 'xs' }).split(' ')

    elements?.forEach((el) => el.classList.add(...classes, '!inline-flex', '!mr-2'))
  })
}

onMounted(() => {
  keepStyling()
})

function onLegendItemClick(d: BulletLegendItemInterface, i: number) {
  emits('legendItemClick', d, i)
  emits(
    'update:items',
    props.items.map((item, index) => (index === i ? { ...item, inactive: !item.inactive } : item)),
  )
  keepStyling()
}
</script>

<template>
  <div
    ref="elRef"
    class="w-max max-w-full"
    :style="{
      '--vis-legend-bullet-size': '16px',
    }"
  >
    <VisBulletLegend :items="items" :on-legend-item-click="onLegendItemClick" />
  </div>
</template>
