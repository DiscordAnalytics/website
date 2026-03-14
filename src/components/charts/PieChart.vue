<script setup lang="ts">
import { type ChartConfig, ChartLegend, ChartSingleTooltip } from '@/components/ui/chart'
import { VisDonut, VisSingleContainer } from '@unovis/vue'
import type { ChartData, ChartTab } from '@/utils/types.ts'
import { computed } from 'vue'
import { Donut } from '@unovis/ts'

const props = defineProps<{
  data: ChartData[]
  activeTab: string
  tabs: Omit<ChartTab, 'value'>[]
}>()

const chartConfig = computed(() => {
  return props.data.reduce((config, data, index) => {
    config[data.name as string] = {
      label: data.name as string,
      color: `var(--chart-${index + 1})`,
    }
    return config
  }, {} as ChartConfig)
})
</script>

<template>
  <div class="flex flex-col justify-center text-xs relative mx-auto max-h-full">
    <VisSingleContainer
      :data="
        $props.data.map((e) => ({
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
          $props.data.map((item, i) => ({
            name: item.name as string,
            color: `var(--chart-${i + 1})`,
            inactive: false,
          }))
        "
        :value-formatter="(tick: number) => `${tick.toLocaleString()}`"
      />
    </VisSingleContainer>

    <ChartLegend
      :items="
        $props.data.map((item, i) => ({
          name: item.name as string,
          color: `var(--chart-${i + 1})`,
        }))
      "
    />
  </div>
</template>
