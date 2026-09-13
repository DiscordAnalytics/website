<script setup lang="ts">
import type { BulletLegendItemInterface } from '@unovis/ts'
import { Donut } from '@unovis/ts'
import { VisDonut, VisSingleContainer } from '@unovis/vue'
import { computed, ref } from 'vue'

import { type ChartConfig, ChartLegend, ChartSingleTooltip } from '@/components/ui'
import { useLocale } from '@/composables'
import type { ChartData, ChartTab } from '@/utils/types'

const props = defineProps<{
  data: ChartData[]
  activeTab: string
  tabs: Omit<ChartTab, 'value'>[]
}>()

const { getLocaleName } = useLocale()

const hiddenNames = ref(new Set<string>())

const chartConfig = computed(() => {
  return props.data.reduce((config, data, index) => {
    config[data.name as string] = {
      label: data.name as string,
      color: `var(--chart-${index + 1})`,
    }
    return config
  }, {} as ChartConfig)
})

const visibleData = computed(() =>
  props.data.filter((item) => !hiddenNames.value.has(item.name as string)),
)

const legendItems = computed<BulletLegendItemInterface[]>(() =>
  props.data.map((item) => ({
    name: getLocaleName(item.name as string) ?? (item.name as string),
    color: chartConfig.value[item.name as string]!.color,
    inactive: hiddenNames.value.has(item.name as string),
  })),
)

function onUpdateLegendItems(items: BulletLegendItemInterface[]) {
  hiddenNames.value = new Set(
    props.data.filter((_, i) => items[i]?.inactive).map((item) => item.name as string),
  )
}
</script>

<template>
  <div class="flex flex-col justify-center text-xs relative mx-auto max-h-full">
    <VisSingleContainer
      :data="
        visibleData.map((e) => ({
          ...e,
          _active: e[props.activeTab as keyof typeof e],
        }))
      "
      :margin="{ top: 30, bottom: 30 }"
    >
      <VisDonut
        :value="(d: ChartData) => d.count"
        :color="(d: ChartData) => chartConfig[d.name as string]!.color"
        :arc-width="0"
      />
      <ChartSingleTooltip
        :selector="Donut.selectors.segment"
        index="count"
        :items="
          visibleData.map((item) => ({
            name: getLocaleName(item.name as string) ?? (item.name as string),
            color: chartConfig[item.name as string]!.color,
            inactive: false,
          }))
        "
        :value-formatter="(tick: number) => `${tick.toLocaleString()}`"
      />
    </VisSingleContainer>

    <ChartLegend :items="legendItems" @update:items="onUpdateLegendItems" />
  </div>
</template>
