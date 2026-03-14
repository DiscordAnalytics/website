<script setup lang="ts">
import BotDashLayout from '@/components/layouts/BotDashLayout.vue'
import StatsRangeSelector from '@/components/StatsRangeSelector.vue'
import { ChartContainer, EmptyChart, LineChartSkeleton } from '@/components/charts'
import type { ChartConfig } from '@/utils/types.ts'

defineProps<{
  charts: ChartConfig[]
  isLoading: boolean
}>()
</script>

<template>
  <BotDashLayout>
    <template #header>
      <StatsRangeSelector />
    </template>

    <main class="grid grid-cols-1 xl:grid-cols-2 gap-4 my-8">
      <ChartContainer
        v-for="chart in $props.charts"
        v-slot="{ activeTab }"
        :key="chart.title"
        :title="chart.title"
        :description="chart.description"
        :tabs="
          chart.tabs.map((tab) => ({ ...tab, value: chart.getValue(chart.data, tab.id) ?? 0 }))
        "
        :is-loading="$props.isLoading"
        :class="`col-span-${chart.colSpan ?? 1}`"
      >
        <LineChartSkeleton v-if="$props.isLoading" class="w-full" />
        <EmptyChart v-else-if="chart.isEmpty(chart.data, activeTab)" />
        <component
          :is="chart.component"
          v-else
          :data="chart.data"
          :tabs="chart.tabs"
          :active-tab="activeTab"
        />
      </ChartContainer>
    </main>
  </BotDashLayout>
</template>
