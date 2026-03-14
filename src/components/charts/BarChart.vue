<script setup lang="ts">
import { type ChartConfig, ChartTooltipContent, componentToString } from '@/components/ui/chart'
import { VisAxis, VisCrosshair, VisStackedBar, VisTooltip, VisXYContainer } from '@unovis/vue'
import type { ChartData, ChartTab } from '@/utils/types'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    data: ChartData[]
    activeTab: string
    tabs: Omit<ChartTab, 'value'>[]
    tickFormatter: (d: number | Date) => string
  }>(),
  {
    tickFormatter: (d: number | Date) => {
      return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    },
  },
)

const chartConfig = computed(() => {
  return props.tabs.reduce((config, tab, index) => {
    config[tab.id] = {
      label: tab.label,
      color: `var(--chart-${index + 1})`,
    }
    return config
  }, {} as ChartConfig)
})
</script>

<template>
  <VisXYContainer
    :data="
      $props.data.map((e) => ({
        ...e,
        _active: e[props.activeTab as keyof typeof e],
      }))
    "
    :y-domain="[0, undefined]"
  >
    <VisStackedBar
      :x="(d: ChartData) => d.date"
      :y="(d: ChartData) => d._active"
      color="var(--chart-1)"
      :bar-padding="0.1"
      :rounded-corners="false"
    />
    <VisAxis
      type="x"
      :x="(d: ChartData) => d.date"
      :tick-line="false"
      :domain-line="false"
      :grid-line="false"
      :tick-format="$props.tickFormatter"
    />
    <VisAxis type="y" :num-ticks="3" :tick-line="false" :domain-line="false" />
    <VisTooltip />
    <VisCrosshair
      :template="
        componentToString(chartConfig, ChartTooltipContent, {
          labelFormatter: $props.tickFormatter,
        })
      "
      color="#0000"
    />
  </VisXYContainer>
</template>
